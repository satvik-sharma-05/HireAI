"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { resumeAPI, jobAPI, analysisAPI } from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CandidateDashboard() {
    const [resumes, setResumes] = useState<any[]>([]);
    const [analyses, setAnalyses] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [resumesRes, analysesRes] = await Promise.all([
                resumeAPI.list(),
                analysisAPI.history(),
            ]);
            setResumes(resumesRes.data);
            setAnalyses(analysesRes.data);
        } catch (error) {
            console.error("Failed to load data", error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            await resumeAPI.upload(file);
            toast.success("Resume uploaded successfully!");
            loadData();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold mb-8">Candidate Dashboard</h1>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl mb-2">📄</div>
                        <div className="text-2xl font-bold">{resumes.length}</div>
                        <div className="text-text-secondary">Resumes</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl mb-2">📊</div>
                        <div className="text-2xl font-bold">{analyses.length}</div>
                        <div className="text-text-secondary">Analyses</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl mb-2">💬</div>
                        <div className="text-2xl font-bold">AI Chat</div>
                        <Link href="/candidate/chat">
                            <div className="text-primary text-sm mt-2 hover:underline cursor-pointer">
                                Start chatting →
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Upload Resume */}
                    <div className="glass rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
                        <label className="block">
                            <div className="border-2 border-dashed border-dark-border hover:border-primary rounded-lg p-8 text-center cursor-pointer transition-smooth">
                                <div className="text-4xl mb-2">📤</div>
                                <div className="text-text-secondary">
                                    {uploading ? "Uploading..." : "Click to upload PDF or DOCX"}
                                </div>
                            </div>
                            <input
                                type="file"
                                accept=".pdf,.docx"
                                onChange={handleFileUpload}
                                className="hidden"
                                disabled={uploading}
                            />
                        </label>
                    </div>

                    {/* Quick Actions */}
                    <div className="glass rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link href="/candidate/analyze">
                                <button className="w-full py-3 bg-primary hover:bg-primary-hover rounded-lg transition-smooth">
                                    Analyze Resume
                                </button>
                            </Link>
                            <Link href="/candidate/history">
                                <button className="w-full py-3 border border-dark-border hover:border-primary rounded-lg transition-smooth">
                                    View History
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Analyses */}
                {analyses.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Recent Analyses</h2>
                        <div className="space-y-4">
                            {analyses.slice(0, 3).map((analysis: any) => (
                                <div key={analysis.id} className="glass rounded-xl p-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-semibold">{analysis.summary}</div>
                                            <div className="text-sm text-text-secondary mt-1">
                                                {new Date(analysis.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold text-success">
                                            {analysis.score}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
