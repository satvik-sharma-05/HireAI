"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import RecruiterLayout from "@/components/RecruiterLayout";
import ScoreCircle from "@/components/ScoreCircle";
import ScoreBreakdown from "@/components/ScoreBreakdown";
import SkillsComparison from "@/components/SkillsComparison";
import AnalysisSection from "@/components/AnalysisSection";
import StructuredMarkdown from "@/components/StructuredMarkdown";
import { resumeAPI, jobAPI, analysisAPI, advancedAPI } from "@/lib/api";
import toast from "react-hot-toast";

function CandidateDetailContent() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const jobId = searchParams.get("job");

    const [candidate, setCandidate] = useState<any>(null);
    const [analysis, setAnalysis] = useState<any>(null);
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [decision, setDecision] = useState<"hire" | "consider" | "reject" | null>(null);
    const [notes, setNotes] = useState("");

    useEffect(() => {
        loadCandidateData();
    }, [params.id, jobId]);

    const loadCandidateData = async () => {
        try {
            const resumeRes = await resumeAPI.get(params.id as string);
            setCandidate(resumeRes.data);

            if (jobId) {
                const [jobRes, analysesRes] = await Promise.all([
                    jobAPI.get(jobId),
                    analysisAPI.history(),
                ]);
                setJob(jobRes.data);

                // Find analysis for this resume + job
                const matchingAnalysis = analysesRes.data.find(
                    (a: any) => a.resume_id === params.id && a.job_id === jobId
                );

                if (matchingAnalysis) {
                    const fullAnalysis = await analysisAPI.get(matchingAnalysis.id);
                    setAnalysis(fullAnalysis.data);
                }
            }
        } catch (error) {
            toast.error("Failed to load candidate");
            router.push("/recruiter/candidates");
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: "overview", label: "Overview", icon: "📊" },
        { id: "reality", label: "Reality Check", icon: "🔥", hasData: !!analysis?.reality_check },
        { id: "readiness", label: "Apply Readiness", icon: "✅", hasData: !!analysis?.apply_readiness },
        { id: "rejection", label: "Why Rejected?", icon: "❌", hasData: !!analysis?.rejection_reasons },
        { id: "impression", label: "First 5 Sec", icon: "⚡", hasData: !!analysis?.first_impression },
        { id: "decision", label: "Make Decision", icon: "⚖️" },
    ].filter(tab => tab.id === "overview" || tab.id === "decision" || tab.hasData);

    const handleDecision = (dec: "hire" | "consider" | "reject") => {
        setDecision(dec);
        toast.success(`Marked as: ${dec.toUpperCase()}`);
    };

    if (loading) {
        return (
            <RecruiterLayout>
                <div className="flex items-center justify-center h-full">
                    <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </RecruiterLayout>
        );
    }

    if (!analysis) {
        return (
            <RecruiterLayout>
                <div className="p-8">
                    <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analysis Found</h3>
                        <p className="text-gray-600 mb-6">This candidate hasn't been analyzed for any job yet</p>
                        <button onClick={() => router.push("/recruiter/jobs")} className="btn-primary">
                            Go to Jobs
                        </button>
                    </div>
                </div>
            </RecruiterLayout>
        );
    }

    return (
        <RecruiterLayout>
            <div className="p-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{candidate.custom_title || candidate.filename}</h1>
                            <p className="text-gray-600 mt-1">
                                Applying for: <span className="font-medium text-gray-900">{job?.title}</span>
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Analyzed {new Date(analysis.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {decision && (
                                <span className={`px-4 py-2 rounded-lg font-semibold ${decision === "hire" ? "bg-primary/10 text-primary" :
                                    decision === "consider" ? "bg-yellow-100 text-yellow-700" :
                                        "bg-red-100 text-red-700"
                                    }`}>
                                    {decision === "hire" ? "✓ HIRE" : decision === "consider" ? "⚠ CONSIDER" : "✗ REJECT"}
                                </span>
                            )}
                            <span className={`px-4 py-2 rounded-lg text-lg font-semibold ${analysis.score >= 80 ? "bg-primary/10 text-primary" :
                                analysis.score >= 60 ? "bg-yellow-100 text-yellow-700" :
                                    "bg-red-100 text-red-700"
                                }`}>
                                {analysis.score}% Match
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Score Hero */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 mb-8 border border-gray-200"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Candidate Match Analysis</h2>
                            <p className="text-gray-600 mb-4">
                                AI-powered evaluation against job requirements
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
                                title="Recommendations"
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
                                            className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                                {i + 1}
                                            </div>
                                            <p className="text-gray-700 flex-1 text-[15px]">{suggestion}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </AnalysisSection>
                        </>
                    )}

                    {activeTab === "reality" && analysis.reality_check && (
                        <AnalysisSection
                            title="Reality Check"
                            icon={<span className="text-2xl">🔥</span>}
                            variant="warning"
                        >
                            <div className={`inline-block px-4 py-2 rounded-lg mb-4 font-semibold ${analysis.score >= 85 ? "bg-primary/10 text-primary" :
                                analysis.score >= 70 ? "bg-yellow-100 text-yellow-700" :
                                    "bg-red-100 text-red-700"
                                }`}>
                                {analysis.score >= 85 ? "✓ READY" : analysis.score >= 70 ? "⚠ MAYBE" : "✗ NOT READY"}
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
                            title="Potential Rejection Reasons"
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

                    {activeTab === "decision" && (
                        <AnalysisSection
                            title="Make Hiring Decision"
                            icon={<span className="text-2xl">⚖️</span>}
                            variant="highlight"
                        >
                            <div className="space-y-6">
                                {/* Decision Buttons */}
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Your Decision</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <button
                                            onClick={() => handleDecision("hire")}
                                            className={`p-4 rounded-lg border-2 transition-all ${decision === "hire"
                                                ? "border-primary bg-primary/10"
                                                : "border-gray-200 hover:border-primary/50"
                                                }`}
                                        >
                                            <div className="text-3xl mb-2">✓</div>
                                            <div className="font-semibold text-gray-900">HIRE</div>
                                            <div className="text-xs text-gray-600 mt-1">Strong match</div>
                                        </button>
                                        <button
                                            onClick={() => handleDecision("consider")}
                                            className={`p-4 rounded-lg border-2 transition-all ${decision === "consider"
                                                ? "border-yellow-500 bg-yellow-50"
                                                : "border-gray-200 hover:border-yellow-300"
                                                }`}
                                        >
                                            <div className="text-3xl mb-2">⚠</div>
                                            <div className="font-semibold text-gray-900">CONSIDER</div>
                                            <div className="text-xs text-gray-600 mt-1">Needs review</div>
                                        </button>
                                        <button
                                            onClick={() => handleDecision("reject")}
                                            className={`p-4 rounded-lg border-2 transition-all ${decision === "reject"
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200 hover:border-red-300"
                                                }`}
                                        >
                                            <div className="text-3xl mb-2">✗</div>
                                            <div className="font-semibold text-gray-900">REJECT</div>
                                            <div className="text-xs text-gray-600 mt-1">Not a fit</div>
                                        </button>
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Notes</h4>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={4}
                                        placeholder="Add your notes about this candidate..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                    />
                                </div>

                                {/* AI Recommendation */}
                                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-lg">🤖</span>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 mb-1">AI Recommendation</div>
                                            <p className="text-sm text-gray-700">
                                                {analysis.score >= 85
                                                    ? "Strong candidate. Recommend moving forward with interview process."
                                                    : analysis.score >= 70
                                                        ? "Decent match. Consider for interview if other factors align."
                                                        : "Below threshold. May not be the best fit for this role."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                    <button
                        onClick={() => router.push(`/recruiter/jobs/${jobId}`)}
                        className="flex-1 btn-secondary"
                    >
                        Back to Rankings
                    </button>
                    <button
                        onClick={() => toast.success("Compare feature coming soon!")}
                        className="flex-1 btn-primary"
                    >
                        Compare with Others
                    </button>
                </motion.div>
            </div>
        </RecruiterLayout>
    );
}

export default function CandidateDetailPage() {
    return (
        <Suspense fallback={
            <RecruiterLayout>
                <div className="flex items-center justify-center h-full">
                    <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </RecruiterLayout>
        }>
            <CandidateDetailContent />
        </Suspense>
    );
}
