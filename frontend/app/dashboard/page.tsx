"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useAuthStore } from "@/lib/store";
import { analysisAPI } from "@/lib/api";
import Link from "next/link";

export default function DashboardPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push("/auth/login");
            return;
        }
        loadData();
    }, [user, router]);

    const loadData = async () => {
        try {
            const res = await analysisAPI.history();
            setAnalyses(res.data.slice(0, 5)); // Latest 5
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const getAverageScore = () => {
        if (analyses.length === 0) return 0;
        const sum = analyses.reduce((acc: number, a: any) => acc + a.score, 0);
        return Math.round(sum / analyses.length);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Welcome Section */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.email?.split('@')[0]}
                    </h1>
                    <p className="text-gray-600">
                        Track your resume analyses and improve your job applications
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-8 animate-slide-up">
                    <div className="card-hover">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{analyses.length}</div>
                        <div className="text-sm text-gray-600">Total Analyses</div>
                    </div>

                    <div className="card-hover">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{getAverageScore()}%</div>
                        <div className="text-sm text-gray-600">Average Score</div>
                    </div>

                    <div className="card-hover">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {analyses.length > 0 ? new Date(analyses[0].created_at).toLocaleDateString() : '-'}
                        </div>
                        <div className="text-sm text-gray-600">Last Analysis</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Link href="/analyze" className="card-hover group cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Analyze Resume</h3>
                                <p className="text-sm text-gray-600">Upload and analyze your resume against job descriptions</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/history" className="card-hover group cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">View History</h3>
                                <p className="text-sm text-gray-600">Review all your past resume analyses and insights</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Recent Analyses */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Recent Analyses</h2>
                        <Link href="/history" className="text-sm text-primary hover:text-primary-hover font-medium">
                            View All →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-600 mt-4">Loading...</p>
                        </div>
                    ) : analyses.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-600 mb-4">No analyses yet</p>
                            <Link href="/analyze">
                                <button className="btn-primary">Analyze Your First Resume</button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {analyses.map((analysis: any) => (
                                <Link
                                    key={analysis.id}
                                    href={`/history/${analysis.id}`}
                                    className="block p-4 border border-gray-200 rounded-lg hover:border-primary/30 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-gray-900">{analysis.job_title || 'Untitled Job'}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${analysis.score >= 80 ? 'bg-primary/10 text-primary' :
                                                        analysis.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {analysis.score}% Match
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-1">{analysis.summary}</p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                {new Date(analysis.created_at).toLocaleDateString()} • {analysis.resume_filename}
                                            </p>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
