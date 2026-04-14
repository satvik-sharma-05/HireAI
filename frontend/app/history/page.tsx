"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { useAuthStore } from "@/lib/store";
import { analysisAPI } from "@/lib/api";

export default function HistoryPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        if (!user) {
            router.push("/auth/login");
            return;
        }
        loadHistory();
    }, [user, router]);

    const loadHistory = async () => {
        try {
            const res = await analysisAPI.history();
            setAnalyses(res.data);
        } catch (error) {
            console.error("Failed to load history", error);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredAnalyses = () => {
        if (filter === "all") return analyses;
        if (filter === "high") return analyses.filter((a: any) => a.score >= 80);
        if (filter === "medium") return analyses.filter((a: any) => a.score >= 60 && a.score < 80);
        if (filter === "low") return analyses.filter((a: any) => a.score < 60);
        return analyses;
    };

    const filteredAnalyses = getFilteredAnalyses();

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis History</h1>
                    <p className="text-gray-600">Review all your past resume analyses</p>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-slide-up">
                    <div className="card text-center">
                        <div className="text-2xl font-bold text-gray-900">{analyses.length}</div>
                        <div className="text-sm text-gray-600">Total</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-2xl font-bold text-primary">
                            {analyses.filter((a: any) => a.score >= 80).length}
                        </div>
                        <div className="text-sm text-gray-600">High Match</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                            {analyses.filter((a: any) => a.score >= 60 && a.score < 80).length}
                        </div>
                        <div className="text-sm text-gray-600">Medium Match</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-2xl font-bold text-red-600">
                            {analyses.filter((a: any) => a.score < 60).length}
                        </div>
                        <div className="text-sm text-gray-600">Low Match</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === "all"
                            ? "bg-primary text-white"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                            }`}
                    >
                        All ({analyses.length})
                    </button>
                    <button
                        onClick={() => setFilter("high")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === "high"
                            ? "bg-primary text-white"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                            }`}
                    >
                        High Match ({analyses.filter((a: any) => a.score >= 80).length})
                    </button>
                    <button
                        onClick={() => setFilter("medium")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === "medium"
                            ? "bg-primary text-white"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                            }`}
                    >
                        Medium Match ({analyses.filter((a: any) => a.score >= 60 && a.score < 80).length})
                    </button>
                    <button
                        onClick={() => setFilter("low")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === "low"
                            ? "bg-primary text-white"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                            }`}
                    >
                        Low Match ({analyses.filter((a: any) => a.score < 60).length})
                    </button>
                </div>

                {/* Analyses List */}
                <div className="card">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-600 mt-4">Loading history...</p>
                        </div>
                    ) : filteredAnalyses.length === 0 ? (
                        <div className="text-center py-12">
                            <svg
                                className="w-16 h-16 text-gray-300 mx-auto mb-4"
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
                            <p className="text-gray-600 mb-4">
                                {filter === "all" ? "No analyses yet" : "No analyses in this category"}
                            </p>
                            {filter === "all" && (
                                <Link href="/analyze">
                                    <button className="btn-primary">Analyze Your First Resume</button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredAnalyses.map((analysis: any, index: number) => (
                                <Link
                                    key={analysis.id}
                                    href={`/history/${analysis.id}`}
                                    className="block p-5 border border-gray-200 rounded-lg hover:border-primary/30 hover:shadow-md transition-all animate-slide-up"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            {/* Title and Score */}
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <h3 className="font-semibold text-gray-900 text-lg">
                                                    {analysis.job_title}
                                                </h3>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${analysis.score >= 80
                                                        ? "bg-primary/10 text-primary"
                                                        : analysis.score >= 60
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {analysis.score}% Match
                                                </span>
                                            </div>

                                            {/* Summary */}
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                {analysis.summary}
                                            </p>

                                            {/* Meta Info */}
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <svg
                                                        className="w-4 h-4"
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
                                                    {analysis.resume_filename}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                    {new Date(analysis.created_at).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <svg
                                            className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
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
