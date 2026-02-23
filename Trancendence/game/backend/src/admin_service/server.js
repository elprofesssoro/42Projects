import "dotenv/config";
import https from "https";
import fs from "fs";
import { Server } from "socket.io";
import app from "./app.js";
import { setupSocket } from "./socket/socket.js";

const PORT = process.env.PORT || 3001;

const httpsOptions = {
  key: fs.readFileSync("/app/certs/server.key"),
  cert: fs.readFileSync("/app/certs/server.crt"),
  rejectUnauthorized: false
};

const server = https.createServer(httpsOptions, app);

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

setupSocket(io);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Admin_service HTTPS on https://0.0.0.0:${PORT}`);
});
