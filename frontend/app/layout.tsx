import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "HireAI Lite - AI-Powered Resume Screening",
    description: "GenAI-powered recruitment platform with NLP-based resume parsing and semantic matching",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-white text-gray-900`}>
                {children}
                <Toaster position="top-right" />
            </body>
        </html>
    );
}
