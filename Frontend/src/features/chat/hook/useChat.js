import { initializeSocketConnection } from "../service/chat.socket";
import {
  sendMessage,
  getChats,
  getMessages,
  //   deleteChat,
} from "../service/chat.api";
import {
  setChats,
  setCurrentChatId,
  //   setError,
  setLoading,
  createNewChat,
  addNewMessage,
  addMessages,
} from "../chat.slice";
import { useDispatch } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();

  async function handleSendMessage({ message, chatId }) {
    try {
      // If this is a new chat, create it first
      if (!chatId) {
        dispatch(setLoading(true));
      }

      // Add user message immediately (before loading state)
      if (chatId) {
        dispatch(
          addNewMessage({
            chatId,
            content: message,
            role: "user",
          }),
        );
      }

      // Now set loading for AI response
      dispatch(setLoading(true));

      // Send message to backend (it will create chat if needed)
      const data = await sendMessage({ message, chatId });
      const { chat, aiMessage } = data;

      // If this is a new chat, create it in the store
      if (!chatId) {
        dispatch(
          createNewChat({
            chatId: chat._id,
            title: chat.title,
          }),
        );

        // Add user message for new chat
        dispatch(
          addNewMessage({
            chatId: chat._id,
            content: message,
            role: "user",
          }),
        );
      }

      console.log(chat, aiMessage);

      // Add AI response
      dispatch(
        addNewMessage({
          chatId: chat._id,
          content: aiMessage.content,
          role: aiMessage.role,
        }),
      );

      dispatch(setCurrentChatId(chat._id));
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetChats() {
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
    dispatch(setLoading(false));
  }

  async function handleOpenChat(chatId, chats) {
    console.log(chats[chatId]?.messages.length);

    console.log(chatId, chats);

    if (chats[chatId]?.messages.length === 0) {
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
    }
    dispatch(setCurrentChatId(chatId));
  }

  function handleNewChat() {
    dispatch(setCurrentChatId(null));
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleNewChat,
  };
};
