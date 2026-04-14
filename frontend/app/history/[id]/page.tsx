"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import ScoreCircle from "@/components/ScoreCircle";
import ScoreBreakdown from "@/components/ScoreBreakdown";
import SkillsComparison from "@/components/SkillsComparison";
import AnalysisSection from "@/components/AnalysisSection";
import StructuredMarkdown from "@/components/StructuredMarkdown";
import { useAuthStore } from "@/lib/store";
import { analysisAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function AnalysisDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuthStore();
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        if (!user) {
            router.push("/auth/login");
            return;
        }
        loadAnalysis();
    }, [user, router, params.id]);

    const loadAnalysis = async () => {
        try {
            const res = await analysisAPI.get(params.id as string);
            setAnalysis(res.data);
        } catch (error: any) {
            toast.error("Failed to load analysis");
            router.push("/history");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <main className="max-w-5xl mx-auto px-6 py-8">
                    <div className="text-center py-20">
                        <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600 mt-4">Loading analysis...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (!analysis) {
        return null;
    }

    const tabs = [
        { id: "overview", label: "Overview", icon: "📊" },
        { id: "reality", label: "Reality Check", icon: "🔥", hasData: !!analysis.reality_check },
        { id: "readiness", label: "Apply Now?", icon: "✅", hasData: !!analysis.apply_readiness },
        { id: "rejection", label: "Why Rejected?", icon: "❌", hasData: !!analysis.rejection_reasons },
        { id: "impression", label: "First 5 Sec", icon: "⚡", hasData: !!analysis.first_impression },
    ].filter(tab => tab.id === "overview" || tab.hasData);

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => router.push("/history")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to History
                    </button>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">{analysis.job_title}</h1>
                            <p className="text-gray-600">
                                Analyzed on {new Date(analysis.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">Resume: {analysis.resume_filename}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-2 rounded-lg text-lg font-semibold ${analysis.score >= 80 ? "bg-primary/10 text-primary" :
                                    analysis.score >= 60 ? "bg-yellow-100 text-yellow-700" :
                                        "bg-red-100 text-red-700"
                                }`}>
                                {analysis.score}% Match
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Score Hero Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 mb-8 border border-gray-200"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Match Score Breakdown</h2>
                            <p className="text-gray-600 mb-4">
                                Comprehensive analysis of your resume against the job requirements
                            </p>
                            <div className="flex gap-4 justify-center md:justify-start">
                                <div className="px-4 py-2 bg-white rounded-lg border border-gray-200">
                                    <div className="text-sm text-gray-600">Semantic</div>
                                    <div className="text-2xl font-bold text-gray-900">{analysis.semantic_score}%</div>
                                </div>
                                <div className="px-4 py-2 bg-white rounded-lg border border-gray-200">
                                    <div className="text-sm text-gray-600">Skills</div>
                                    <div className="text-2xl font-bold text-gray-900">{analysis.skill_score}%</div>
                                </div>
                            </div>
                        </div>
                        <ScoreCircle score={analysis.score} size="lg" showLabel={false} />
                    </div>
                </motion.div>

                {/* Tabs */}
                {tabs.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <div className="bg-white rounded-xl p-2 border border-gray-200">
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                                                ? "bg-primary text-white shadow-md"
                                                : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        <span className="mr-2">{tab.icon}</span>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Tab Content */}
                <div className="space-y-6">
                    {activeTab === "overview" && (
                        <>
                            <ScoreBreakdown semanticScore={analysis.semantic_score} skillScore={analysis.skill_score} />
                            <SkillsComparison matchingSkills={analysis.matching_skills} missingSkills={analysis.missing_skills} />

                            <AnalysisSection
                                title="Executive Summary"
                                delay={0.3}
                                variant="highlight"
                                icon={
                                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                }
                            >
                                <p className="text-gray-700 leading-relaxed text-[15px]">{analysis.summary}</p>
                            </AnalysisSection>

                            <AnalysisSection
                                title="Detailed Analysis"
                                delay={0.4}
                                icon={
                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                            >
                                <StructuredMarkdown content={analysis.explanation} />
                            </AnalysisSection>

                            <AnalysisSection
                                title="Actionable Recommendations"
                                delay={0.5}
                                icon={
                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                }
                            >
                                <div className="space-y-3">
                                    {analysis.suggestions.map((suggestion: string, i: number) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 + i * 0.1 }}
                                            className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                                {i + 1}
                                            </div>
                                            <p className="text-gray-700 flex-1 text-[15px]">{suggestion}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </AnalysisSection>

                            {analysis.learning_resources && Object.keys(analysis.learning_resources).length > 0 && (
                                <AnalysisSection
                                    title="Learning Resources"
                                    delay={0.6}
                                    icon={
                                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    }
                                >
                                    <div className="space-y-6">
                                        {Object.entries(analysis.learning_resources).map(([skill, resources]: [string, any], index) => (
                                            <motion.div
                                                key={skill}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6 + index * 0.1 }}
                                                className="border-l-4 border-primary pl-4 py-2"
                                            >
                                                <h4 className="font-semibold text-gray-900 mb-3 capitalize text-lg">{skill}</h4>
                                                {resources.courses && resources.courses.length > 0 && (
                                                    <div className="mb-3">
                                                        <p className="text-sm font-medium text-gray-700 mb-2">📚 Courses:</p>
                                                        <div className="space-y-2">
                                                            {resources.courses.map((course: any, i: number) => (
                                                                <a
                                                                    key={i}
                                                                    href={course.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="block text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                                                                >
                                                                    → {course.name} ({course.platform})
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {resources.projects && resources.projects.length > 0 && (
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700 mb-2">💡 Project Ideas:</p>
                                                        <ul className="space-y-1">
                                                            {resources.projects.map((project: string, i: number) => (
                                                                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                                                    <span className="text-primary mt-0.5">•</span>
                                                                    <span>{project}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </AnalysisSection>
                            )}

                            {/* Job Description */}
                            <AnalysisSection
                                title="Job Description"
                                delay={0.7}
                                icon={
                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                }
                            >
                                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-200">
                                    <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                                        {analysis.job_description}
                                    </p>
                                </div>
                            </AnalysisSection>
                        </>
                    )}

                    {activeTab === "reality" && analysis.reality_check && (
                        <AnalysisSection
                            title="Reality Check"
                            icon={<span className="text-2xl">🔥</span>}
                        >
                            <div className={`inline-block px-4 py-2 rounded-lg mb-4 font-semibold ${analysis.score >= 85 ? "bg-primary/10 text-primary" :
                                    analysis.score >= 70 ? "bg-yellow-100 text-yellow-700" :
                                        "bg-red-100 text-red-700"
                                }`}>
                                {analysis.score >= 85 ? "✓ READY TO APPLY" : analysis.score >= 70 ? "⚠ MAYBE READY" : "✗ NOT READY YET"}
                            </div>
                            <StructuredMarkdown content={analysis.reality_check} />
                        </AnalysisSection>
                    )}

                    {activeTab === "readiness" && analysis.apply_readiness && (
                        <AnalysisSection
                            title="Apply Readiness"
                            icon={<span className="text-2xl">✅</span>}
                        >
                            <StructuredMarkdown content={analysis.apply_readiness} />
                        </AnalysisSection>
                    )}

                    {activeTab === "rejection" && analysis.rejection_reasons && (
                        <AnalysisSection
                            title="Why You Might Get Rejected"
                            icon={<span className="text-2xl">❌</span>}
                            variant="warning"
                        >
                            <StructuredMarkdown content={analysis.rejection_reasons} />
                        </AnalysisSection>
                    )}

                    {activeTab === "impression" && analysis.first_impression && (
                        <AnalysisSection
                            title="First Impression (5 seconds)"
                            icon={<span className="text-2xl">⚡</span>}
                        >
                            <StructuredMarkdown content={analysis.first_impression} />
                        </AnalysisSection>
                    )}
                </div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex gap-4 mt-8"
                >
                    <button onClick={() => router.push("/analyze")} className="btn-primary flex-1">
                        Analyze Another Resume
                    </button>
                    <button onClick={() => router.push("/history")} className="btn-secondary flex-1">
                        Back to History
                    </button>
                </motion.div>
            </main>
        </div>
    );
}
