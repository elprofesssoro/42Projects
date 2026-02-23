


import express from "express";
import cors from "cors";
import helmet from "helmet";

import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";
import corsConfig from "./config/cors.js";
import rateLimit  from "./middleware/rateLimit.middleware.js";

const app = express();
app.set("trust proxy", 1);

app.use(helmet());
app.use(express.json());

app.use(cors(corsConfig));
app.options(/.*/, cors(corsConfig));

app.set('trust proxy', true);
app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api", routes);
app.use(errorHandler);

export default app;
