import { io } from "socket.io-client";

export const initializeSocketConnection = () => {
  const socket = io.connect("http://localhost:3000", {
    withcredentials: true,
  });

  socket.on("connect", () => {
    console.log("Connected to the Socket.io server");
  });
};
