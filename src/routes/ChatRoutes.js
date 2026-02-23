import express from "express";
import { authMiddleware as protect } from "../middleware/authMiddleware.js";
import {
  getConversations,
  getMessages,
  createConversation,
} from "../controllers/chatController.js";

const router = express.Router();

// All chat routes require auth
router.use(protect);

router.get("/", getConversations);
router.get("/:conversationId", getMessages);
router.post("/conversation", createConversation);

export default router;
