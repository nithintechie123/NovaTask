import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const passwordValid = password.length >= 6;
    const strengthPercent = Math.min((password.length / 10) * 100, 100);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!passwordValid) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        try {
            await register(username, email, password);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create account. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            badgeText="Get started free"
            title="Create your account"
            subtitle="Set up your workspace in seconds and start organizing tasks"
            footerPrompt="Already have an account?"
            footerLinkText="Sign in"
            footerLinkTo="/login"
        >
            {error && (
                <div className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-sm">
                    <AlertCircle size={17} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        Username
                    </label>
                    <div className="relative">
                        <User
                            size={17}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
                        />
                        <input
                            type="text"
                            required
                            placeholder="johndoe"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 transition text-sm"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail
                            size={17}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
                        />
                        <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 transition text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                            Password
                        </label>
                        <span
                            className={`text-[11px] font-medium ${
                                password.length === 0
                                    ? "text-slate-400"
                                    : passwordValid
                                      ? "text-emerald-600 dark:text-emerald-400"
                                      : "text-amber-600 dark:text-amber-400"
                            }`}
                        >
                            Min. 6 characters
                        </span>
                    </div>
                    <div className="relative">
                        <Lock
                            size={17}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
                        />
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="••••••••"
                            className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 transition text-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                    </div>

                    {/* Subtle password length indicator */}
                    {password.length > 0 && (
                        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                    passwordValid ? "bg-emerald-500" : "bg-amber-500"
                                }`}
                                style={{ width: `${strengthPercent}%` }}
                            />
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="group w-full mt-2 py-3 px-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 disabled:opacity-60 cursor-pointer"
                >
                    {loading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Creating account...</span>
                        </>
                    ) : (
                        <>
                            <span>Create Account</span>
                            <ArrowRight
                                size={18}
                                className="transition-transform duration-200 group-hover:translate-x-0.5"
                            />
                        </>
                    )}
                </button>
            </form>
        </AuthLayout>
    );
}
