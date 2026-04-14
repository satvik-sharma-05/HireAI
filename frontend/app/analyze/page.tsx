"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useAuthStore } from "@/lib/store";
import { resumeAPI, jobAPI, analysisAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function AnalyzePage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [resumes, setResumes] = useState<any[]>([]);
    const [selectedResume, setSelectedResume] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [analyzing, setAnalyzing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<any>(null);

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
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
            toast.error("Please upload a PDF or DOCX file");
            return;
        }

        setUploading(true);
        try {
            const res = await resumeAPI.upload(file);
            toast.success("Resume uploaded successfully!");
            setSelectedResume(res.data.id);
            loadResumes();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedResume || !jobDescription.trim()) {
            toast.error("Please select a resume and enter job description");
            return;
        }

        setAnalyzing(true);
        try {
            // Create job
            const jobRes = await jobAPI.create({
                title: jobTitle || "Analysis Job",
                description: jobDescription,
            });

            // Analyze
            const analysisRes = await analysisAPI.analyze({
                resume_id: selectedResume,
                job_id: jobRes.data.id,
            });

            setResult(analysisRes.data);
            toast.success("Analysis complete!");

            // Redirect to results page with data
            const dataParam = encodeURIComponent(JSON.stringify(analysisRes.data));
            router.push(`/analyze/results?resume=${selectedResume}&job=${jobRes.data.id}&data=${dataParam}`);
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Analysis failed");
        } finally {
            setAnalyzing(false);
        }
    };

    if (result) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-5xl mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="mb-8 animate-fade-in">
                        <button
                            onClick={() => setResult(null)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Analyze
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Analysis Results</h1>
                    </div>

                    {/* Score Section */}
                    <div className="card mb-6 text-center animate-scale-in">
                        <div className="mb-4">
                            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 mb-4">
                                <span className="score-display">{result.score}%</span>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Match Score</h2>
                        <p className="text-gray-600 mb-6">Based on semantic analysis and skill matching</p>

                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">{result.semantic_score}%</div>
                                <div className="text-sm text-gray-600">Semantic Match</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">{result.skill_score}%</div>
                                <div className="text-sm text-gray-600">Skill Match</div>
                            </div>
                        </div>
                    </div>

                    {/* Skills Comparison */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6 animate-slide-up">
                        <div className="card">
                            <div className="flex items-center gap-2 mb-4">
                                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-900">Matching Skills</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {result.matching_skills.length > 0 ? (
                                    result.matching_skills.map((skill: string, i: number) => (
                                        <span key={i} className="skill-badge-match">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">No matching skills found</p>
                                )}
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-2 mb-4">
                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-900">Missing Skills</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {result.missing_skills.length > 0 ? (
                                    result.missing_skills.map((skill: string, i: number) => (
                                        <span key={i} className="skill-badge-missing">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">All required skills present</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* AI Summary */}
                    <div className="card mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Summary
                        </h3>
                        <p className="text-gray-700 leading-relaxed">{result.summary}</p>
                    </div>

                    {/* Explanation */}
                    <div className="card mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Detailed Analysis
                        </h3>
                        <p className="text-gray-700 leading-relaxed">{result.explanation}</p>
                    </div>

                    {/* Suggestions */}
                    <div className="card mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            Recommendations
                        </h3>
                        <div className="space-y-4">
                            {result.suggestions.map((suggestion: string, i: number) => (
                                <div key={i} className="flex gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                                        {i + 1}
                                    </div>
                                    <p className="text-gray-700 flex-1">{suggestion}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Learning Resources */}
                    {result.learning_resources && Object.keys(result.learning_resources).length > 0 && (
                        <div className="card animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                Learning Resources
                            </h3>
                            <div className="space-y-6">
                                {Object.entries(result.learning_resources).map(([skill, resources]: [string, any]) => (
                                    <div key={skill} className="border-l-4 border-primary pl-4">
                                        <h4 className="font-semibold text-gray-900 mb-3 capitalize">{skill}</h4>

                                        {resources.courses && resources.courses.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Courses:</p>
                                                <div className="space-y-2">
                                                    {resources.courses.map((course: any, i: number) => (
                                                        <a
                                                            key={i}
                                                            href={course.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block text-sm text-primary hover:text-primary-hover hover:underline"
                                                        >
                                                            → {course.name} ({course.platform})
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {resources.projects && resources.projects.length > 0 && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700 mb-2">Project Ideas:</p>
                                                <ul className="space-y-1">
                                                    {resources.projects.map((project: string, i: number) => (
                                                        <li key={i} className="text-sm text-gray-600">• {project}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={() => setResult(null)}
                            className="btn-primary flex-1"
                        >
                            Analyze Another Resume
                        </button>
                        <button
                            onClick={() => router.push('/history')}
                            className="btn-secondary flex-1"
                        >
                            View All Analyses
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-4xl mx-auto px-6 py-8">
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Analyze Resume</h1>
                    <p className="text-gray-600">Upload your resume and compare it against a job description</p>
                </div>

                <div className="space-y-6">
                    {/* Resume Upload */}
                    <div className="card animate-slide-up">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">1. Upload Resume</h2>

                        {resumes.length > 0 && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select existing resume
                                </label>
                                <select
                                    value={selectedResume}
                                    onChange={(e) => setSelectedResume(e.target.value)}
                                    className="w-full"
                                >
                                    <option value="">Choose a resume...</option>
                                    {resumes.map((resume: any) => (
                                        <option key={resume.id} value={resume.id}>
                                            {resume.filename}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="text-center text-gray-500 mb-4">or</div>

                        <label className="block">
                            <div className="border-2 border-dashed border-gray-300 hover:border-primary rounded-lg p-8 text-center cursor-pointer transition-all hover:bg-gray-50">
                                {uploading ? (
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <p className="text-gray-600">Uploading...</p>
                                    </div>
                                ) : (
                                    <>
                                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                                        <p className="text-sm text-gray-500">PDF or DOCX (max 5MB)</p>
                                    </>
                                )}
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

                    {/* Job Details */}
                    <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">2. Job Details</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Title (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    placeholder="e.g. Senior Full Stack Developer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Description *
                                </label>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    rows={12}
                                    placeholder="Paste the complete job description here..."
                                    className="resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Analyze Button */}
                    <button
                        onClick={handleAnalyze}
                        disabled={analyzing || !selectedResume || !jobDescription.trim()}
                        className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {analyzing ? (
                            <span className="flex items-center justify-center gap-3">
                                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                Analyzing...
                            </span>
                        ) : (
                            "Analyze Resume"
                        )}
                    </button>
                </div>
            </main>
        </div>
    );
}
