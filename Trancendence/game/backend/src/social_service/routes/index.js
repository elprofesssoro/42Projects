import { Router } from "express";
import friendsRoutes from "./friends.routes.js";
import presenceRoutes from "./presence.routes.js";
import invitesRoutes from "./invites.routes.js";
import messagesRoutes from "./messages.routes.js";
import rateLimit from "../middleware/rateLimit.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/health", (req, res) => res.json({ status: "ok" }));

// Apply auth and rate limit to all routes except health
router.use(requireAuth);
router.use(rateLimit);

router.use("/friends", friendsRoutes);
router.use("/presence", presenceRoutes);
router.use("/invites", invitesRoutes);
router.use("/messages", messagesRoutes);

export default router;