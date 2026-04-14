"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import RecruiterLayout from "@/components/RecruiterLayout";
import { jobAPI, advancedAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function CreateJobPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });
    const [simplifying, setSimplifying] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSimplify = async () => {
        if (!formData.description.trim()) {
            toast.error("Please enter a job description first");
            return;
        }

        setSimplifying(true);
        try {
            // Create temp job to simplify
            const tempJob = await jobAPI.create({ ...formData, required_skills: [] });
            const res = await advancedAPI.simplifyJD(tempJob.data.id);
            setFormData({ ...formData, description: res.data.simplified });
            toast.success("Job description simplified!");
        } catch (error) {
            toast.error("Failed to simplify");
        } finally {
            setSimplifying(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await jobAPI.create(formData);
            toast.success("Job created successfully!");
            router.push(`/recruiter/jobs/${res.data.id}`);
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Failed to create job");
        } finally {
            setLoading(false);
        }
    };

    return (
        <RecruiterLayout>
            <div className="p-8 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Create Job Posting</h1>
                        <p className="text-gray-600 mt-1">Add a new position to start analyzing candidates</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Job Title */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Job Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Senior Full Stack Developer"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>

                        {/* Job Description */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-900">
                                    Job Description <span className="text-red-500">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={handleSimplify}
                                    disabled={simplifying || !formData.description.trim()}
                                    className="px-3 py-1.5 text-sm bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {simplifying ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            Simplifying...
                                        </>
                                    ) : (
                                        <>
                                            <span>✨</span>
                                            Simplify with AI
                                        </>
                                    )}
                                </button>
                            </div>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={12}
                                placeholder="Paste the full job description here..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                            />
                            <p className="text-xs text-gray-600 mt-2">
                                💡 Tip: Use the "Simplify with AI" button to make your JD more concise and candidate-friendly
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <span>✓</span>
                                        Create Job
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </RecruiterLayout>
    );
}
