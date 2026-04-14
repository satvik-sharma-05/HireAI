"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import RecruiterLayout from "@/components/RecruiterLayout";
import { useAuthStore } from "@/lib/store";
import { jobAPI, analysisAPI } from "@/lib/api";

export default function RecruiterDashboard() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalCandidates: 0,
        avgScore: 0,
        topCandidate: null as any,
    });
    const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push("/auth/login");
            return;
        }
        if (user.role !== "recruiter") {
            router.push("/analyze");
            return;
        }
        loadDashboardData();
    }, [user, router]);

    const loadDashboardData = async () => {
        try {
            const [jobsRes, analysesRes] = await Promise.all([
                jobAPI.list(),
                analysisAPI.history(),
            ]);

            const jobs = jobsRes.data;
            const analyses = analysesRes.data;

            const avgScore = analyses.length > 0
                ? analyses.reduce((sum: number, a: any) => sum + a.score, 0) / analyses.length
                : 0;

            const topCandidate = analyses.length > 0
                ? analyses.reduce((top: any, current: any) =>
                    current.score > (top?.score || 0) ? current : top
                    , null)
                : null;

            setStats({
                totalJobs: jobs.length,
                totalCandidates: analyses.length,
                avgScore: Math.round(avgScore),
                topCandidate,
            });

            setRecentAnalyses(analyses.slice(0, 5));
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setLoading(false);
        }
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

    return (
        <RecruiterLayout>
            <div className="p-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-3xl">💼</span>
                            <span className="text-xs font-medium text-primary uppercase">Active</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{stats.totalJobs}</div>
                        <div className="text-sm text-gray-600 mt-1">Job Postings</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl p-6 border border-gray-200"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-3xl">👥</span>
                            <span className="text-xs font-medium text-gray-600 uppercase">Total</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{stats.totalCandidates}</div>
                        <div className="text-sm text-gray-600 mt-1">Candidates Analyzed</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl p-6 border border-gray-200"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-3xl">📊</span>
                            <span className="text-xs font-medium text-gray-600 uppercase">Average</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{stats.avgScore}%</div>
                        <div className="text-sm text-gray-600 mt-1">Match Score</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-3xl">🏆</span>
                            <span className="text-xs font-medium text-yellow-700 uppercase">Best</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                            {stats.topCandidate ? `${stats.topCandidate.score}%` : "-"}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Top Candidate</div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-xl p-6 border border-gray-200 mb-8"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => router.push("/recruiter/jobs/create")}
                            className="flex items-center gap-4 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors border border-primary/20 group"
                        >
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">➕</span>
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-gray-900">Create Job</div>
                                <div className="text-sm text-gray-600">Post a new position</div>
                            </div>
                        </button>

                        <button
                            onClick={() => router.push("/recruiter/jobs")}
                            className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 group"
                        >
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📤</span>
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-gray-900">Upload Resumes</div>
                                <div className="text-sm text-gray-600">Add candidates</div>
                            </div>
                        </button>

                        <button
                            onClick={() => router.push("/recruiter/candidates")}
                            className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 group"
                        >
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">🔍</span>
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-gray-900">View Candidates</div>
                                <div className="text-sm text-gray-600">Browse all</div>
                            </div>
                        </button>
                    </div>
                </motion.div>

                {/* Recent Analyses & Top Candidate */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Analyses */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-xl p-6 border border-gray-200"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Analyses</h3>
                        {recentAnalyses.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-4xl mb-2">📋</div>
                                <p>No analyses yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentAnalyses.map((analysis: any) => (
                                    <div
                                        key={analysis.id}
                                        onClick={() => router.push(`/history/${analysis.id}`)}
                                        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900 truncate">
                                                {analysis.resume_filename}
                                            </div>
                                            <div className="text-sm text-gray-600 truncate">
                                                {analysis.job_title}
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${analysis.score >= 80 ? "bg-primary/10 text-primary" :
                                            analysis.score >= 60 ? "bg-yellow-100 text-yellow-700" :
                                                "bg-red-100 text-red-700"
                                            }`}>
                                            {analysis.score}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Top Candidate */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span>🏆</span>
                            Top Candidate
                        </h3>
                        {stats.topCandidate ? (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="text-xl font-bold text-gray-900 mb-1">
                                            {stats.topCandidate.resume_filename}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {stats.topCandidate.job_title}
                                        </div>
                                    </div>
                                    <div className="text-4xl font-bold text-primary">
                                        {stats.topCandidate.score}%
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                                    {stats.topCandidate.summary}
                                </p>
                                <button
                                    onClick={() => router.push(`/history/${stats.topCandidate.id}`)}
                                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    View Full Analysis
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-4xl mb-2">🎯</div>
                                <p>No candidates yet</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </RecruiterLayout>
    );
}
