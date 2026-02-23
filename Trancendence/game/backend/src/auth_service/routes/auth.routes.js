import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import rateLimit from "../middleware/rateLimit.middleware.js";

const router = Router();

router.post("/register", rateLimit, authController.register);
router.post("/login", rateLimit, authController.login);
router.post("/refresh", rateLimit, authController.refresh);
router.get("/me", requireAuth, rateLimit, authController.me);
router.post("/verify-opponent", requireAuth, rateLimit, authController.verifyOpponent);

export default router;