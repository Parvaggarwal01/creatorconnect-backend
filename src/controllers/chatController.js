import {
  getConversationsService,
  getMessagesService,
  createConversationService,
} from "../services/chatService.js";

export const getConversations = async (req, res) => {
  try {
    const conversations = await getConversationsService(req.user._id);
    res.json(conversations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await getMessagesService(
      req.params.conversationId,
      req.user._id,
    );
    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createConversation = async (req, res) => {
  try {
    const { participantId } = req.body;
    if (!participantId) {
      return res.status(400).json({ message: "participantId is required" });
    }
    const conversation = await createConversationService(
      req.user._id,
      participantId,
    );
    res.status(201).json(conversation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
