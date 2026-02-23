import { Router } from "express";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.get("/health", (req, res) => res.json({ status: "ok" }));
router.use("/admin", adminRoutes);

export default router;
