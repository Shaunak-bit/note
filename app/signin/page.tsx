"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUsers } from "@/app/lib/api";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = await loginUsers(email, password);
            if (!data.success) { alert(data.message); return; }
            router.push("/dashboard");
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex"
            style={{ backgroundColor: "#f5f4ef", fontFamily: "'Georgia', serif" }}
        >
            {/* Left decorative panel */}
            <div
                className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12 relative overflow-hidden"
                style={{ backgroundColor: "#1a1a1a" }}
            >
                {/* Warm orange circle blob */}
                <div
                    className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full opacity-20"
                    style={{ backgroundColor: "#f97316" }}
                />
                <div
                    className="absolute bottom-[-60px] left-[-60px] w-56 h-56 rounded-full opacity-10"
                    style={{ backgroundColor: "#fb923c" }}
                />

                {/* Logo */}
                <div className="relative z-10">
                    <div
                        className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-8"
                        style={{ backgroundColor: "#f97316" }}
                    >
                        <LogIn className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium tracking-widest uppercase" style={{ color: "#f97316" }}>
                        Your Platform
                    </p>
                </div>

                {/* Quote */}
                <div className="relative z-10">
                    <blockquote
                        className="text-3xl font-light leading-snug mb-6"
                        style={{ color: "#f5f4ef" }}
                    >
                        "Manage everything, <br />
                        <span style={{ color: "#fb923c" }}>track anything.</span>"
                    </blockquote>
                    <p className="text-sm" style={{ color: "#6b6b6b" }}>
                        Your items, your analytics, your control.
                    </p>
                </div>

                {/* Bottom dots */}
                <div className="relative z-10 flex gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#f97316" }} />
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#444" }} />
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#444" }} />
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden mb-10 flex items-center gap-3">
                        <div
                            className="inline-flex items-center justify-center w-10 h-10 rounded-xl"
                            style={{ backgroundColor: "#f97316" }}
                        >
                            <LogIn className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-lg" style={{ color: "#1a1a1a" }}>
                            Your Platform
                        </span>
                    </div>

                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-semibold mb-2" style={{ color: "#1a1a1a", letterSpacing: "-0.02em" }}>
                            Welcome back
                        </h1>
                        <p className="text-base" style={{ color: "#888" }}>
                            Sign in to continue to your dashboard
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: "#3a3a3a" }}>
                                Email address
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
                                    style={{ color: focusedField === "email" ? "#f97316" : "#aaa" }}
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField("email")}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200"
                                    style={{
                                        backgroundColor: "#fff",
                                        border: focusedField === "email" ? "1.5px solid #f97316" : "1.5px solid #e5e5e5",
                                        color: "#1a1a1a",
                                        boxShadow: focusedField === "email" ? "0 0 0 3px rgba(249,115,22,0.1)" : "none",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium" style={{ color: "#3a3a3a" }}>
                                    Password
                                </label>
                                <a
                                    href="/forgot-password"
                                    className="text-sm font-medium transition-colors duration-200 hover:underline"
                                    style={{ color: "#f97316" }}
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <Lock
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
                                    style={{ color: focusedField === "password" ? "#f97316" : "#aaa" }}
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField("password")}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm outline-none transition-all duration-200"
                                    style={{
                                        backgroundColor: "#fff",
                                        border: focusedField === "password" ? "1.5px solid #f97316" : "1.5px solid #e5e5e5",
                                        color: "#1a1a1a",
                                        boxShadow: focusedField === "password" ? "0 0 0 3px rgba(249,115,22,0.1)" : "none",
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                                    style={{ color: "#aaa" }}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded cursor-pointer"
                                style={{ accentColor: "#f97316" }}
                            />
                            <label htmlFor="remember" className="text-sm cursor-pointer" style={{ color: "#666" }}>
                                Remember me for 30 days
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 group"
                            style={{
                                backgroundColor: isLoading ? "#fdba74" : "#f97316",
                                boxShadow: "0 4px 14px rgba(249,115,22,0.35)",
                            }}
                            onMouseEnter={(e) => {
                                if (!isLoading) (e.currentTarget.style.backgroundColor = "#ea6c0a");
                            }}
                            onMouseLeave={(e) => {
                                if (!isLoading) (e.currentTarget.style.backgroundColor = "#f97316");
                            }}
                        >
                            {isLoading ? (
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-7">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t" style={{ borderColor: "#e5e5e5" }} />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-4 text-sm" style={{ backgroundColor: "#f5f4ef", color: "#aaa" }}>
                                or continue with
                            </span>
                        </div>
                    </div>

                    {/* Social */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            className="flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                            style={{
                                backgroundColor: "#fff",
                                border: "1.5px solid #e5e5e5",
                                color: "#3a3a3a",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#f97316")}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e5e5e5")}
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                        <button
                            className="flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                            style={{
                                backgroundColor: "#fff",
                                border: "1.5px solid #e5e5e5",
                                color: "#3a3a3a",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#f97316")}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e5e5e5")}
                        >
                            <svg className="w-4 h-4" fill="#1a1a1a" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            GitHub
                        </button>
                    </div>

                    {/* Sign up link */}
                    <p className="text-center text-sm mt-8" style={{ color: "#888" }}>
                        Don't have an account?{" "}
                        <Link
                            href="/signup"
                            className="font-semibold transition-colors duration-200 hover:underline"
                            style={{ color: "#f97316" }}
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}