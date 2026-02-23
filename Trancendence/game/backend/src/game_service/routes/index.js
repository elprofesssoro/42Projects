import { Router } from "express";
import matchesRoutes from "./matches.routes.js";

const router = Router();

router.get("/health", (req, res) => res.json({ status: "ok" }));
router.use("/matches", matchesRoutes);

export default router;
