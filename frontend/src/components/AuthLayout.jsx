import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
    CheckSquare,
    CheckCircle2,
    Clock,
    ShieldCheck,
    Sparkles,
    Sun,
    Moon,
} from "lucide-react";

/**
 * Shared split-screen authentication layout for Login and Register pages.
 * Provides adaptive light/dark styling, branding showcase, and a floating theme toggle.
 */
export default function AuthLayout({
    title,
    subtitle,
    badgeText,
    footerPrompt,
    footerLinkText,
    footerLinkTo,
    children,
}) {
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden">
            {/* Ambient background blobs */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/20 dark:bg-indigo-500/15 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-500/20 dark:bg-violet-500/15 blur-3xl" />
            </div>

            {/* Floating Theme Toggle */}
            <button
                type="button"
                onClick={toggleTheme}
                className="fixed top-5 right-5 z-20 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 shadow-sm hover:scale-105 transition cursor-pointer"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle Theme"
            >
                {isDark ? (
                    <Sun size={18} className="text-amber-400" />
                ) : (
                    <Moon size={18} className="text-slate-700" />
                )}
            </button>

            {/* Main Split Card */}
            <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-slate-900/75 backdrop-blur-xl shadow-2xl shadow-indigo-500/10">
                {/* Left Brand Showcase Panel */}
                <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-9 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white relative overflow-hidden">
                    {/* Subtle decorative circles */}
                    <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                    <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-indigo-300/20 blur-2xl" />

                    {/* Top Brand */}
                    <div className="relative z-10">
                        <div className="flex items-center gap-2.5 mb-8">
                            <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 shadow-lg">
                                <CheckSquare size={22} className="text-white" />
                            </div>
                            <span className="text-2xl font-extrabold tracking-tight">
                                Nova<span className="text-indigo-200">Task</span>
                            </span>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold tracking-wide mb-4">
                            <Sparkles size={13} />
                            <span>{badgeText}</span>
                        </div>

                        <h2 className="text-3xl font-extrabold leading-tight tracking-tight mb-3">
                            Organize work.
                            <br />
                            Ship faster.
                        </h2>
                        <p className="text-indigo-100/90 text-sm leading-relaxed">
                            A clean, focused workspace to track active tasks, celebrate completions, and stay ahead every day.
                        </p>
                    </div>
                    {/* Bottom Trust Note */}
                    <div className="relative z-10 flex items-center gap-2 text-xs text-indigo-100/85 pt-4 border-t border-white/15">
                        <ShieldCheck size={16} className="text-emerald-300 shrink-0" />
                        <span>Protected with JWT authentication &amp; encrypted passwords</span>
                    </div>
                </div>

                {/* Right Form Panel */}
                <div className="lg:col-span-7 p-7 sm:p-10 md:p-12 flex flex-col justify-center">
                    {/* Mobile Brand Header */}
                    <div className="flex lg:hidden items-center justify-center gap-2.5 mb-6">
                        <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl shadow-lg shadow-indigo-500/30">
                            <CheckSquare size={22} className="text-white" />
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Nova<span className="text-indigo-600 dark:text-indigo-400">Task</span>
                        </span>
                    </div>

                    <div className="mb-7">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {title}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
                            {subtitle}
                        </p>
                    </div>

                    {children}

                    <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-7">
                        {footerPrompt}{" "}
                        <Link
                            to={footerLinkTo}
                            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                        >
                            {footerLinkText}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
