"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import toast from "react-hot-toast";

export default function SignupPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "candidate",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authAPI.signup(formData);
            const { access_token, user } = response.data;
            setAuth(user, access_token);
            toast.success("Account created successfully!");

            // Redirect based on user role
            if (user.role === "recruiter") {
                router.push("/recruiter");
            } else {
                router.push("/dashboard");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">H</span>
                    </div>
                    <span className="text-2xl font-semibold text-gray-900">HireAI</span>
                </Link>

                {/* Signup Card */}
                <div className="card animate-fade-in">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-600 mb-8">Join HireAI today</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                            />
                            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: "candidate" })}
                                    className={`p-4 rounded-lg border-2 transition-all ${formData.role === "candidate"
                                        ? "border-primary bg-primary/5"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <div className="text-2xl mb-2">🧑‍💻</div>
                                    <div className="font-semibold text-gray-900">Candidate</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: "recruiter" })}
                                    className={`p-4 rounded-lg border-2 transition-all ${formData.role === "recruiter"
                                        ? "border-primary bg-primary/5"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <div className="text-2xl mb-2">👨‍💼</div>
                                    <div className="font-semibold text-gray-900">Recruiter</div>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>

                    <p className="text-center text-gray-600 mt-6">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-primary hover:text-primary-hover font-medium">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
