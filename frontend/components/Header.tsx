"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import toast from "react-hot-toast";

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        router.push("/");
    };

    const navLinks = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Resumes", href: "/resumes" },
        { name: "Analyze", href: "/analyze" },
        { name: "History", href: "/history" },
        { name: "Chat", href: "/chat" },
    ];

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

    if (!user) return null;

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 backdrop-blur-sm bg-white/95">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                            <span className="text-white font-bold text-lg">H</span>
                        </div>
                        <span className="text-xl font-semibold text-gray-900">HireAI</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive(link.href)
                                    ? "text-primary bg-primary/5"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                {link.name}
                                {isActive(link.href) && (
                                    <div className="h-0.5 bg-primary mt-1 rounded-full" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* User Menu */}
                    <div className="flex items-center gap-4">
                        {/* Desktop User Dropdown */}
                        <div className="hidden md:block relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <span className="text-primary font-medium text-sm">
                                        {user.email?.[0].toUpperCase()}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-700">{user.email}</span>
                                <svg
                                    className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? "rotate-180" : ""
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 animate-scale-in">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-xs text-gray-500">Signed in as</p>
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <svg
                                className="w-6 h-6 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {showMobileMenu ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div className="md:hidden py-4 border-t border-gray-200 animate-slide-up">
                        <nav className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setShowMobileMenu(false)}
                                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(link.href)
                                        ? "text-primary bg-primary/5"
                                        : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="border-t border-gray-200 my-2"></div>
                            <div className="px-4 py-2">
                                <p className="text-xs text-gray-500">Signed in as</p>
                                <p className="text-sm font-medium text-gray-900">{user.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="mx-4 mt-2 px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                Logout
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
