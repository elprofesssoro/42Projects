import { Router } from "express";
import { tournamentsController } from "../controllers/tournaments.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
import rateLimit from "../middleware/rateLimit.middleware.js";

const router = Router();

router.get("/", rateLimit, tournamentsController.list);
router.get("/schedule", rateLimit, tournamentsController.schedule);
router.get("/:id/bracket", rateLimit, tournamentsController.bracket);
router.get("/:id/rounds", rateLimit, tournamentsController.rounds);

router.get("/me/subscriptions", requireAuth, rateLimit, tournamentsController.mySubscriptions);
router.post("/:id/join", requireAuth, rateLimit, tournamentsController.join);
router.post("/:id/leave", requireAuth, rateLimit, tournamentsController.leave);

router.post(
  "/:id/bracket/:matchId/result",
  requireAuth,
  requireAdmin,
  rateLimit,
  tournamentsController.registerBracketResult
);

router.post(
  "/:id/bracket/:matchId/advance",
  requireAuth,
  requireAdmin,
  tournamentsController.advanceBracketMatch
);

router.post(
  "/:id/bracket/:matchId/reset",
  requireAuth, 
  requireAdmin,
  rateLimit,
  tournamentsController.resetBracketResult
);

export default router;
