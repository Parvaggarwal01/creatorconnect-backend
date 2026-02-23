import upload from "../middleware/uploadMiddleware.js";
import { authMiddleware as protect } from "../middleware/authMiddleware.js";
import express from "express";
import {
  createAsset,
  getMyAssets,
  getPublicAssets,
} from "../controllers/assertController.js";
const router = express.Router();

router.post("/", protect, upload.single("file"), createAsset);
router.get("/", getPublicAssets); // Public
router.get("/my", protect, getMyAssets);
export default router;
