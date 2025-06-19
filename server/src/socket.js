const socketIo = require("socket.io");
const userModel = require("./models/user.model");
const driverModel = require("./models/driver.model");

let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Add middleware for validation
    socket.use(([event, data], next) => {
      if (event === "update-location-driver") {
        if (!validateLocation(data.location)) {
          return next(new Error("Invalid location data"));
        }
      }
      next();
    });

    socket.on("join", async (data, callback) => {
      try {
        // Validate input
        if (!data.userId || !data.userType) {
          throw new Error("Missing required fields");
        }

        // Update database
        const updated = await updateDriverSocket(data.userId, socket.id);

        callback({ status: "success", updated });
      } catch (err) {
        callback({ status: "error", message: err.message });
      }
    });

    socket.on("update-location-driver", async (data) => {
      const { userId, location } = data;

      if (!location || !location.ltd || !location.lng) {
        return socket.emit("error", { message: "Invalid location data" });
      }

      await driverModel.findByIdAndUpdate(userId, {
        location: {
          ltd: location.ltd,
          lng: location.lng,
        },
      });
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

const sendMessageToSocketId = (socketId, messageObject) => {
  console.log(messageObject);

  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io not initialized.");
  }
};

module.exports = { initializeSocket, sendMessageToSocketId };
