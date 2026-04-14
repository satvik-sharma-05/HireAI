"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import toast from "react-hot-toast";

export default function Navbar() {
    const router = useRouter();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        router.push("/");
    };

    return (
        <nav className="border-b border-dark-border">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link href={user?.role === "candidate" ? "/candidate" : "/recruiter"}>
                    <div className="text-2xl font-bold text-primary cursor-pointer">HireAI</div>
                </Link>
                <div className="flex items-center gap-6">
                    <span className="text-text-secondary">{user?.email}</span>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 border border-dark-border hover:border-primary rounded-lg transition-smooth"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
