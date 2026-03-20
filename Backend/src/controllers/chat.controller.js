import { generateResponse } from "../services/ai.service.js";
import { generateChatTitle } from "../services/ai.service.js";
import messageModel from "../models/message.model.js";
import chatModel from "../models/chat.model.js";

// take message and chat from body
// gives message and chatId, title, aiMessage
export async function sendMessage(req, res) {
  const { message, chat: chatId } = req.body;

  let title = null;
  let chat = null;

  const chatExists = await chatModel.findById(chatId);

  if (!chatId) {
    title = await generateChatTitle(message);

    chat = await chatModel.create({
      title,
      user: req.user.id,
    });
  }

  const newMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: message,
    role: "user",
  });

  const messages = await messageModel.find({ chat: chatId || chat._id });

  const result = await generateResponse(messages);

  const aiMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: result,
    role: "ai",
  });

  res.json({
    message: result,
    chat: chat || chatExists,
    title: title || chatExists.title,
    aiMessage,
  });
}

// take nothing
// gives array of chats with title and id

export async function getChats(req, res) {
  const user = req.user;

  const chats = await chatModel.find({ user: user.id });

  res.status(200).json({
    message: "Chats retrieved successfully",
    chats,
  });
}

// Takes chatId from params
// gives array of messages with content and role

export async function getMessages(req, res) {
  const { chatId } = req.params;

  const chat = await chatModel.findOne({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(404).json({
      message: "Chat not found",
    });
  }

  const messages = await messageModel.find({
    chat: chatId,
  });

  res.status(200).json({
    message: "Messages retrieved successfully",
    messages,
  });
}

// takes chatId from params
// gives success message if deleted successfully

export async function deleteChat(req, res) {
  const { chatId } = req.params;

  const chat = await chatModel.findOneAndDelete({
    _id: chatId,
    user: req.user.id,
  });

  await messageModel.deleteMany({
    chat: chatId,
  });

  if (!chat) {
    return res.status(404).json({
      message: "Chat not found",
    });
  }

  res.status(200).json({
    message: "Chat deleted successfully",
  });
}
