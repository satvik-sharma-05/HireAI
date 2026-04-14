"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { resumeAPI, jobAPI, analysisAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
    const router = useRouter();
    const [resumes, setResumes] = useState<any[]>([]);
    const [selectedResume, setSelectedResume] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        loadResumes();
    }, []);

    const loadResumes = async () => {
        try {
            const res = await resumeAPI.list();
            setResumes(res.data);
        } catch (error) {
            console.error("Failed to load resumes", error);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedResume || !jobDescription) {
            toast.error("Please select resume and enter job description");
            return;
        }

        setAnalyzing(true);
        try {
            // Create temporary job
            const jobRes = await jobAPI.create({
                title: "Analysis Job",
                description: jobDescription,
            });

            // Analyze
            const analysisRes = await analysisAPI.analyze({
                resume_id: selectedResume,
                job_id: jobRes.data.id,
            });

            setResult(analysisRes.data);
            toast.success("Analysis complete!");
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Analysis failed");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="max-w-5xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold mb-8">Analyze Resume</h1>

                {!result ? (
                    <div className="space-y-6">
                        <div className="glass rounded-xl p-6">
                            <label className="block text-sm mb-2">Select Resume</label>
                            <select
                                value={selectedResume}
                                onChange={(e) => setSelectedResume(e.target.value)}
                                className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg focus:border-primary outline-none"
                            >
                                <option value="">Choose a resume...</option>
                                {resumes.map((resume: any) => (
                                    <option key={resume.id} value={resume.id}>
                                        {resume.filename}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="glass rounded-xl p-6">
                            <label className="block text-sm mb-2">Job Description</label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                rows={10}
                                className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg focus:border-primary outline-none resize-none"
                                placeholder="Paste the job description here..."
                            />
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            className="w-full py-3 bg-primary hover:bg-primary-hover rounded-lg font-semibold transition-smooth disabled:opacity-50"
                        >
                            {analyzing ? "Analyzing..." : "Analyze Resume"}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Score */}
                        <div className="glass rounded-xl p-8 text-center">
                            <div className="text-6xl font-bold text-success mb-2">
                                {result.score}%
                            </div>
                            <div className="text-text-secondary">Match Score</div>
                        </div>

                        {/* Skills */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="glass rounded-xl p-6">
                                <h3 className="font-bold mb-4 text-success">✓ Matching Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.matching_skills.map((skill: string, i: number) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-success/20 text-success rounded-full text-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="glass rounded-xl p-6">
                                <h3 className="font-bold mb-4 text-red-500">✗ Missing Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.missing_skills.map((skill: string, i: number) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-red-500/20 text-red-500 rounded-full text-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="glass rounded-xl p-6">
                            <h3 className="font-bold mb-4">📝 Summary</h3>
                            <p className="text-text-secondary">{result.summary}</p>
                        </div>

                        {/* Explanation */}
                        <div className="glass rounded-xl p-6">
                            <h3 className="font-bold mb-4">💡 Explanation</h3>
                            <p className="text-text-secondary">{result.explanation}</p>
                        </div>

                        {/* Suggestions */}
                        <div className="glass rounded-xl p-6">
                            <h3 className="font-bold mb-4">🚀 Suggestions</h3>
                            <ul className="space-y-2">
                                {result.suggestions.map((suggestion: string, i: number) => (
                                    <li key={i} className="text-text-secondary">
                                        • {suggestion}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            onClick={() => setResult(null)}
                            className="w-full py-3 border border-dark-border hover:border-primary rounded-lg transition-smooth"
                        >
                            Analyze Another
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
