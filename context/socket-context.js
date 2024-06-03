// src/SocketContext.js
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const initializeSocket = useCallback((socketUrl) => {
    if (socket) {
      socket.close();
    }

    const newSocket = new WebSocket(socketUrl);

    newSocket.onopen = () => {
      console.log("WebSocket connected");
    };

    newSocket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, initializeSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
