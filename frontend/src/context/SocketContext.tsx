import React, { createContext, useEffect } from "react";
import { io, Socket } from "socket.io-client";

// 1. Define socket context type
interface SocketContextType {
  socket: Socket | null;
}

// 2. Provide default value
const defaultValue: SocketContextType = {
  socket: null,
};

// 3. Create typed context
export const SocketContext = createContext<SocketContextType>(defaultValue);

// 4. Connect to socket
const socket = io(import.meta.env.VITE_BASE_URL as string); // force type for Vite env

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
