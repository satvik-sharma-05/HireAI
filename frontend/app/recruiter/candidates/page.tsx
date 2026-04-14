"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import RecruiterLayout from "@/components/RecruiterLayout";
import ScoreCircle from "@/components/ScoreCircle";
import { analysisAPI, jobAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function CandidatesPage() {
    const router = useRouter();
    const [candidates, setCandidates] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [selectedJob, setSelectedJob] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [analysesRes, jobsRes] = await Promise.all([
                analysisAPI.history(),
                jobAPI.list(),
            ]);
            setCandidates(analysesRes.data || []);
            setJobs(jobsRes.data || []);
        } catch (error) {
            toast.error("Failed to load candidates");
        } finally {
            setLoading(false);
        }
    };

    const getFilteredCandidates = () => {
        let filtered = [...candidates];

        if (filter === "high") {
            filtered = filtered.filter((c: any) => c.score >= 80);
        } else if (filter === "medium") {
            filtered = filtered.filter((c: any) => c.score >= 60 && c.score < 80);
        } else if (filter === "low") {
            filtered = filtered.filter((c: any) => c.score < 60);
        }

        if (selectedJob !== "all") {
            filtered = filtered.filter((c: any) => c.job_id === selectedJob);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((c: any) =>
                (c.resume_filename || "").toLowerCase().includes(query) ||
                (c.job_title || "").toLowerCase().includes(query)
            );
        }

        return filtered;
    };

    const filteredCandidates = getFilteredCandidates();

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
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">All Candidates</h1>
                    <p className="text-gray-600 mt-1">Browse and manage all analyzed candidates</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search candidates..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>

                        {/* Job Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Job</label>
                            <select
                                value={selectedJob}
                                onChange={(e) => setSelectedJob(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                                <option value="all">All Jobs</option>
                                {jobs.map((job: any) => (
                                    <option key={job.id} value={job.id}>
                                        {job.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Score Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Score Range</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilter("all")}
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${filter === "all"
                                        ? "bg-primary text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilter("high")}
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${filter === "high"
                                        ? "bg-primary text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    80+
                                </button>
                                <button
                                    onClick={() => setFilter("medium")}
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${filter === "medium"
                                        ? "bg-primary text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    60-79
                                </button>
                                <button
                                    onClick={() => setFilter("low")}
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${filter === "low"
                                        ? "bg-primary text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    &lt;60
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4 text-sm text-gray-600">
                    Showing {filteredCandidates.length} of {candidates.length} candidates
                </div>

                {/* Candidates Grid */}
                {filteredCandidates.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No candidates found</h3>
                        <p className="text-gray-600">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredCandidates.map((candidate: any, index) => (
                            <motion.div
                                key={candidate.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => router.push(`/recruiter/candidates/${candidate.resume_id}?job=${candidate.job_id}`)}
                                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                                            {candidate.resume_filename}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {candidate.job_title}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(candidate.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <ScoreCircle score={candidate.score} size="sm" showLabel={false} />
                                </div>

                                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                                    {candidate.summary}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex flex-wrap gap-1">
                                        {candidate.matching_skills.slice(0, 3).map((skill: string, i: number) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </RecruiterLayout>
    );
}
