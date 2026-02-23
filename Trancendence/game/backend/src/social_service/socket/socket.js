import jwt from "jsonwebtoken";
import { initIO } from "./io.js";

function verifyToken(token) {
  if (!token) return null;
  try {
    const secret = process.env.JWT_SECRET || process.env.SECRET || "dev_secret";
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}

export const setupSocket = (io) => {
  initIO(io);

  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers?.authorization || "").replace(/^Bearer\s+/i, "");

    const payload = verifyToken(token);
    const userId = Number(payload?.sub ?? payload?.id);

    if (!userId) {
      return next(new Error("unauthorized"));
    }

    socket.data.userId = userId;
    return next();
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    socket.join(`user:${userId}`);

    socket.on("chat:typing", ({ toUserId, isTyping } = {}) => {
      const to = Number(toUserId);
      if (!to) return;

      io.to(`user:${to}`).emit("chat:typing", {
        fromUserId: userId,
        isTyping: Boolean(isTyping),
      });
    });

    socket.on("disconnect", (reason) => {
      // helpful while debugging
      // console.log(`[socket] user ${userId} disconnected: ${reason}`);
    });
  });
};
