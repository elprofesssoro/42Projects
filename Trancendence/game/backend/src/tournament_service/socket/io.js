
let io = null;

export const initIO = (serverIo) => {
  io = serverIo;
  return io;
};

export const getIO = () => {
  if (!io)
      throw new Error("Socket.IO not initialized");
  return io;
};
