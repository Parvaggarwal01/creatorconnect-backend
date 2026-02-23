import jwt from "jsonwebtoken";
import { sendMessageService } from "../services/chatService.js";

// Map userId -> socket.id for targeted delivery
const onlineUsers = new Map();

export const registerSocketHandlers = (io) => {
  // Auth middleware for socket handshake
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) return next(new Error("Authentication error"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = { ...decoded, _id: decoded.id };
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    onlineUsers.set(userId, socket.id);

    // Broadcast online status
    io.emit("user:online", { userId });

    console.log(`Socket connected: ${userId}`);

    // Join a conversation room
    socket.on("conversation:join", (conversationId) => {
      socket.join(conversationId);
    });

    // Leave a conversation room
    socket.on("conversation:leave", (conversationId) => {
      socket.leave(conversationId);
    });

    // Send a message
    socket.on("message:send", async ({ conversationId, content }) => {
      try {
        if (!conversationId || !content?.trim()) return;

        const message = await sendMessageService(
          conversationId,
          socket.user._id,
          content.trim(),
        );

        // Emit to everyone in the conversation room (including sender)
        io.to(conversationId).emit("message:receive", message);
      } catch (err) {
        socket.emit("error", { message: err.message });
      }
    });

    // Typing indicators
    socket.on("typing:start", ({ conversationId }) => {
      socket.to(conversationId).emit("typing:start", { userId });
    });

    socket.on("typing:stop", ({ conversationId }) => {
      socket.to(conversationId).emit("typing:stop", { userId });
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      io.emit("user:offline", { userId });
      console.log(`Socket disconnected: ${userId}`);
    });
  });
};

export { onlineUsers };
