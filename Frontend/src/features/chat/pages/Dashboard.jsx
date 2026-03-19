import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useChat } from "../hook/useChat";
import ReactMarkdown from "react-markdown";

const Dashboard = () => {
  const chat = useChat();
  const [chatInput, setChatInput] = useState("");
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  const handleSubmitMessage = (event) => {
    event.preventDefault();
    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) return;
    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId });
    setChatInput("");
  };

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId);
  };

  return (
    <main className="h-screen w-full flex bg-neutral-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex-shrink-0">
          <h1 className="text-2xl font-bold">Perplexity</h1>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-4 space-y-2 border-b border-neutral-800 flex-shrink-0">
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-neutral-300 cursor-pointer active:scale-95 hover:bg-neutral-800 hover:text-white transition-colors">
            <span className="text-lg">➕</span>
            <span className="text-sm">New Research Chat</span>
          </button>
        </nav>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-4 px-4">
            Your Chats
          </h2>
          <div className="space-y-2">
            {Object.values(chats).map((chatItem) => (
              <button
                key={chatItem.id}
                onClick={() => openChat(chatItem.id)}
                className="w-full text-left px-4 py-2 cursor-pointer active:scale-95 rounded-lg text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors truncate "
              >
                {chatItem.title}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8 flex justify-center">
          {currentChatId &&
          chats[currentChatId]?.messages &&
          chats[currentChatId].messages.length > 0 ? (
            <div className="max-w-3xl w-full space-y-6">
              {chats[currentChatId].messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-2xl rounded-2xl px-6 py-4 text-sm md:text-base ${
                      message.role === "user"
                        ? "rounded-br-none bg-white/10 text-white"
                        : "rounded-bl-none bg-neutral-900 border border-neutral-800 text-neutral-100"
                    }`}
                  >
                    {message.role === "user" ? (
                      <p>{message.content}</p>
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-3 last:mb-0 leading-relaxed">
                              {children}
                            </p>
                          ),
                          ul: ({ children }) => (
                            <ul className="mb-3 list-disc pl-6 space-y-1">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="mb-3 list-decimal pl-6 space-y-1">
                              {children}
                            </ol>
                          ),
                          code: ({ children }) => (
                            <code className="rounded bg-neutral-800 px-2 py-1 font-mono text-sm">
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className="mb-3 overflow-x-auto rounded-lg bg-black/40 p-4 font-mono text-sm">
                              {children}
                            </pre>
                          ),
                          h1: ({ children }) => (
                            <h1 className="mb-3 text-xl font-bold">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="mb-2 text-lg font-bold">
                              {children}
                            </h2>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}

              {/* Sources Section */}
              {chats[currentChatId]?.sources &&
                chats[currentChatId].sources.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-neutral-800">
                    <h3 className="text-sm font-semibold text-neutral-400 mb-4">
                      Sources
                    </h3>
                    <div className="space-y-2">
                      {chats[currentChatId].sources.map((source, idx) => (
                        <a
                          key={idx}
                          href={source.url}
                          target="_blank"
                          className="block text-sm text-blue-400 hover:text-blue-300 truncate"
                        >
                          {source.title || source.url}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              {/* Related Questions */}
              {chats[currentChatId]?.relatedQuestions &&
                chats[currentChatId].relatedQuestions.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-neutral-800">
                    <h3 className="text-sm font-semibold text-neutral-400 mb-4">
                      Related Questions
                    </h3>
                    <div className="space-y-2">
                      {chats[currentChatId].relatedQuestions.map(
                        (question, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setChatInput(question);
                            }}
                            className="block w-full text-left text-sm text-neutral-300 hover:text-white p-2 rounded hover:bg-neutral-900 transition-colors"
                          >
                            {question}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">
                  Hello {user ? user.username : "There"}!
                </h2>
                <p className="text-neutral-400">What's on your mind?</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-neutral-800 bg-neutral-950 p-8">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmitMessage}>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Ask anything..."
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-5 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 px-6 py-3 cursor-pointer rounded-lg font-medium transition-colors flex items-center justify-center active:scale-95"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
