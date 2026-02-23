import "dotenv/config";
import https from "https";  // ← https statt http
import fs from "fs";        // ← Certs
import app from "./app.js";

const PORT = process.env.PORT || 3002;

// ← HTTPS Options (kein CA nötig)
const httpsOptions = {
  key: fs.readFileSync("/app/certs/server.key"),
  cert: fs.readFileSync("/app/certs/server.crt"),
  rejectUnauthorized: false
};

const server = https.createServer(httpsOptions, app);  // ← HTTPS!

server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Auth_service HTTPS on https://localhost:${PORT}`);
});
