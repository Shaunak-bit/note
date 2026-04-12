"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/app/lib/api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const res = await forgotPassword(email);

        if (res.success) {
            setStatus("success");
            setMessage("If an account exists, a reset link has been sent to your email.");
        } else {
            setStatus("error");
            setMessage(res.message);
        }

        setLoading(false);
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{
                background: "linear-gradient(135deg, #fff7f0 0%, #fef3ec 50%, #fde8d8 100%)",
            }}
        >
            {/* Decorative blobs */}
            <div
                className="fixed top-[-80px] right-[-80px] w-72 h-72 rounded-full pointer-events-none"
                style={{ background: "rgba(249,115,22,0.08)" }}
            />
            <div
                className="fixed bottom-[-60px] left-[-60px] w-56 h-56 rounded-full pointer-events-none"
                style={{ background: "rgba(249,115,22,0.06)" }}
            />

            <div className="relative w-full max-w-md">

                {/* Icon */}
                <div className="flex justify-center mb-7">
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                        style={{
                            background: "linear-gradient(135deg, #f97316, #ea580c)",
                            boxShadow: "0 8px 24px rgba(249,115,22,0.35)",
                        }}
                    >
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                    </div>
                </div>

                {/* Card */}
                <div
                    className="bg-white rounded-3xl p-8"
                    style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)" }}
                >
                    <div className="mb-7">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1.5">
                            Forgot your password?
                        </h1>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            No worries. Enter your email and we'll send you a secure link to reset it.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                                Email address
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-gray-50/50"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background: "linear-gradient(135deg, #f97316, #ea580c)",
                                boxShadow: "0 4px 16px rgba(249,115,22,0.35)",
                            }}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Sending…
                                </span>
                            ) : (
                                "Send Reset Link"
                            )}
                        </button>
                    </form>

                    {/* Feedback message */}
                    {message && (
                        <div className={`mt-5 flex items-start gap-3 rounded-xl px-4 py-3 text-sm ${status === "success"
                                ? "bg-green-50 border border-green-200 text-green-700"
                                : "bg-red-50 border border-red-200 text-red-600"
                            }`}>
                            {status === "success" ? (
                                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                            )}
                            {message}
                        </div>
                    )}
                </div>

                {/* Back to login */}
                <p className="text-center mt-6 text-sm text-gray-400">
                    Remember your password?{" "}
                    <Link href="/signin" className="text-orange-500 hover:text-orange-600 transition-colors font-semibold">
                        Back to sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}