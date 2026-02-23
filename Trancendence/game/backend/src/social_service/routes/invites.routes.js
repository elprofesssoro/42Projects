import { Router } from "express";
import { invitesController } from "../controllers/invites.controller.js";

const router = Router();

router.get("/", invitesController.list);
router.get("/incoming", invitesController.incomingPending);
router.get("/between/:otherId", invitesController.latestBetween);
router.post("/", invitesController.create);
router.post("/:id/accept", invitesController.accept);
router.post("/:id/reject", invitesController.reject);
router.post("/:id/complete", invitesController.complete);
router.post("/:id/cancel", invitesController.cancel);


export default router;