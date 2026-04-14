"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={className}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Headings
                    h1: ({ node, ...props }) => (
                        <h1 className="text-3xl font-bold text-gray-900 mb-4 mt-6" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-5" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4" {...props} />
                    ),
                    h4: ({ node, ...props }) => (
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-3" {...props} />
                    ),

                    // Paragraphs
                    p: ({ node, ...props }) => (
                        <p className="text-gray-700 leading-relaxed mb-4" {...props} />
                    ),

                    // Lists
                    ul: ({ node, ...props }) => (
                        <ul className="space-y-2 mb-4 ml-6" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                        <ol className="space-y-2 mb-4 ml-6 list-decimal" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                        <li className="text-gray-700 leading-relaxed flex items-start gap-2">
                            <span className="text-primary mt-1.5">→</span>
                            <span className="flex-1" {...props} />
                        </li>
                    ),

                    // Strong/Bold
                    strong: ({ node, ...props }) => (
                        <strong className="font-semibold text-gray-900" {...props} />
                    ),

                    // Emphasis/Italic
                    em: ({ node, ...props }) => (
                        <em className="italic text-gray-800" {...props} />
                    ),

                    // Code
                    code: ({ node, inline, ...props }: any) =>
                        inline ? (
                            <code
                                className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-sm font-mono"
                                {...props}
                            />
                        ) : (
                            <code
                                className="block p-4 bg-gray-50 text-gray-800 rounded-lg text-sm font-mono overflow-x-auto mb-4"
                                {...props}
                            />
                        ),

                    // Blockquote
                    blockquote: ({ node, ...props }) => (
                        <blockquote
                            className="border-l-4 border-primary pl-4 py-2 my-4 bg-primary/5 rounded-r-lg"
                            {...props}
                        />
                    ),

                    // Links
                    a: ({ node, ...props }) => (
                        <a
                            className="text-primary hover:text-primary-hover underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                        />
                    ),

                    // Horizontal Rule
                    hr: ({ node, ...props }) => (
                        <hr className="my-6 border-gray-200" {...props} />
                    ),

                    // Tables
                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto mb-4">
                            <table className="min-w-full divide-y divide-gray-200" {...props} />
                        </div>
                    ),
                    thead: ({ node, ...props }) => (
                        <thead className="bg-gray-50" {...props} />
                    ),
                    tbody: ({ node, ...props }) => (
                        <tbody className="bg-white divide-y divide-gray-200" {...props} />
                    ),
                    tr: ({ node, ...props }) => <tr {...props} />,
                    th: ({ node, ...props }) => (
                        <th
                            className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                            {...props}
                        />
                    ),
                    td: ({ node, ...props }) => (
                        <td className="px-4 py-3 text-sm text-gray-700" {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </motion.div>
    );
}
