"use client";

import Link from "next/link";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white">
            <nav className="border-b border-gray-200 backdrop-blur-sm sticky top-0 z-50 bg-white/95">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">H</span>
                        </div>
                        <span className="text-xl font-semibold text-gray-900">HireAI</span>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/auth/login">
                            <button className="px-5 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                Sign in
                            </button>
                        </Link>
                        <Link href="/auth/signup">
                            <button className="btn-primary">
                                Get Started →
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            <section className="max-w-7xl mx-auto px-6 pt-24 pb-32">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="animate-fade-in">
                        <div className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary mb-6 font-medium">
                            ✨ AI-Powered Recruitment
                        </div>
                        <h1 className="text-6xl font-bold mb-6 leading-tight tracking-tight text-gray-900">
                            Hire smarter with
                            <br />
                            <span className="gradient-text">
                                AI intelligence
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
                            Transform your hiring process with semantic resume analysis, explainable AI insights, and intelligent candidate matching.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/auth/signup">
                                <button className="btn-primary px-8 py-4 text-base">
                                    Start Free Trial
                                </button>
                            </Link>
                            <Link href="/auth/login">
                                <button className="btn-secondary px-8 py-4 text-base">
                                    Sign In
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="relative animate-slide-up">
                        <div className="relative card p-8 shadow-xl">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 font-medium">Candidate Match</span>
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                                        High Fit
                                    </span>
                                </div>
                                <div className="flex items-end gap-3">
                                    <div className="text-6xl font-bold gradient-text">
                                        92
                                    </div>
                                    <div className="text-2xl text-gray-400 mb-2">/ 100</div>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: "92%" }}></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="text-2xl font-bold text-gray-900">85%</div>
                                        <div className="text-xs text-gray-600">Skills Match</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="text-2xl font-bold text-gray-900">98%</div>
                                        <div className="text-xs text-gray-600">Semantic</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="max-w-7xl mx-auto px-6 py-24 bg-gray-50">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 text-gray-900">Everything you need to hire better</h2>
                    <p className="text-gray-600 text-lg">Powerful features built for modern recruitment</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: "🎯", title: "Smart Matching", desc: "Semantic analysis beyond keywords" },
                        { icon: "🧠", title: "Explainable AI", desc: "Understand every decision" },
                        { icon: "💬", title: "AI Assistant", desc: "Context-aware career chat" },
                        { icon: "📊", title: "Analytics", desc: "Deep insights and metrics" },
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className="card-hover cursor-pointer"
                        >
                            <div className="text-4xl mb-4 transition-transform group-hover:scale-110">{feature.icon}</div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="border-t border-gray-200 mt-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                                <span className="text-white font-bold text-sm">H</span>
                            </div>
                            <span className="font-semibold text-gray-900">HireAI</span>
                        </div>
                        <div className="text-sm text-gray-600">
                            © 2026 HireAI. Built for smarter hiring.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
