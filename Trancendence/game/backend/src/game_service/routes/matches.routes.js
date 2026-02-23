import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { matchesController } from "../controllers/matches.controller.js";
import rateLimit from "../middleware/rateLimit.middleware.js";

const router = Router();

router.get("/", rateLimit, matchesController.list);
router.post("/", requireAuth, rateLimit, matchesController.create);

export default router;