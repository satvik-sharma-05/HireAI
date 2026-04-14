"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ScoreVisualizationProps {
    score: number;
    semanticScore?: number;
    skillScore?: number;
}

export default function ScoreVisualization({ score, semanticScore, skillScore }: ScoreVisualizationProps) {
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedScore(score);
        }, 100);
        return () => clearTimeout(timer);
    }, [score]);

    const getScoreColor = (s: number) => {
        if (s >= 80) return "#16A34A"; // Green
        if (s >= 60) return "#EAB308"; // Yellow
        return "#DC2626"; // Red
    };

    const circumference = 2 * Math.PI * 70;
    const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            {/* Circular Progress */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-48 h-48 mb-6"
            >
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx="96"
                        cy="96"
                        r="70"
                        stroke="#F3F4F6"
                        strokeWidth="12"
                        fill="none"
                    />
                    {/* Progress circle */}
                    <motion.circle
                        cx="96"
                        cy="96"
                        r="70"
                        stroke={getScoreColor(score)}
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{
                            strokeDasharray: circumference,
                            filter: `drop-shadow(0 0 8px ${getScoreColor(score)}40)`,
                        }}
                    />
                </svg>
                {/* Score text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="text-6xl font-bold"
                        style={{ color: getScoreColor(score) }}
                    >
                        {Math.round(animatedScore)}
                    </motion.div>
                    <div className="text-sm text-gray-500 font-medium">Match Score</div>
                </div>
            </motion.div>

            {/* Breakdown */}
            {(semanticScore !== undefined || skillScore !== undefined) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="grid grid-cols-2 gap-4 w-full max-w-sm"
                >
                    {semanticScore !== undefined && (
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-gray-900">{semanticScore}%</div>
                            <div className="text-xs text-gray-600 mt-1">Semantic</div>
                        </div>
                    )}
                    {skillScore !== undefined && (
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-gray-900">{skillScore}%</div>
                            <div className="text-xs text-gray-600 mt-1">Skills</div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
