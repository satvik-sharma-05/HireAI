"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import RecruiterLayout from "@/components/RecruiterLayout";
import StructuredMarkdown from "@/components/StructuredMarkdown";
import { chatAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function RecruiterChatPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadHistory();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const loadHistory = async () => {
        try {
            const res = await chatAPI.history(10);
            setMessages(res.data);
        } catch (error) {
            console.error("Failed to load chat history", error);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput("");
        setMessages((prev) => [...prev, { message: userMessage, response: null }]);
        setLoading(true);

        try {
            const res = await chatAPI.sendMessage({ message: userMessage });
            setMessages((prev) => [
                ...prev.slice(0, -1),
                { message: userMessage, response: res.data.response },
            ]);
        } catch (error: any) {
            toast.error("Failed to send message");
            setMessages((prev) => prev.slice(0, -1));
        } finally {
            setLoading(false);
        }
    };

    const quickQuestions = [
        "Who is the best candidate for my latest job?",
        "What are the most common skill gaps?",
        "How can I improve my job descriptions?",
        "What should I look for in a senior developer?",
    ];

    return (
        <RecruiterLayout>
            <div className="p-8 h-full flex flex-col">
                {/* Chat Area */}
                <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6 mb-6 overflow-y-auto">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center max-w-2xl"
                            >
                                <div className="text-6xl mb-4">💬</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    AI Recruitment Assistant
                                </h3>
                                <p className="text-gray-600 mb-8">
                                    Ask me about hiring strategies, candidate evaluation, or recruitment best practices
                                </p>

                                {/* Quick Questions */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {quickQuestions.map((question, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setInput(question)}
                                            className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-left text-sm text-gray-700 transition-colors border border-gray-200"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div key={i} className="space-y-4 mb-6">
                            {/* User Message */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex justify-end"
                            >
                                <div className="bg-primary text-white px-6 py-3 rounded-2xl rounded-tr-sm max-w-[80%]">
                                    {msg.message}
                                </div>
                            </motion.div>

                            {/* AI Response */}
                            {msg.response && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-gray-50 px-6 py-4 rounded-2xl rounded-tl-sm max-w-[80%] border border-gray-200">
                                        <StructuredMarkdown content={msg.response} />
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    ))}

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex justify-start"
                        >
                            <div className="bg-gray-50 px-6 py-4 rounded-2xl rounded-tl-sm border border-gray-200">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                        placeholder="Ask about hiring strategies, candidate evaluation..."
                        className="flex-1 px-6 py-4 bg-white border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        Send
                    </button>
                </div>
            </div>
        </RecruiterLayout>
    );
}
