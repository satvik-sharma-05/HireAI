"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import ScoreCircle from "@/components/ScoreCircle";
import ScoreBreakdown from "@/components/ScoreBreakdown";
import SkillsComparison from "@/components/SkillsComparison";
import AnalysisSection from "@/components/AnalysisSection";
import StructuredMarkdown from "@/components/StructuredMarkdown";
import { useAuthStore } from "@/lib/store";
import { advancedAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function AnalysisResultsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuthStore();

    const [result, setResult] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(false);
    const [advancedData, setAdvancedData] = useState<any>({});

    const resumeId = searchParams.get("resume");
    const jobId = searchParams.get("job");
    const analysisData = searchParams.get("data");

    useEffect(() => {
        if (!user) {
            router.push("/auth/login");
            return;
        }
        if (analysisData) {
            setResult(JSON.parse(decodeURIComponent(analysisData)));
        }
    }, [user, router, analysisData]);

    const loadAdvancedFeature = async (feature: string) => {
        if (!resumeId || !jobId) return;
        if (advancedData[feature]) return;

        setLoading(true);
        try {
            let data;
            switch (feature) {
                case "reality":
                    data = await advancedAPI.realityCheck(resumeId, jobId);
                    break;
                case "rejection":
                    data = await advancedAPI.rejectionSimulator(resumeId, jobId);
                    break;
                case "impression":
                    data = await advancedAPI.firstImpression(resumeId, jobId);
                    break;
                case "fake":
                    data = await advancedAPI.fakeDetector(resumeId);
                    break;
                case "projects":
                    data = await advancedAPI.projectGenerator(resumeId, jobId);
                    break;
                case "competition":
                    data = await advancedAPI.competitionAnalysis(resumeId, jobId);
                    break;
                case "heatmap":
                    data = await advancedAPI.resumeHeatmap(resumeId, jobId);
                    break;
                case "readiness":
                    data = await advancedAPI.applyReadiness(resumeId, jobId);
                    break;
                case "cover":
                    data = await advancedAPI.coverLetter(resumeId, jobId);
                    break;
            }
            if (data) {
                setAdvancedData({ ...advancedData, [feature]: data.data });
            }
        } catch (error: any) {
            toast.error("Failed to load feature");
        } finally {
            setLoading(false);
        }
    };

    if (!result) {
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

    const tabs = [
        { id: "overview", label: "Overview", icon: "📊" },
        { id: "reality", label: "Reality Check", icon: "🔥" },
        { id: "readiness", label: "Apply Now?", icon: "✅" },
        { id: "rejection", label: "Why Rejected?", icon: "❌" },
        { id: "impression", label: "First 5 Sec", icon: "⚡" },
        { id: "competition", label: "vs Top 10%", icon: "🏆" },
        { id: "projects", label: "Projects", icon: "💡" },
        { id: "heatmap", label: "Heatmap", icon: "🗺️" },
        { id: "cover", label: "Cover Letter", icon: "✉️" },
        { id: "fake", label: "Red Flags", icon: "🚩" },
    ];

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
                        onClick={() => router.push("/analyze")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Analyze
                    </button>
                    <h1 className="text-4xl font-bold text-gray-900">Analysis Results</h1>
                    <p className="text-gray-600 mt-2">AI-powered resume analysis with actionable insights</p>
                </motion.div>

                {/* Score Hero Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 mb-8 border border-gray-200"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Match Score</h2>
                            <p className="text-gray-600 mb-4">
                                Based on semantic analysis and skill matching
                            </p>
                            <div className="flex gap-4 justify-center md:justify-start">
                                <div className="px-4 py-2 bg-white rounded-lg border border-gray-200">
                                    <div className="text-sm text-gray-600">Semantic</div>
                                    <div className="text-2xl font-bold text-gray-900">{result.semantic_score}%</div>
                                </div>
                                <div className="px-4 py-2 bg-white rounded-lg border border-gray-200">
                                    <div className="text-sm text-gray-600">Skills</div>
                                    <div className="text-2xl font-bold text-gray-900">{result.skill_score}%</div>
                                </div>
                            </div>
                        </div>
                        <ScoreCircle score={result.score} size="lg" showLabel={false} />
                    </div>
                </motion.div>

                {/* Tabs */}
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
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        if (tab.id !== "overview") loadAdvancedFeature(tab.id);
                                    }}
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

                {/* Tab Content */}
                <div className="space-y-6">
                    {activeTab === "overview" && (
                        <>
                            <ScoreBreakdown semanticScore={result.semantic_score} skillScore={result.skill_score} />
                            <SkillsComparison matchingSkills={result.matching_skills} missingSkills={result.missing_skills} />

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
                                <p className="text-gray-700 leading-relaxed text-[15px]">{result.summary}</p>
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
                                <StructuredMarkdown content={result.explanation} />
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
                                    {result.suggestions.map((suggestion: string, i: number) => (
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

                            {result.learning_resources && Object.keys(result.learning_resources).length > 0 && (
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
                                        {Object.entries(result.learning_resources).map(([skill, resources]: [string, any], index) => (
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
                        </>
                    )}

                    {activeTab !== "overview" && (
                        <AnalysisSection
                            title={tabs.find(t => t.id === activeTab)?.label || "Feature"}
                            icon={<span className="text-2xl">{tabs.find(t => t.id === activeTab)?.icon}</span>}
                        >
                            {activeTab === "reality" && result.reality_check ? (
                                <div>
                                    <div className={`inline-block px-4 py-2 rounded-lg mb-4 font-semibold ${result.score >= 85 ? "bg-primary/10 text-primary" :
                                        result.score >= 70 ? "bg-yellow-100 text-yellow-700" :
                                            "bg-red-100 text-red-700"
                                        }`}>
                                        {result.score >= 85 ? "✓ READY TO APPLY" : result.score >= 70 ? "⚠ MAYBE READY" : "✗ NOT READY YET"}
                                    </div>
                                    <StructuredMarkdown content={result.reality_check} />
                                </div>
                            ) : activeTab === "readiness" && result.apply_readiness ? (
                                <StructuredMarkdown content={result.apply_readiness} />
                            ) : activeTab === "rejection" && result.rejection_reasons ? (
                                <StructuredMarkdown content={result.rejection_reasons} />
                            ) : activeTab === "impression" && result.first_impression ? (
                                <StructuredMarkdown content={result.first_impression} />
                            ) : loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-gray-600 mt-4">Loading feature...</p>
                                </div>
                            ) : advancedData[activeTab] ? (
                                <div>
                                    {activeTab === "reality" && (
                                        <div>
                                            <div className={`inline-block px-4 py-2 rounded-lg mb-4 font-semibold ${advancedData.reality.readiness === "READY" ? "bg-primary/10 text-primary" :
                                                advancedData.reality.readiness === "MAYBE READY" ? "bg-yellow-100 text-yellow-700" :
                                                    "bg-red-100 text-red-700"
                                                }`}>
                                                {advancedData.reality.readiness}
                                            </div>
                                            <StructuredMarkdown content={advancedData.reality.brutal_feedback} />
                                        </div>
                                    )}
                                    {activeTab === "readiness" && (
                                        <div>
                                            <div className={`text-6xl font-bold mb-4 ${advancedData.readiness.decision === "YES" ? "text-primary" :
                                                advancedData.readiness.decision === "MAYBE" ? "text-yellow-600" :
                                                    "text-red-600"
                                                }`}>
                                                {advancedData.readiness.decision}
                                            </div>
                                            <p className="text-xl text-gray-700 mb-4">{advancedData.readiness.reason}</p>
                                            <p className="text-sm text-gray-600">Confidence: {advancedData.readiness.confidence}</p>
                                        </div>
                                    )}
                                    {activeTab === "rejection" && (
                                        <StructuredMarkdown content={advancedData.rejection.rejection_reasons} />
                                    )}
                                    {activeTab === "impression" && (
                                        <StructuredMarkdown content={advancedData.impression.first_impression} />
                                    )}
                                    {activeTab === "competition" && (
                                        <div>
                                            <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                                                <p className="text-sm text-gray-600">Your Position:</p>
                                                <p className="text-2xl font-bold text-gray-900">{advancedData.competition.current_percentile}</p>
                                            </div>
                                            <StructuredMarkdown content={advancedData.competition.analysis} />
                                        </div>
                                    )}
                                    {activeTab === "projects" && advancedData.projects.projects && (
                                        <div className="space-y-6">
                                            {advancedData.projects.projects.map((project: any, i: number) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="border-l-4 border-primary pl-4 py-2 bg-gray-50 rounded-r-lg"
                                                >
                                                    <div className="text-xs font-semibold text-primary uppercase mb-1">{project.skill}</div>
                                                    <h4 className="text-lg font-bold text-gray-900 mb-2">{project.name}</h4>
                                                    <p className="text-gray-700 mb-3">{project.description}</p>
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {project.technologies.split(',').map((tech: string, j: number) => (
                                                            <span key={j} className="px-2 py-1 bg-white text-gray-700 text-xs rounded border border-gray-200">
                                                                {tech.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <p className="text-sm text-gray-600">⏱ {project.time}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                    {activeTab === "heatmap" && (
                                        <StructuredMarkdown content={advancedData.heatmap.heatmap} />
                                    )}
                                    {activeTab === "cover" && (
                                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                            <StructuredMarkdown content={advancedData.cover.cover_letter} />
                                        </div>
                                    )}
                                    {activeTab === "fake" && (
                                        <StructuredMarkdown content={advancedData.fake.analysis} />
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-600">Click to load this feature</p>
                                </div>
                            )}
                        </AnalysisSection>
                    )}
                </div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex gap-4 mt-8"
                >
                    <button onClick={() => router.push("/analyze")} className="btn-primary flex-1">
                        Analyze Another
                    </button>
                    <button onClick={() => router.push("/history")} className="btn-secondary flex-1">
                        View History
                    </button>
                </motion.div>
            </main>
        </div>
    );
}
