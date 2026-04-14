"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import RecruiterLayout from "@/components/RecruiterLayout";
import { useAuthStore } from "@/lib/store";
import { jobAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function JobsPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push("/auth/login");
            return;
        }
        loadJobs();
    }, [user, router]);

    const loadJobs = async () => {
        try {
            const res = await jobAPI.list();
            setJobs(res.data);
        } catch (error) {
            toast.error("Failed to load jobs");
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
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
                        <p className="text-gray-600 mt-1">Manage your open positions</p>
                    </div>
                    <button
                        onClick={() => router.push("/recruiter/jobs/create")}
                        className="btn-primary flex items-center gap-2"
                    >
                        <span className="text-xl">➕</span>
                        Create Job
                    </button>
                </div>

                {/* Jobs Grid */}
                {jobs.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-12 text-center border border-gray-200"
                    >
                        <div className="text-6xl mb-4">💼</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs yet</h3>
                        <p className="text-gray-600 mb-6">Create your first job posting to start analyzing candidates</p>
                        <button
                            onClick={() => router.push("/recruiter/jobs/create")}
                            className="btn-primary"
                        >
                            Create Your First Job
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {jobs.map((job: any, index) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => router.push(`/recruiter/jobs/${job.id}`)}
                                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                            {job.title}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Created {new Date(job.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <span className="text-xl">💼</span>
                                    </div>
                                </div>

                                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                                    {job.description}
                                </p>

                                {job.required_skills && job.required_skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {job.required_skills.slice(0, 5).map((skill: string, i: number) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                        {job.required_skills.length > 5 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                +{job.required_skills.length - 5} more
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="text-sm text-gray-600">
                                        View candidates →
                                    </span>
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
