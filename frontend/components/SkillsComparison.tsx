"use client";

import { motion } from "framer-motion";

interface SkillsComparisonProps {
    matchingSkills: string[];
    missingSkills: string[];
}

export default function SkillsComparison({ matchingSkills, missingSkills }: SkillsComparisonProps) {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            {/* Matching Skills */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl p-6 border border-gray-200"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
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
                        <p className="text-sm text-gray-600">{matchingSkills.length} skills found</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {matchingSkills.length > 0 ? (
                        matchingSkills.map((skill, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/30 rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
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
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
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
                        <p className="text-sm text-gray-600">{missingSkills.length} skills to learn</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {missingSkills.length > 0 ? (
                        missingSkills.map((skill, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                                {skill}
                            </motion.span>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">All required skills present!</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
