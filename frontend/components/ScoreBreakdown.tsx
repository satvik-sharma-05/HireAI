"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ScoreBreakdownProps {
    semanticScore: number;
    skillScore: number;
}

export default function ScoreBreakdown({ semanticScore, skillScore }: ScoreBreakdownProps) {
    const [animatedSemantic, setAnimatedSemantic] = useState(0);
    const [animatedSkill, setAnimatedSkill] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedSemantic(semanticScore);
            setAnimatedSkill(skillScore);
        }, 300);
        return () => clearTimeout(timer);
    }, [semanticScore, skillScore]);

    const getBarColor = (score: number) => {
        if (score >= 80) return "bg-primary";
        if (score >= 60) return "bg-yellow-500";
        return "bg-red-500";
    };

    const getGlowColor = (score: number) => {
        if (score >= 80) return "rgba(22, 163, 74, 0.3)";
        if (score >= 60) return "rgba(234, 179, 8, 0.3)";
        return "rgba(220, 38, 38, 0.3)";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl p-6 border border-gray-200"
        >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Score Breakdown</h3>

            <div className="space-y-6">
                {/* Semantic Score */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Semantic Match</span>
                        <span className="text-sm font-bold text-gray-900">{Math.round(animatedSemantic)}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full ${getBarColor(semanticScore)} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${animatedSemantic}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            style={{
                                boxShadow: `0 0 12px ${getGlowColor(semanticScore)}`,
                            }}
                        />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                        How well your experience aligns with the role
                    </p>
                </div>

                {/* Skill Score */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Skill Match</span>
                        <span className="text-sm font-bold text-gray-900">{Math.round(animatedSkill)}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full ${getBarColor(skillScore)} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${animatedSkill}%` }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                            style={{
                                boxShadow: `0 0 12px ${getGlowColor(skillScore)}`,
                            }}
                        />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                        Technical skills coverage
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
