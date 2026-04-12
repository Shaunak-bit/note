"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { resetPassword } from "@/app/lib/api";

export default function ResetPassword() {
    const { token } = useParams();
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const passwordsMatch = confirm === "" || password === confirm;
    const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
    const strengthLabel = ["", "Weak", "Fair", "Strong"];
    const strengthColor = ["", "#ef4444", "#f97316", "#22c55e"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) return;
        setLoading(true);
        setMessage("");

        const res = await resetPassword(token as string, password);

        if (res.success) {
            setStatus("success");
            setMessage("Password reset successfully! Redirecting you to sign in…");
            setTimeout(() => router.push("/signin"), 2500);
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
                    className="bg-white rounded-3xl p-8 shadow-xl"
                    style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)" }}
                >
                    <div className="mb-7">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1.5">
                            Create new password
                        </h1>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Your new password must be different from your previous one.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Password field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-gray-800 placeholder:text-gray-300 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-gray-50/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Strength bar */}
                            {password.length > 0 && (
                                <div className="space-y-1 pt-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className="h-1 flex-1 rounded-full transition-all duration-300"
                                                style={{
                                                    background: strength >= i ? strengthColor[strength] : "#e5e7eb",
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs font-medium" style={{ color: strengthColor[strength] }}>
                                        {strengthLabel[strength]}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    required
                                    className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm text-gray-800 placeholder:text-gray-300 outline-none transition-all duration-200 bg-gray-50/50 ${!passwordsMatch
                                            ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                            : "border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirm ? (
                                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {!passwordsMatch && (
                                <p className="text-xs text-red-400 font-medium">Passwords do not match</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || !passwordsMatch}
                            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
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
                                    Resetting…
                                </span>
                            ) : "Reset Password"}
                        </button>
                    </form>

                    {/* Feedback */}
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

                {/* Back link */}
                <p className="text-center mt-6 text-sm text-gray-400">
                    Remember your password?{" "}
                    <a href="/signin" className="text-orange-500 hover:text-orange-600 transition-colors font-semibold">
                        Back to sign in
                    </a>
                </p>
            </div>
        </div>
    );
}