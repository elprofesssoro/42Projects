import "dotenv/config";
import https from "https";  // ← https!
import fs from "fs";        // ← Certs
import { Server } from "socket.io";
import app from "./app.js";
import { setupSocket } from "./socket/socket.js";

const PORT = process.env.PORT || 3005;

// ← HTTPS Options
const httpsOptions = {
  key: fs.readFileSync("/app/certs/server.key"),
  cert: fs.readFileSync("/app/certs/server.crt"),
  rejectUnauthorized: false
};

const server = https.createServer(httpsOptions, app);  // ← HTTPS!

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

setupSocket(io);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Tournament_service HTTPS + Socket.IO on https://localhost:${PORT}`);
});

// ← Health/Root (vor listen!)
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Tournament service root OK' });
});
