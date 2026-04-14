"use client";

import { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { motion } from "framer-motion";

interface RecruiterLayoutProps {
    children: ReactNode;
}

export default function RecruiterLayout({ children }: RecruiterLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: "📊", path: "/recruiter" },
        { id: "jobs", label: "Jobs", icon: "💼", path: "/recruiter/jobs" },
        { id: "candidates", label: "Candidates", icon: "👥", path: "/recruiter/candidates" },
        { id: "analytics", label: "Analytics", icon: "📈", path: "/recruiter/analytics" },
        { id: "chat", label: "AI Chat", icon: "💬", path: "/recruiter/chat" },
    ];

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col"
            >
                {/* Logo */}
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Hire<span className="text-primary">AI</span>
                    </h1>
                    <p className="text-xs text-gray-600 mt-1">Recruiter Dashboard</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path || (item.path !== "/recruiter" && pathname.startsWith(item.path));
                        return (
                            <button
                                key={item.id}
                                onClick={() => router.push(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${isActive
                                        ? "bg-primary text-white shadow-md"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold">
                                {user?.email?.[0].toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                            <p className="text-xs text-gray-600">Recruiter</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {navItems.find(item => pathname === item.path || (item.path !== "/recruiter" && pathname.startsWith(item.path)))?.label || "Dashboard"}
                            </h2>
                            <p className="text-sm text-gray-600 mt-0.5">
                                AI-powered recruitment platform
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                                Help
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
