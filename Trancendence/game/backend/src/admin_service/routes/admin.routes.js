import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
import { adminController } from "../controllers/admin.controller.js";
import rateLimit from "../middleware/rateLimit.middleware.js";

const router = Router();
router.use(requireAuth, requireAdmin, rateLimit);

router.get("/users", adminController.listUsers);
router.patch("/users/:id", adminController.updateUser);
router.post("/users/:id/reset", adminController.resetUser);
router.delete("/users/:id", adminController.deleteUser);
router.post("/users/:id/logout", adminController.logoutUser);

router.get("/invites", adminController.listInvites);
router.post("/invites/:id/cancel", adminController.cancelInvite);
router.post("/invites/clear-stuck", adminController.clearStuckInvites);

router.get("/matches", adminController.listMatches);
router.get("/matches/:id", adminController.getMatchDetails);
router.delete("/matches/:id", adminController.deleteMatch);

router.get("/tournaments", adminController.listTournaments);
router.post("/tournaments", adminController.createTournament);
router.patch("/tournaments/:id/archive", adminController.archiveTournament);
router.delete("/tournaments/:id", adminController.deleteTournament);

router.patch("/tournaments/:id/status", adminController.setTournamentStatus);

router.get("/tournaments/:id/subscriptions", adminController.listTournamentSubscriptions);
router.delete(
  "/tournaments/:tournamentId/subscriptions/:userId",
  adminController.cancelTournamentSubscription
);


router.get("/audit", adminController.listAudit);

export default router;