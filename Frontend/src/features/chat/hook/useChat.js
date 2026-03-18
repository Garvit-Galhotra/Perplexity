import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages } from "../service/chat.api";
import {
  setChats,
  setCurrentChatId,
  setError,
  setLoading,
  createNewChat,
  addNewMessage,
  addMessages,
  setMessagesLoaded,
} from "../chat.slice";
import { useDispatch, useSelector } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);

  async function handleSendMessage({ message, chatId }) {
    try {
      dispatch(setLoading(true));
      const data = await sendMessage({ message, chatId }); // send back aimessage and chatid
      const { chat, aiMessage } = data;
      dispatch(
        createNewChat({
          chatId: chat._id,
          title: chat.title,
        }),
      );
      dispatch(
        addNewMessage({
          chatId: chat._id,
          content: message,
          role: "user",
        }),
      );
      dispatch(
        addNewMessage({
          chatId: chat._id,
          content: aiMessage.content,
          role: aiMessage.role,
        }),
      );
      dispatch(setCurrentChatId(chat._id));
    } catch (error) {
      dispatch(setError(error.message || "Failed to send message"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetChats() {
    try {
      dispatch(setLoading(true));
      const data = await getChats();
      const { chats } = data;
      dispatch(
        setChats(
          chats.reduce((acc, chat) => {
            acc[chat._id] = {
              id: chat._id,
              title: chat.title,
              messages: [],
              lastUpdated: chat.updatedAt,
            };
            return acc;
          }, {}),
        ),
      );
    } catch (error) {
      dispatch(setError(error.message || "Failed to fetch chats"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleOpenChat(chatId) {
    // Check if messages are already loaded for this chat
    if (chats[chatId]?.messagesLoaded) {
      dispatch(setCurrentChatId(chatId));
      return;
    }

    try {
      const data = await getMessages(chatId);
      const { messages } = data;

      const formattedMessages = messages.map((msg) => ({
        content: msg.content,
        role: msg.role,
      }));
      dispatch(
        addMessages({
          chatId,
          messages: formattedMessages,
        }),
      );
      dispatch(setMessagesLoaded({ chatId }));
      dispatch(setCurrentChatId(chatId));
    } catch (error) {
      dispatch(setError(error.message || "Failed to open chat"));
    }
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
  };
};
