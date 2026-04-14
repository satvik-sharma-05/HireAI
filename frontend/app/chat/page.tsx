"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useAuthStore } from "@/lib/store";
import { chatAPI } from "@/lib/api";
import toast from "react-hot-toast";

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export default function ChatPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user) {
            router.push("/auth/login");
            return;
        }
        loadHistory();
    }, [user, router]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const loadHistory = async () => {
        try {
            const res = await chatAPI.history(20);
            const history = res.data.map((msg: any) => ({
                role: msg.role,
                content: msg.content,
                timestamp: new Date(msg.timestamp),
            }));
            setMessages(history.reverse());
        } catch (error) {
            console.error("Failed to load chat history", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = {
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await chatAPI.sendMessage({ message: input.trim() });
            const assistantMessage: Message = {
                role: "assistant",
                content: res.data.response,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Failed to send message");
            // Remove user message on error
            setMessages((prev) => prev.slice(0, -1));
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
                {/* Chat Header */}
                <div className="px-6 py-6 border-b border-gray-200 bg-white">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">AI Career Assistant</h1>
                    <p className="text-gray-600 text-sm">
                        Ask questions about your resume, career advice, or job search strategies
                    </p>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {loadingHistory ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-600 mt-4">Loading chat...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-12 animate-fade-in">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Start a Conversation</h2>
                            <p className="text-gray-600 mb-6">Ask me anything about your career or resume</p>

                            <div className="grid md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                                <button
                                    onClick={() =>
                                        setInput("How can I improve my resume to get more interviews?")
                                    }
                                    className="p-4 text-left bg-white border border-gray-200 rounded-lg hover:border-primary/30 hover:shadow-md transition-all"
                                >
                                    <p className="text-sm text-gray-700">
                                        How can I improve my resume to get more interviews?
                                    </p>
                                </button>
                                <button
                                    onClick={() =>
                                        setInput("What skills should I focus on for a software engineering role?")
                                    }
                                    className="p-4 text-left bg-white border border-gray-200 rounded-lg hover:border-primary/30 hover:shadow-md transition-all"
                                >
                                    <p className="text-sm text-gray-700">
                                        What skills should I focus on for a software engineering role?
                                    </p>
                                </button>
                                <button
                                    onClick={() => setInput("How do I prepare for technical interviews?")}
                                    className="p-4 text-left bg-white border border-gray-200 rounded-lg hover:border-primary/30 hover:shadow-md transition-all"
                                >
                                    <p className="text-sm text-gray-700">
                                        How do I prepare for technical interviews?
                                    </p>
                                </button>
                                <button
                                    onClick={() =>
                                        setInput("What are the best ways to network in the tech industry?")
                                    }
                                    className="p-4 text-left bg-white border border-gray-200 rounded-lg hover:border-primary/30 hover:shadow-md transition-all"
                                >
                                    <p className="text-sm text-gray-700">
                                        What are the best ways to network in the tech industry?
                                    </p>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 max-w-3xl mx-auto">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex gap-4 animate-slide-up ${message.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    {message.role === "assistant" && (
                                        <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                            <svg
                                                className="w-5 h-5 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                                />
                                            </svg>
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-[80%] ${message.role === "user"
                                                ? "bg-primary text-white rounded-2xl rounded-tr-sm px-5 py-3"
                                                : "bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-5 py-4"
                                            }`}
                                    >
                                        <p
                                            className={`text-sm leading-relaxed whitespace-pre-wrap ${message.role === "user" ? "text-white" : "text-gray-800"
                                                }`}
                                        >
                                            {message.content}
                                        </p>
                                        <p
                                            className={`text-xs mt-2 ${message.role === "user" ? "text-white/70" : "text-gray-500"
                                                }`}
                                        >
                                            {message.timestamp.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>

                                    {message.role === "user" && (
                                        <div className="flex-shrink-0 w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-medium text-sm">
                                                {user?.email?.[0].toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {loading && (
                                <div className="flex gap-4 animate-slide-up">
                                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-5 py-4">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div
                                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                style={{ animationDelay: "0.1s" }}
                                            ></div>
                                            <div
                                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                style={{ animationDelay: "0.2s" }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-200 bg-white px-6 py-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex gap-3 items-end">
                            <div className="flex-1 relative">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me anything about your career..."
                                    rows={1}
                                    className="w-full resize-none rounded-xl border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 px-4 py-3 pr-12"
                                    style={{
                                        minHeight: "48px",
                                        maxHeight: "120px",
                                    }}
                                    disabled={loading}
                                />
                                <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                                    {input.length > 0 && `${input.length} chars`}
                                </div>
                            </div>
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className="flex-shrink-0 w-12 h-12 bg-primary hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all hover:shadow-lg disabled:hover:shadow-none"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                                ) : (
                                    <svg
                                        className="w-5 h-5 mx-auto"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Press Enter to send, Shift + Enter for new line
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
