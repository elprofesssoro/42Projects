import jwt from "jsonwebtoken";
import { initIO } from "./io.js";

const authenticateSocket = (socket) => {
  const token = socket?.handshake?.auth?.token;
  if (!token)
      return null;

  try {
    const secret = process.env.JWT_SECRET || process.env.SECRET || "dev_secret";
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
};

export const setupSocket = (io) => {
  initIO(io);

  io.on("connection", (socket) => {
    const payload = authenticateSocket(socket);
    const userId = Number(payload?.sub ?? payload?.id);
    if (!userId) {
      socket.disconnect(true);
      return;
    }
    socket.join(`user:${userId}`);
    socket.on("chat:typing", ({ toUserId, isTyping } = {}) => {
      const to = Number(toUserId);
      if (!to)
          return;
      io.to(`user:${to}`).emit("chat:typing", {
        fromUserId: userId,
        isTyping: Boolean(isTyping),
      });
    });
  });
};
