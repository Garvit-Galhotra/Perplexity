import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { useChat } from "../hook/useChat";
// import remarkGfm from "remark-gfm";

// Skeleton Components
const ChatListSkeleton = () => (
  <div className="space-y-2">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />
    ))}
  </div>
);

const MessageSkeleton = ({ isUser = false }) => (
  <div
    className={`flex animate-fadeIn mt-2 ${isUser ? "justify-end" : "justify-start"}`}
  >
    <div
      className={`w-[85%] md:w-[60%] rounded-2xl px-5 py-4 text-sm md:text-base ${
        isUser
          ? "rounded-br-none border border-cyan-500/30 bg-linear-to-r from-cyan-500/20 to-blue-500/20"
          : "rounded-bl-none border border-white/10 bg-white/5"
      }`}
    >
      <div className="space-y-3">
        <div className="h-5 w-full animate-pulse rounded bg-white/20" />
        <div className="h-5 w-[95%] animate-pulse rounded bg-white/20" />
        <div className="h-5 w-[92%] animate-pulse rounded bg-white/20" />
        <div className="h-5 w-[88%] animate-pulse rounded bg-white/20" />
        <div className="h-5 w-[85%] animate-pulse rounded bg-white/20" />
      </div>
    </div>
  </div>
);

const TypingText = ({ text, onComplete, speed = 20 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      onComplete?.();
    }
  }, [currentIndex, text, speed, onComplete]);

  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  // Auto-scroll during typing
  useEffect(() => {
    if (displayedText) {
      const messagesContainer = document.querySelector(".messages-container");
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }, [displayedText]);

  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => (
          <p className="mb-2 wrap-break-words last:mb-0">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="mb-2 list-disc space-y-1 pl-5">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-2 list-decimal space-y-1 pl-5">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="wrap-break-words text-white/80">{children}</li>
        ),
        code: ({ inline, children }) =>
          inline ? (
            <code className="rounded bg-white/10 px-2 py-1 font-mono text-xs text-cyan-300">
              {children}
            </code>
          ) : (
            <code className="block rounded bg-white/10 px-2 py-1 font-mono text-xs text-cyan-300">
              {children}
            </code>
          ),
        pre: ({ children }) => (
          <pre className="mb-2 overflow-x-auto rounded-xl bg-black/50 p-4 text-xs">
            {children}
          </pre>
        ),
        blockquote: ({ children }) => (
          <blockquote className="mb-2 border-l-4 border-cyan-500/50 pl-4 italic text-white/70">
            {children}
          </blockquote>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-white">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-white/80">{children}</em>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 underline hover:text-cyan-300"
          >
            {children}
          </a>
        ),
      }}
    >
      {displayedText}
    </ReactMarkdown>
  );
};

const Dashboard = () => {
  const chat = useChat();
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef(null);
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const loading = useSelector((state) => state.chat.loading);
  const error = useSelector((state) => state.chat.error);
  const pendingMessage = useSelector((state) => state.chat.pendingMessage);
  const showPendingChatSkeleton = useSelector(
    (state) => state.chat.showPendingChatSkeleton,
  );
  const [typingMessageId, setTypingMessageId] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats[currentChatId]?.messages, loading, typingMessageId]);

  // Start typing animation for new AI messages
  useEffect(() => {
    if (currentChatId && chats[currentChatId]?.messages) {
      const messages = chats[currentChatId].messages;
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === "assistant" && !loading) {
        const messageId = `${currentChatId}-${messages.length - 1}`;
        if (typingMessageId !== messageId) {
          setTypingMessageId(messageId);
        }
      }
    }
  }, [chats, currentChatId, loading, typingMessageId]);

  const openChat = (chatId) => {
    console.log(chatId);
    chat.handleOpenChat(chatId, chats);
  };

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  return (
    <main className="min-h-screen w-full bg-linear-to-br from-[#07090f] via-[#0a0d15] to-[#070a10] text-white">
      <section className="mx-auto flex h-screen w-full gap-8 p-4 md:gap-6 md:p-5">
        {/* Sidebar */}
        <aside className="hidden h-full w-64 flex-col gap-4 rounded-2xl border border-white/5 bg-white/2 p-4 backdrop-blur-sm md:flex lg:w-72">
          {/* Header */}
          <div>
            <h1 className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              Perplexity
            </h1>
            <p className="mt-1 text-xs text-white/40">AI Research Assistant</p>
          </div>

          {/* New Chat Button */}
          <button
            onClick={chat.handleNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/10 active:scale-95"
          >
            <span className="text-lg">➕</span>
            <span>New Chat</span>
          </button>

          {/* Divider */}
          <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

          {/* Chat List */}
          <div className="flex-1 space-y-2 overflow-y-auto">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Chat History
            </p>
            {showPendingChatSkeleton && (
              <div className="h-12 rounded-xl bg-white/5 animate-pulse" />
            )}
            {loading &&
            Object.keys(chats).length === 0 &&
            !showPendingChatSkeleton ? (
              <ChatListSkeleton />
            ) : Object.keys(chats).length === 0 && !showPendingChatSkeleton ? (
              <p className="text-center text-xs text-white/40 py-8">
                No chats yet
              </p>
            ) : (
              Object.values(chats).map((chat, index) => (
                <button
                  onClick={() => {
                    openChat(chat.id);
                  }}
                  key={index}
                  type="button"
                  className={`group relative w-full rounded-xl border px-3 py-2 text-left text-sm font-medium transition ${
                    currentChatId === chat.id
                      ? "border-cyan-500/50 bg-cyan-500/10 text-white shadow-lg shadow-cyan-500/20"
                      : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white"
                  }`}
                  title={chat.title}
                >
                  <p className="truncate">
                    <ReactMarkdown>{chat.title}</ReactMarkdown>
                  </p>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Main Content */}
        <section className="relative flex h-full flex-1 flex-col gap-4 rounded-2xl border border-white/5 bg-white/1 backdrop-blur-sm">
          {/* Messages Area */}
          <div className="messages-container flex-1 space-y-6 overflow-y-auto px-4 py-6 md:px-6 md:py-8">
            {error && (
              <div className="mx-auto max-w-3xl rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300 pb-20">
                <p className="font-semibold">Error</p>
                <p className="mt-1">{error}</p>
              </div>
            )}

            {!currentChatId ? (
              pendingMessage ? (
                <div className="mx-auto max-w-3xl space-y-6 pb-4">
                  <div className="flex animate-fadeIn justify-end">
                    <div className="max-w-[85%] rounded-2xl px-5 py-4 text-sm md:text-base rounded-br-none border border-cyan-500/30 bg-linear-to-r from-cyan-500/20 to-blue-500/20 text-white shadow-lg shadow-cyan-500/10">
                      <p className="wrap-break-word">{pendingMessage}</p>
                    </div>
                  </div>
                  {loading && <MessageSkeleton isUser={false} />}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mb-4 text-5xl">🔍</div>
                    <h2 className="mb-2 text-2xl font-semibold">
                      <ReactMarkdown>
                        {chats && Object.values(chats).length > 0
                          ? "Welcome back!"
                          : "Welcome to Perplexity"}
                      </ReactMarkdown>
                    </h2>
                    <p className="text-white/50">
                      Select a chat from the sidebar or create a new one to get
                      started
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="mx-auto max-w-3xl space-y-6 pb-4">
                {chats[currentChatId]?.messages.length === 0 ? (
                  <div className="flex h-96 items-center justify-center">
                    <p className="text-white/40">
                      Start typing to begin the conversation
                    </p>
                  </div>
                ) : (
                  <>
                    {chats[currentChatId]?.messages.map((message, idx) => (
                      <div
                        key={idx}
                        className={`flex animate-fadeIn ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start mt-2"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm md:text-base ${
                            message.role === "user"
                              ? "rounded-br-none border border-cyan-500/30 bg-linear-to-r from-cyan-500/20 to-blue-500/20 text-white shadow-lg shadow-cyan-500/10"
                              : "rounded-bl-none border border-white/10 bg-white/5 text-white/90 shadow-lg shadow-white/5"
                          }`}
                        >
                          {message.role === "user" ? (
                            <p className="wrap-break-word">{message.content}</p>
                          ) : (
                            <div>
                              {(() => {
                                const messageId = `${currentChatId}-${idx}`;
                                const isTyping = typingMessageId === messageId;

                                if (isTyping) {
                                  return (
                                    <TypingText
                                      text={message.content}
                                      speed={20}
                                      onComplete={() =>
                                        setTypingMessageId(null)
                                      }
                                    />
                                  );
                                } else {
                                  return (
                                    <ReactMarkdown
                                      components={{
                                        p: ({ children }) => (
                                          <p className="mb-2 wrap-break-words last:mb-0">
                                            {children}
                                          </p>
                                        ),
                                        ul: ({ children }) => (
                                          <ul className="mb-2 list-disc space-y-1 pl-5">
                                            {children}
                                          </ul>
                                        ),
                                        ol: ({ children }) => (
                                          <ol className="mb-2 list-decimal space-y-1 pl-5">
                                            {children}
                                          </ol>
                                        ),
                                        li: ({ children }) => (
                                          <li className="wrap-break-words text-white/80">
                                            {children}
                                          </li>
                                        ),
                                        code: ({ inline, children }) =>
                                          inline ? (
                                            <code className="rounded bg-white/10 px-2 py-1 font-mono text-xs text-cyan-300">
                                              {children}
                                            </code>
                                          ) : (
                                            <code className="block rounded bg-white/10 px-2 py-1 font-mono text-xs text-cyan-300">
                                              {children}
                                            </code>
                                          ),
                                        pre: ({ children }) => (
                                          <pre className="mb-2 overflow-x-auto rounded-xl bg-black/50 p-4 text-xs">
                                            {children}
                                          </pre>
                                        ),
                                        blockquote: ({ children }) => (
                                          <blockquote className="mb-2 border-l-4 border-cyan-500/50 pl-4 italic text-white/70">
                                            {children}
                                          </blockquote>
                                        ),
                                        strong: ({ children }) => (
                                          <strong className="font-semibold text-white">
                                            {children}
                                          </strong>
                                        ),
                                        em: ({ children }) => (
                                          <em className="italic text-white/80">
                                            {children}
                                          </em>
                                        ),
                                        a: ({ href, children }) => (
                                          <a
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-cyan-400 underline hover:text-cyan-300"
                                          >
                                            {children}
                                          </a>
                                        ),
                                      }}
                                    >
                                      {message.content}
                                    </ReactMarkdown>
                                  );
                                }
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {loading && <MessageSkeleton isUser={false} />}
                  </>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/5 px-4 py-6 md:px-6 md:py-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const trimmedMessage = chatInput.trim();
                if (!trimmedMessage || loading) return;

                chat.handleSendMessage({
                  message: trimmedMessage,
                  chatId: currentChatId,
                });
                setChatInput("");
              }}
              className="mx-auto max-w-3xl"
            >
              <div className="relative flex items-end gap-3">
                <div className="flex-1 flex flex-col">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask anything..."
                    disabled={loading}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/50 outline-none transition duration-200 backdrop-blur-sm hover:border-white/20 focus:border-cyan-400/50 focus:bg-white/8 focus:shadow-lg focus:shadow-cyan-500/5 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!chatInput.trim() || loading}
                  className="rounded-lg bg-cyan-500/80 px-5 py-3 font-medium text-white shadow-lg shadow-cyan-500/20 transition duration-200 hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-500/40 active:scale-95 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/50 disabled:shadow-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </span>
                  ) : (
                    <span>Send</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      </section>

      <style>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
      }
    `}</style>
    </main>
  );
};

export default Dashboard;
