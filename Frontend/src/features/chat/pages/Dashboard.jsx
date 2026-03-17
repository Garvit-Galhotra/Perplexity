import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useChat } from "../hook/useChat";
import ReactMarkdown from "react-markdown";

const Dashboard = () => {
  const chat = useChat();
  const [chatInput, setChatInput] = useState("");
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  const handleSubmitMessage = (event) => {
    event.preventDefault();

    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) {
      return;
    }

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId });
    setChatInput("");
  };

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId);
  };
  return (
    <main className="h-screen w-full flex bg-neutral-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800">
          <h1 className="text-2xl font-bold">Perplexity</h1>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {Object.values(chats).map((chat, index) => (
            <button
              onClick={() => {
                openChat(chat.id);
              }}
              key={index}
              type="button"
              className="w-full text-left px-4 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors truncate text-sm active:scale-98 hover:cursor-pointer"
            >
              {chat.title}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-neutral-900">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {chats[currentChatId]?.messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[82%] w-fit rounded-2xl px-4 py-3 text-sm md:text-base ${
                message.role === "user"
                  ? "ml-auto rounded-br-none bg-white/12 text-white"
                  : "mr-auto border border-white/25 bg-[#0f1626] text-white/90"
              }`}
            >
              {message.role === "user" ? (
                <p>{message.content}</p>
              ) : (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-2 list-disc pl-5">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-2 list-decimal pl-5">{children}</ol>
                    ),
                    code: ({ children }) => (
                      <code className="rounded bg-white/10 px-1 py-0.5">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="mb-2 overflow-x-auto rounded-xl bg-black/30 p-3">
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t border-neutral-800 p-6">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              className="flex-1 bg-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
              type="submit"
              disabled={!chatInput.trim()}
              onClick={handleSubmitMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
