"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import RecruiterLayout from "@/components/RecruiterLayout";
import ScoreCircle from "@/components/ScoreCircle";
import { jobAPI, resumeAPI, analysisAPI, advancedAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function JobDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [job, setJob] = useState<any>(null);
    const [resumes, setResumes] = useState<any[]>([]);
    const [rankings, setRankings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [uploadingResumes, setUploadingResumes] = useState<Array<{ file: File; title: string }>>([]);
    const [activeTab, setActiveTab] = useState<"upload" | "rankings">("upload");

    useEffect(() => {
        loadJobData();
    }, [params.id]);

    const loadJobData = async () => {
        try {
            const [jobRes, resumesRes] = await Promise.all([
                jobAPI.get(params.id as string),
                resumeAPI.list(),
            ]);
            setJob(jobRes.data);
            setResumes(resumesRes.data);

            // Load rankings if they exist
            try {
                const rankRes = await advancedAPI.rankCandidates(params.id as string);
                if (rankRes.data.rankings.length > 0) {
                    setRankings(rankRes.data.rankings);
                    setActiveTab("rankings");
                }
            } catch (error) {
                // No rankings yet
            }
        } catch (error) {
            toast.error("Failed to load job");
            router.push("/recruiter/jobs");
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newResumes = files.map(file => ({ file, title: file.name.replace(/\.[^/.]+$/, "") }));
        setUploadingResumes([...uploadingResumes, ...newResumes]);
    };

    const handleTitleChange = (index: number, title: string) => {
        const updated = [...uploadingResumes];
        updated[index].title = title;
        setUploadingResumes(updated);
    };

    const handleRemoveResume = (index: number) => {
        setUploadingResumes(uploadingResumes.filter((_, i) => i !== index));
    };

    const handleUploadAndAnalyze = async () => {
        if (uploadingResumes.length === 0) {
            toast.error("Please add at least one resume");
            return;
        }

        setAnalyzing(true);
        try {
            // Upload all resumes
            const uploadPromises = uploadingResumes.map(({ file, title }) =>
                resumeAPI.upload(file, title)
            );
            const uploadedResumes = await Promise.all(uploadPromises);
            toast.success(`Uploaded ${uploadedResumes.length} resumes`);

            // Analyze each resume against the job
            const analyzePromises = uploadedResumes.map(res =>
                analysisAPI.analyze({
                    resume_id: res.data.id,
                    job_id: params.id as string,
                })
            );
            await Promise.all(analyzePromises);
            toast.success("Analysis complete!");

            // Load rankings
            const rankRes = await advancedAPI.rankCandidates(params.id as string);
            setRankings(rankRes.data.rankings);
            setUploadingResumes([]);
            setActiveTab("rankings");
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Failed to analyze");
        } finally {
            setAnalyzing(false);
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
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => router.push("/recruiter/jobs")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Jobs
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                    <p className="text-gray-600 mt-1">
                        Created {new Date(job.created_at).toLocaleDateString()}
                    </p>
                </motion.div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="flex gap-2 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab("upload")}
                            className={`px-6 py-3 font-medium transition-all ${activeTab === "upload"
                                    ? "text-primary border-b-2 border-primary"
                                    : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            📤 Upload Resumes
                        </button>
                        <button
                            onClick={() => setActiveTab("rankings")}
                            className={`px-6 py-3 font-medium transition-all ${activeTab === "rankings"
                                    ? "text-primary border-b-2 border-primary"
                                    : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            📊 Rankings {rankings.length > 0 && `(${rankings.length})`}
                        </button>
                    </div>
                </div>

                {/* Upload Tab */}
                {activeTab === "upload" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Upload Area */}
                        <div className="bg-white rounded-xl p-8 border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
                            <input
                                type="file"
                                id="resume-upload"
                                multiple
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <label
                                htmlFor="resume-upload"
                                className="flex flex-col items-center cursor-pointer"
                            >
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                    <span className="text-3xl">📤</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Upload Candidate Resumes
                                </h3>
                                <p className="text-gray-600 text-center">
                                    Click to browse or drag and drop multiple PDF/DOC files
                                </p>
                            </label>
                        </div>

                        {/* Uploaded Resumes List */}
                        {uploadingResumes.length > 0 && (
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Resumes to Analyze ({uploadingResumes.length})
                                </h3>
                                <div className="space-y-3">
                                    {uploadingResumes.map((resume, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <span className="text-xl">📄</span>
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={resume.title}
                                                    onChange={(e) => handleTitleChange(index, e.target.value)}
                                                    placeholder="Candidate name or title"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                                />
                                                <p className="text-xs text-gray-600 mt-1">{resume.file.name}</p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveResume(index)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handleUploadAndAnalyze}
                                    disabled={analyzing}
                                    className="w-full mt-6 btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {analyzing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Analyzing Candidates...
                                        </>
                                    ) : (
                                        <>
                                            <span>🚀</span>
                                            Analyze All Candidates
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Rankings Tab */}
                {activeTab === "rankings" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {rankings.length === 0 ? (
                            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                                <div className="text-6xl mb-4">📊</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No candidates yet</h3>
                                <p className="text-gray-600 mb-6">Upload resumes to see candidate rankings</p>
                                <button
                                    onClick={() => setActiveTab("upload")}
                                    className="btn-primary"
                                >
                                    Upload Resumes
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rank</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Candidate</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Score</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Top Skills</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {rankings.map((candidate, index) => (
                                                <motion.tr
                                                    key={candidate.resume_id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className={`hover:bg-gray-50 transition-colors ${candidate.is_top_3 ? "bg-primary/5" : ""
                                                        }`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${candidate.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                                                                candidate.rank === 2 ? "bg-gray-200 text-gray-700" :
                                                                    candidate.rank === 3 ? "bg-orange-100 text-orange-700" :
                                                                        "bg-gray-100 text-gray-600"
                                                            }`}>
                                                            {candidate.rank === 1 ? "🥇" :
                                                                candidate.rank === 2 ? "🥈" :
                                                                    candidate.rank === 3 ? "🥉" :
                                                                        candidate.rank}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-gray-900">{candidate.resume_title}</div>
                                                        <div className="text-sm text-gray-600 line-clamp-1">{candidate.summary}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <ScoreCircle score={candidate.score} size="sm" showLabel={false} />
                                                            <span className="font-semibold text-gray-900">{candidate.score}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-wrap gap-1">
                                                            {candidate.top_skills.slice(0, 3).map((skill: string, i: number) => (
                                                                <span
                                                                    key={i}
                                                                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => router.push(`/recruiter/candidates/${candidate.resume_id}?job=${params.id}`)}
                                                            className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                                        >
                                                            View Details
                                                        </button>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </RecruiterLayout>
    );
}
