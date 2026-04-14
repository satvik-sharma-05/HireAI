"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { chatAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function ChatPage() {
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

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 flex flex-col">
                <h1 className="text-3xl font-bold mb-6">AI Career Assistant</h1>

                {/* Messages */}
                <div className="flex-1 glass rounded-xl p-6 mb-6 overflow-y-auto space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-text-secondary py-12">
                            <div className="text-4xl mb-4">💬</div>
                            <p>Start a conversation with your AI career assistant</p>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div key={i} className="space-y-3">
                            {/* User message */}
                            <div className="flex justify-end">
                                <div className="bg-primary px-4 py-3 rounded-lg max-w-[80%]">
                                    {msg.message}
                                </div>
                            </div>

                            {/* AI response */}
                            {msg.response && (
                                <div className="flex justify-start">
                                    <div className="bg-dark-card px-4 py-3 rounded-lg max-w-[80%]">
                                        {msg.response}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-dark-card px-4 py-3 rounded-lg">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Ask me anything about your career..."
                        className="flex-1 px-4 py-3 bg-dark-card border border-dark-border rounded-lg focus:border-primary outline-none"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="px-6 py-3 bg-primary hover:bg-primary-hover rounded-lg transition-smooth disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
