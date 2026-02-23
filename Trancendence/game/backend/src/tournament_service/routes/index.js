import { Router } from "express";
import tournamentsRoutes from "./tournaments.routes.js";

const router = Router();

router.get("/health", (req, res) => res.json({ status: "ok" }));
router.use("/tournaments", tournamentsRoutes);

export default router;
