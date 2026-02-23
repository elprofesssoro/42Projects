import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { usersController } from "../controllers/users.controller.js";
import rateLimit from "../middleware/rateLimit.middleware.js";

import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir))
    fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".png";
    cb(null, `avatar_${req.user.id}_${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
  cb(ok ? null : new Error("Only JPG/PNG/WEBP allowed"), ok);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 },
});

router.get("/", usersController.list);

router.use(requireAuth);
router.use(rateLimit);

router.get("/me", usersController.me);

router.patch("/me", usersController.updateMe);
router.delete("/me", usersController.deleteMe);

router.post(
  "/me/avatar",
  upload.single("avatar"),
  usersController.uploadAvatar
);

router.get("/:id", usersController.byId);
router.get("/:id/stats", usersController.getUserStats);

export default router;