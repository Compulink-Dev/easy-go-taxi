import { useRef, useState } from "react";
import { Link } from "react-router";
import DriverDetails from "../../components/DriverDetails";
import RidePopUp from "../../components/RidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopUp from "../../components/ConfirmRidePopUp";
import { useEffect, useContext } from "react";
import { SocketContext } from "../../context/SocketContext";
import { DriverDataContext } from "../../context/DriverContext";
import axios from "axios";
import Title from "@/components/Title";
import { LogOut } from "lucide-react";

interface Ride {
  _id: string;
  // ... other fields
}

const DriverHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ride, setRide] = useState<Ride | null>(null);
  const { socket } = useContext(SocketContext);
  const { driver } = useContext(DriverDataContext);

  console.log("Driver :", driver);
  console.log("Socket :", socket);

  // Show loading state if driver data isn't available yet
  // if (!driver || !socket) {
  //   return (
  //     <div className="h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
  //         <p>Connecting to driver services...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // Confirm ride function
  const confirmRide = async () => {
    if (!ride || !driver) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        {
          rideId: ride._id,
          driverId: driver._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setRidePopupPanel(false);
        setConfirmRidePopupPanel(true);
      }
    } catch (error) {
      console.error("Error confirming ride:", error);
      // Handle error (show toast/message to user)
    }
  };

  // Animation effects
  useGSAP(() => {
    gsap.to(ridePopupPanelRef.current, {
      transform: ridePopupPanel ? "translateY(0)" : "translateY(100%)",
    });
  }, [ridePopupPanel]);

  useGSAP(() => {
    gsap.to(confirmRidePopupPanelRef.current, {
      transform: confirmRidePopupPanel ? "translateY(0)" : "translateY(100%)",
    });
  }, [confirmRidePopupPanel]);

  useEffect(() => {
    if (!socket || !driver) {
      setLoading(false);
      return;
    }

    socket?.emit("join", {
      userId: driver._id,
      userType: "driver",
    });

    const handleConnection = async () => {
      try {
        await socket.emitWithAck("join", {
          userId: driver._id,
          userType: "driver",
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to connect to driver services");
        setLoading(false);
      }
    };

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            socket?.emit("update-location-driver", {
              userId: driver._id,
              location: {
                ltd: position.coords.latitude,
                lng: position.coords.longitude,
              },
            });
          },
          (error) => {
            console.error("Geolocation error:", error);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      }
    };

    // Initial update and set interval
    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation();

    handleConnection();
    // Cleanup
    return () => {
      clearInterval(locationInterval);
      socket.emit("leave", { userId: driver._id });
    };
  }, [socket, driver]);

  // Socket listener should be inside useEffect to avoid multiple registrations
  useEffect(() => {
    if (!socket) return;

    const handleNewRide = (data: Ride) => {
      setRide(data);
      setRidePopupPanel(true);
    };
    socket?.on("new-ride", (data) => {
      setRide(data);
      setRidePopupPanel(true);
    });

    return () => {
      socket.off("new-ride", handleNewRide);
    };
  }, [socket]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Connecting to driver services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <div className="fixed top-0 right-0 flex items-center justify-between w-full px-4">
        <div className="my-4">
          <Title />
        </div>
        <Link
          to="/driver-home"
          className=" h-8 w-8 bg-yellow-400 flex items-center justify-center rounded-full"
        >
          <LogOut size={14} className="text-black" />
        </Link>
      </div>
      <div className="h-3/5">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />
      </div>
      <div className="h-2/5 p-6">
        <DriverDetails />
      </div>
      <div
        ref={ridePopupPanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      </div>
      <div
        ref={confirmRidePopupPanelRef}
        className="fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  );
};

export default DriverHome;
