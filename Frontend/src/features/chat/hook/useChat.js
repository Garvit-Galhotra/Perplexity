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
  removeChat,
  addNewMessage,
  addMessages,
  setPendingMessage,
  setShowPendingChatSkeleton,
} from "../chat.slice";
import { useDispatch } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();

  async function handleSendMessage({ message, chatId }) {
    try {
      if (!chatId) {
        // For new chats, show pending message and skeleton
        dispatch(setPendingMessage(message));
        dispatch(setShowPendingChatSkeleton(true));
      } else {
        // For existing chats, add user message immediately
        dispatch(
          addNewMessage({
            chatId,
            content: message,
            role: "user",
          }),
        );
      }

      // Set loading for AI response
      dispatch(setLoading(true));

      // Send message to backend
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

        // Clear pending states
        dispatch(setPendingMessage(null));
        dispatch(setShowPendingChatSkeleton(false));
      }

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
      // Clear pending states on error
      dispatch(setPendingMessage(null));
      dispatch(setShowPendingChatSkeleton(false));
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
