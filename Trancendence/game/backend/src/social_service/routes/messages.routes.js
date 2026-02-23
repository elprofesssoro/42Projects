import { Router } from "express";
import { messagesController } from "../controllers/messages.controller.js";

import * as auth from "../middleware/auth.middleware.js";

const requireAuth =
  auth.requireAuth || auth.authMiddleware || auth.protect || auth.default;

const router = Router();

router.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

router.get("/thread/:userId", requireAuth, messagesController.listThread);
router.post("/thread/:userId", requireAuth, messagesController.sendToThread);
router.post("/thread/:userId/read", requireAuth, messagesController.markThreadRead);
router.get("/unread", requireAuth, messagesController.unreadCounts);

router.delete("/:id", requireAuth, messagesController.deleteMessage);

router.get("/system", requireAuth, messagesController.listSystem);
router.post("/system/:id/read", requireAuth, messagesController.markSystemRead);

export default router;
