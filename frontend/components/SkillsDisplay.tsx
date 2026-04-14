"use client";

import { motion } from "framer-motion";

interface SkillsDisplayProps {
    matchingSkills: string[];
    missingSkills: string[];
}

export default function SkillsDisplay({ matchingSkills, missingSkills }: SkillsDisplayProps) {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            {/* Matching Skills */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl p-6 border border-gray-200"
            >
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Matching Skills</h3>
                        <p className="text-sm text-gray-500">{matchingSkills.length} skills found</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {matchingSkills.length > 0 ? (
                        matchingSkills.map((skill, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05, duration: 0.3 }}
                                className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium hover:bg-primary/20 transition-colors cursor-default"
                                style={{
                                    boxShadow: "0 0 10px rgba(22, 163, 74, 0.1)",
                                }}
                            >
                                {skill}
                            </motion.span>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">No matching skills found</p>
                    )}
                </div>
            </motion.div>

            {/* Missing Skills */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-xl p-6 border border-gray-200"
            >
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Missing Skills</h3>
                        <p className="text-sm text-gray-500">{missingSkills.length} gaps identified</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {missingSkills.length > 0 ? (
                        missingSkills.map((skill, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05, duration: 0.3 }}
                                className="px-3 py-1.5 bg-white text-gray-700 border-2 border-gray-300 rounded-full text-sm font-medium hover:border-gray-400 transition-colors cursor-default"
                            >
                                {skill}
                            </motion.span>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">All required skills present</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
