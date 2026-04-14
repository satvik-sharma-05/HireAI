"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import RecruiterLayout from "@/components/RecruiterLayout";
import { analysisAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function AnalyticsPage() {
    const [stats, setStats] = useState({
        totalCandidates: 0,
        avgScore: 0,
        highScorers: 0,
        mediumScorers: 0,
        lowScorers: 0,
        topSkills: [] as string[],
        missingSkills: [] as string[],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const analysesRes = await analysisAPI.history();
            const analyses = analysesRes.data;

            if (analyses.length === 0) {
                setLoading(false);
                return;
            }

            const avgScore = analyses.reduce((sum: number, a: any) => sum + a.score, 0) / analyses.length;
            const highScorers = analyses.filter((a: any) => a.score >= 80).length;
            const mediumScorers = analyses.filter((a: any) => a.score >= 60 && a.score < 80).length;
            const lowScorers = analyses.filter((a: any) => a.score < 60).length;

            // Aggregate skills
            const skillsMap: { [key: string]: number } = {};
            const missingSkillsMap: { [key: string]: number } = {};

            analyses.forEach((a: any) => {
                a.matching_skills?.forEach((skill: string) => {
                    skillsMap[skill] = (skillsMap[skill] || 0) + 1;
                });
                a.missing_skills?.forEach((skill: string) => {
                    missingSkillsMap[skill] = (missingSkillsMap[skill] || 0) + 1;
                });
            });

            const topSkills = Object.entries(skillsMap)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([skill]) => skill);

            const missingSkills = Object.entries(missingSkillsMap)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([skill]) => skill);

            setStats({
                totalCandidates: analyses.length,
                avgScore: Math.round(avgScore),
                highScorers,
                mediumScorers,
                lowScorers,
                topSkills,
                missingSkills,
            });
        } catch (error) {
            toast.error("Failed to load analytics");
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

    if (stats.totalCandidates === 0) {
        return (
            <RecruiterLayout>
                <div className="p-8">
                    <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                        <div className="text-6xl mb-4">📈</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No data yet</h3>
                        <p className="text-gray-600">Analyze some candidates to see analytics</p>
                    </div>
                </div>
            </RecruiterLayout>
        );
    }

    return (
        <RecruiterLayout>
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <p className="text-gray-600 mt-1">Insights from your candidate pool</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl p-6 border border-gray-200"
                    >
                        <div className="text-3xl mb-2">👥</div>
                        <div className="text-3xl font-bold text-gray-900">{stats.totalCandidates}</div>
                        <div className="text-sm text-gray-600 mt-1">Total Candidates</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20"
                    >
                        <div className="text-3xl mb-2">📊</div>
                        <div className="text-3xl font-bold text-gray-900">{stats.avgScore}%</div>
                        <div className="text-sm text-gray-600 mt-1">Average Score</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl p-6 border border-gray-200"
                    >
                        <div className="text-3xl mb-2">🏆</div>
                        <div className="text-3xl font-bold text-primary">{stats.highScorers}</div>
                        <div className="text-sm text-gray-600 mt-1">High Scorers (80+)</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl p-6 border border-gray-200"
                    >
                        <div className="text-3xl mb-2">⚠️</div>
                        <div className="text-3xl font-bold text-yellow-600">{stats.mediumScorers}</div>
                        <div className="text-sm text-gray-600 mt-1">Medium (60-79)</div>
                    </motion.div>
                </div>

                {/* Score Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-xl p-6 border border-gray-200 mb-8"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Score Distribution</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">High (80-100%)</span>
                                <span className="text-sm font-bold text-primary">{stats.highScorers} candidates</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-1000"
                                    style={{ width: `${(stats.highScorers / stats.totalCandidates) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Medium (60-79%)</span>
                                <span className="text-sm font-bold text-yellow-600">{stats.mediumScorers} candidates</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${(stats.mediumScorers / stats.totalCandidates) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Low (&lt;60%)</span>
                                <span className="text-sm font-bold text-red-600">{stats.lowScorers} candidates</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-red-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${(stats.lowScorers / stats.totalCandidates) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Skills Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Skills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-xl p-6 border border-gray-200"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span>✓</span>
                            Most Common Skills
                        </h3>
                        <div className="space-y-2">
                            {stats.topSkills.map((skill, index) => (
                                <div
                                    key={skill}
                                    className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg"
                                >
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                                        {index + 1}
                                    </div>
                                    <span className="text-gray-900 font-medium">{skill}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Missing Skills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white rounded-xl p-6 border border-gray-200"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span>⚠</span>
                            Most Common Gaps
                        </h3>
                        <div className="space-y-2">
                            {stats.missingSkills.map((skill, index) => (
                                <div
                                    key={skill}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                                        {index + 1}
                                    </div>
                                    <span className="text-gray-900 font-medium">{skill}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </RecruiterLayout>
    );
}
