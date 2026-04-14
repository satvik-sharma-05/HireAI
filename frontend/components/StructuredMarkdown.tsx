"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface StructuredMarkdownProps {
    content: string;
    className?: string;
}

export default function StructuredMarkdown({ content, className = "" }: StructuredMarkdownProps) {
    // Parse content to highlight key phrases
    const highlightKeyPhrases = (text: string) => {
        const keyPhrases = [
            /\b(strong|excellent|outstanding|impressive|exceptional)\b/gi,
            /\b(weak|poor|lacking|insufficient|missing)\b/gi,
            /\b(critical|important|essential|crucial|vital)\b/gi,
        ];

        let highlighted = text;
        keyPhrases.forEach((pattern) => {
            highlighted = highlighted.replace(pattern, (match) => `**${match}**`);
        });
        return highlighted;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`prose prose-sm max-w-none ${className}`}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Headings with icons
                    h1: ({ node, ...props }) => (
                        <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-6 flex items-center gap-2" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                        <h2 className="text-xl font-bold text-gray-900 mb-3 mt-5 flex items-center gap-2" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4" {...props} />
                    ),
                    h4: ({ node, ...props }) => (
                        <h4 className="text-base font-semibold text-gray-900 mb-2 mt-3" {...props} />
                    ),

                    // Paragraphs with better spacing
                    p: ({ node, ...props }) => (
                        <p className="text-gray-700 leading-relaxed mb-4 text-[15px]" {...props} />
                    ),

                    // Styled lists with custom bullets
                    ul: ({ node, ...props }) => (
                        <ul className="space-y-2 mb-4 ml-1" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                        <ol className="space-y-2 mb-4 ml-6 list-none" {...props} />
                    ),
                    li: ({ node, ordered, ...props }) => {
                        const content = props.children;
                        const hasStrength = typeof content === 'string' && /strong|excellent|good|impressive/i.test(content);
                        const hasWeakness = typeof content === 'string' && /weak|poor|lacking|missing/i.test(content);

                        return (
                            <li className="flex items-start gap-3 text-gray-700 leading-relaxed">
                                <span className={`flex-shrink-0 mt-1.5 ${hasStrength ? 'text-primary' : hasWeakness ? 'text-red-500' : 'text-primary'
                                    }`}>
                                    {hasStrength ? '✓' : hasWeakness ? '⚠' : '→'}
                                </span>
                                <span className="flex-1" {...props} />
                            </li>
                        );
                    },

                    // Bold text with emphasis
                    strong: ({ node, ...props }) => (
                        <strong className="font-semibold text-gray-900 bg-primary/5 px-1 rounded" {...props} />
                    ),

                    // Italic text
                    em: ({ node, ...props }) => (
                        <em className="italic text-gray-800" {...props} />
                    ),

                    // Inline code
                    code: ({ node, inline, ...props }: any) =>
                        inline ? (
                            <code
                                className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-sm font-mono border border-gray-200"
                                {...props}
                            />
                        ) : (
                            <code
                                className="block p-4 bg-gray-50 text-gray-800 rounded-lg text-sm font-mono overflow-x-auto mb-4 border border-gray-200"
                                {...props}
                            />
                        ),

                    // Blockquote with accent
                    blockquote: ({ node, ...props }) => (
                        <blockquote
                            className="border-l-4 border-primary pl-4 py-2 my-4 bg-primary/5 rounded-r-lg italic text-gray-700"
                            {...props}
                        />
                    ),

                    // Links
                    a: ({ node, ...props }) => (
                        <a
                            className="text-primary hover:text-primary/80 underline font-medium transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                        />
                    ),

                    // Horizontal rule
                    hr: ({ node, ...props }) => (
                        <hr className="my-6 border-gray-200" {...props} />
                    ),

                    // Tables
                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto mb-4 rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200" {...props} />
                        </div>
                    ),
                    thead: ({ node, ...props }) => (
                        <thead className="bg-gray-50" {...props} />
                    ),
                    tbody: ({ node, ...props }) => (
                        <tbody className="bg-white divide-y divide-gray-200" {...props} />
                    ),
                    tr: ({ node, ...props }) => <tr className="hover:bg-gray-50 transition-colors" {...props} />,
                    th: ({ node, ...props }) => (
                        <th
                            className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                            {...props}
                        />
                    ),
                    td: ({ node, ...props }) => (
                        <td className="px-4 py-3 text-sm text-gray-700" {...props} />
                    ),
                }}
            >
                {highlightKeyPhrases(content)}
            </ReactMarkdown>
        </motion.div>
    );
}
