"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnalysisSectionProps {
    title: string;
    icon?: ReactNode;
    children: ReactNode;
    delay?: number;
    variant?: "default" | "highlight" | "warning";
}

export default function AnalysisSection({
    title,
    icon,
    children,
    delay = 0,
    variant = "default",
}: AnalysisSectionProps) {
    const variants = {
        default: "bg-white border-gray-200",
        highlight: "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20",
        warning: "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={`rounded-xl p-6 border ${variants[variant]} transition-all hover:shadow-md`}
        >
            <div className="flex items-center gap-3 mb-4">
                {icon && (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${variant === "highlight" ? "bg-primary/10" : variant === "warning" ? "bg-yellow-100" : "bg-gray-100"
                        }`}>
                        {icon}
                    </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <div className="space-y-3">{children}</div>
        </motion.div>
    );
}
