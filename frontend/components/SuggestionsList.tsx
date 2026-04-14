"use client";

import { motion } from "framer-motion";

interface SuggestionsListProps {
    suggestions: string[];
}

export default function SuggestionsList({ suggestions }: SuggestionsListProps) {
    return (
        <div className="space-y-4">
            {suggestions.map((suggestion, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="flex gap-4 group"
                >
                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">
                        {i + 1}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <p className="text-gray-800 leading-relaxed">{suggestion}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
