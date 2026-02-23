import { Router } from "express";
import { friendsController } from "../controllers/friends.controller.js";

const router = Router();

router.get("/", friendsController.me);
router.get("/me", friendsController.me);
router.get("/requests", friendsController.requests);
router.post("/requests", friendsController.createRequest);
router.post("/requests/:id/accept", friendsController.acceptRequest);
router.post("/requests/:id/reject", friendsController.rejectRequest);
router.post("/requests/:id/cancel", friendsController.cancelRequest);


router.post("/:friendId", async (req, res, next) => {
  try {
    req.body = { ...(req.body || {}), toUserId: Number(req.params.friendId) };
    return friendsController.createRequest(req, res);
  } catch (e) {
    next(e);
  }
});


router.delete("/:friendId", friendsController.remove);

export default router;