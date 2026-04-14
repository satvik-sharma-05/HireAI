"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ScoreCircleProps {
    score: number;
    size?: "sm" | "md" | "lg";
    showLabel?: boolean;
}

export default function ScoreCircle({ score, size = "lg", showLabel = true }: ScoreCircleProps) {
    const [animatedScore, setAnimatedScore] = useState(0);

    const sizes = {
        sm: { width: 80, stroke: 6, fontSize: "text-xl" },
        md: { width: 120, stroke: 8, fontSize: "text-3xl" },
        lg: { width: 160, stroke: 10, fontSize: "text-5xl" },
    };

    const { width, stroke, fontSize } = sizes[size];
    const radius = (width - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (animatedScore / 100) * circumference;

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedScore(score);
        }, 100);
        return () => clearTimeout(timer);
    }, [score]);

    const getColor = () => {
        if (score >= 80) return "#16A34A";
        if (score >= 60) return "#EAB308";
        return "#DC2626";
    };

    return (
        <div className="flex flex-col items-center gap-3">
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="relative"
                style={{ width, height: width }}
            >
                {/* Background circle */}
                <svg className="transform -rotate-90" width={width} height={width}>
                    <circle
                        cx={width / 2}
                        cy={width / 2}
                        r={radius}
                        stroke="#F3F4F6"
                        strokeWidth={stroke}
                        fill="none"
                    />
                    {/* Animated progress circle */}
                    <motion.circle
                        cx={width / 2}
                        cy={width / 2}
                        r={radius}
                        stroke={getColor()}
                        strokeWidth={stroke}
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{
                            filter: `drop-shadow(0 0 8px ${getColor()}40)`,
                        }}
                    />
                </svg>
                {/* Score text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                        className={`${fontSize} font-bold`}
                        style={{ color: getColor() }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        {Math.round(animatedScore)}%
                    </motion.span>
                </div>
            </motion.div>
            {showLabel && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-sm font-medium text-gray-600"
                >
                    Match Score
                </motion.p>
            )}
        </div>
    );
}
