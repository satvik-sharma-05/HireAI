"use client";

import { motion } from "framer-motion";

interface LearningResourcesProps {
    resources: Record<string, any>;
}

export default function LearningResources({ resources }: LearningResourcesProps) {
    if (!resources || Object.keys(resources).length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            {Object.entries(resources).map(([skill, data]: [string, any], index) => (
                <motion.div
                    key={skill}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="border-l-4 border-primary pl-6 py-2"
                >
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 capitalize flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        {skill}
                    </h4>

                    {/* Courses */}
                    {data.courses && data.courses.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                                Recommended Courses
                            </p>
                            <div className="space-y-2">
                                {data.courses.map((course: any, i: number) => (
                                    <a
                                        key={i}
                                        href={course.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-3 bg-white border border-gray-200 rounded-lg hover:border-primary/30 hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
                                                    {course.name}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">{course.platform}</p>
                                            </div>
                                            <svg
                                                className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                />
                                            </svg>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Books */}
                    {data.books && data.books.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                                Recommended Books
                            </p>
                            <ul className="space-y-1">
                                {data.books.map((book: string, i: number) => (
                                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        <span>{book}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Projects */}
                    {data.projects && data.projects.length > 0 && (
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                    />
                                </svg>
                                Project Ideas
                            </p>
                            <ul className="space-y-1">
                                {data.projects.map((project: string, i: number) => (
                                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                        <span className="text-primary mt-1">→</span>
                                        <span>{project}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
}
