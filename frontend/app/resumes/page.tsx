"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useAuthStore } from "@/lib/store";
import { resumeAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function ResumesPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [resumes, setResumes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [customTitle, setCustomTitle] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            router.push("/auth/login");
            return;
        }
        loadResumes();
    }, [user, router]);

    const loadResumes = async () => {
        try {
            const res = await resumeAPI.list();
            setResumes(res.data);
        } catch (error) {
            console.error("Failed to load resumes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith(".pdf") && !file.name.endsWith(".docx")) {
            toast.error("Please upload a PDF or DOCX file");
            return;
        }

        setSelectedFile(file);
        setShowUploadModal(true);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            await resumeAPI.upload(selectedFile, customTitle || undefined);
            toast.success("Resume uploaded successfully!");
            setShowUploadModal(false);
            setSelectedFile(null);
            setCustomTitle("");
            loadResumes();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await resumeAPI.delete(id);
            toast.success("Resume deleted successfully");
            setDeleteConfirm(null);
            loadResumes();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Delete failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 animate-fade-in">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Resumes</h1>
                        <p className="text-gray-600">Manage your uploaded resumes</p>
                    </div>
                    <label>
                        <input
                            type="file"
                            accept=".pdf,.docx"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <button className="btn-primary flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Upload Resume
                        </button>
                    </label>
                </div>

                {/* Resumes Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600 mt-4">Loading resumes...</p>
                    </div>
                ) : resumes.length === 0 ? (
                    <div className="card text-center py-20">
                        <svg
                            className="w-20 h-20 text-gray-300 mx-auto mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h3>
                        <p className="text-gray-600 mb-6">Upload your first resume to get started</p>
                        <label>
                            <input
                                type="file"
                                accept=".pdf,.docx"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <button className="btn-primary">Upload Resume</button>
                        </label>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resumes.map((resume: any, index: number) => (
                            <div
                                key={resume.id}
                                className="card-hover animate-slide-up"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-primary"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                    </div>
                                    <button
                                        onClick={() => setDeleteConfirm(resume.id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                <h3 className="font-semibold text-gray-900 mb-1 truncate">
                                    {resume.custom_title || resume.filename}
                                </h3>
                                {resume.custom_title && (
                                    <p className="text-xs text-gray-500 mb-3 truncate">{resume.filename}</p>
                                )}

                                <div className="flex flex-wrap gap-1 mb-4">
                                    {resume.skills.slice(0, 3).map((skill: string, i: number) => (
                                        <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                            {skill}
                                        </span>
                                    ))}
                                    {resume.skills.length > 3 && (
                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                            +{resume.skills.length - 3}
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-gray-500 mb-4">
                                    {new Date(resume.created_at).toLocaleDateString()}
                                </p>

                                <button
                                    onClick={() => router.push(`/analyze?resume=${resume.id}`)}
                                    className="w-full btn-primary py-2 text-sm"
                                >
                                    Analyze Resume
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="card max-w-md w-full animate-scale-in">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Resume</h2>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">File: {selectedFile?.name}</p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Custom Title (Optional)
                            </label>
                            <input
                                type="text"
                                value={customTitle}
                                onChange={(e) => setCustomTitle(e.target.value)}
                                placeholder="e.g., Backend Resume v2, Frontend Portfolio"
                                className="w-full"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Give this resume a memorable name for easy identification
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setSelectedFile(null);
                                    setCustomTitle("");
                                }}
                                className="btn-secondary flex-1"
                                disabled={uploading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                className="btn-primary flex-1"
                                disabled={uploading}
                            >
                                {uploading ? "Uploading..." : "Upload"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="card max-w-md w-full animate-scale-in">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Resume?</h2>
                        <p className="text-gray-600 mb-6">
                            This will permanently delete this resume and all associated analyses. This action cannot be
                            undone.
                        </p>

                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1">
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
