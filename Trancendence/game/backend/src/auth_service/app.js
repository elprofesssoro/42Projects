import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from 'path';
import cookieParser from 'cookie-parser';

import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";
import corsConfig from "./config/cors.js";
import rateLimit from "./middleware/rateLimit.middleware.js";

const app = express();
app.set("trust proxy", 1);

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsConfig));
app.options(/.*/, cors(corsConfig));

app.set('trust proxy', true);
app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api", routes);

app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "no-store");
    next();
  },
  express.static(path.resolve("uploads"))
);

app.use(errorHandler);

export default app;
