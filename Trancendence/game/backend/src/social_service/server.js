import "dotenv/config";
import https from "https";           // ← https!
import fs from "fs";                 // ← Certs
import { Server } from "socket.io";
import app from "./app.js";
import { setupSocket } from "./socket/socket.js";

const PORT = process.env.PORT || 3004;

// ← HTTPS Options
const httpsOptions = {
  key: fs.readFileSync("/app/certs/server.key"),
  cert: fs.readFileSync("/app/certs/server.crt"),
  rejectUnauthorized: false
};

const server = https.createServer(httpsOptions, app);  // ← HTTPS!

// ✅ Allowed origins (dev + prod)
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "https://localhost:3443,http://localhost:3002")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const io = new Server(server, {
  path: "/socket.io",
  transports: ["websocket", "polling"],
  allowEIO3: false,
  pingInterval: 25000,
  pingTimeout: 60000,
  cors: {
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST"],
  },
});

setupSocket(io);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Social_service HTTPS + Socket.IO on https://0.0.0.0:${PORT}`);
  console.log("Allowed origins:", ALLOWED_ORIGINS);
});
