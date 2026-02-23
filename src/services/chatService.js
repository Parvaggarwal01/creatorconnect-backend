import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const getConversationsService = async (userId) => {
  const conversations = await Conversation.find({
    participants: userId,
  })
    .populate("participants", "name email")
    .populate("lastMessage")
    .sort({ updatedAt: -1 });

  return conversations;
};

export const getMessagesService = async (conversationId, userId) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) throw new Error("Conversation not found");

  const isParticipant = conversation.participants
    .map((p) => p.toString())
    .includes(userId.toString());

  if (!isParticipant) throw new Error("Not authorized");

  const messages = await Message.find({ conversation: conversationId })
    .populate("sender", "name email")
    .sort({ createdAt: 1 });

  return messages;
};

export const createConversationService = async (userId, participantId) => {
  if (userId.toString() === participantId.toString()) {
    throw new Error("Cannot create conversation with yourself");
  }

  // Return existing conversation if already exists
  const existing = await Conversation.findOne({
    participants: { $all: [userId, participantId] },
  })
    .populate("participants", "name email")
    .populate("lastMessage");

  if (existing) return existing;

  const conversation = await Conversation.create({
    participants: [userId, participantId],
  });

  return await conversation.populate("participants", "name email");
};

export const sendMessageService = async (conversationId, senderId, content) => {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new Error("Conversation not found");

  const isParticipant = conversation.participants
    .map((p) => p.toString())
    .includes(senderId.toString());

  if (!isParticipant) throw new Error("Not authorized");

  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    content,
    receiver: conversation.participants.find(
      (p) => p.toString() !== senderId.toString(),
    ),
  });

  // Update last message
  conversation.lastMessage = message._id;
  await conversation.save();

  return await message.populate("sender", "name email");
};
