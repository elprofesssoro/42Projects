
import { Server } from "socket.io";

let io = null;

export const initIO = (ioInstance) => {
  io = ioInstance;
  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
};

