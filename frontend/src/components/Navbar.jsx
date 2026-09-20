import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { CheckSquare, LogOut, User, Sun, Moon, Menu, X } from "lucide-react";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-md transition-colors">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
                {/* Brand */}
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center">
                        <CheckSquare size={20} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Nova<span className="text-indigo-600 dark:text-indigo-400">Task</span>
                    </span>
                </div>

                {/* Desktop Navigation Items (hidden on mobile, visible on sm and above) */}
                <div className="hidden sm:flex items-center gap-3">
                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-700" />}
                    </button>

                    {/* User Info */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-sm">
                        <User size={15} className="text-indigo-500" />
                        <span className="font-semibold">{user?.username}</span>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                    >
                        <LogOut size={15} />
                        <span>Logout</span>
                    </button>
                </div>

                {/* Mobile Header Controls (Visible only on screens < sm) */}
                <div className="flex items-center gap-2 sm:hidden">
                    {/* Quick Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 transition"
                        aria-label="Toggle Theme"
                    >
                        {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-700" />}
                    </button>

                    {/* Hamburger Menu Toggle Button */}
                    <button
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer"
                        aria-label="Open Menu"
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="sm:hidden border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 py-4 space-y-3 transition-all animate-in fade-in slide-in-from-top-2">
                    {/* User Details */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                            <User size={18} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Signed in as</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.username}</p>
                        </div>
                    </div>

                    {/* Theme Switch Row */}
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-200 text-sm font-medium"
                    >
                        <span className="flex items-center gap-2">
                            {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-slate-700" />}
                            <span>Theme Mode</span>
                        </span>
                        <span className="text-xs uppercase font-semibold text-slate-400">
                            {isDark ? "Dark" : "Light"}
                        </span>
                    </button>

                    {/* Logout Action */}
                    <button
                        onClick={() => {
                            setMobileMenuOpen(false);
                            logout();
                        }}
                        className="w-full flex items-center justify-center gap-2 p-3 text-sm font-semibold rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition cursor-pointer"
                    >
                        <LogOut size={16} />
                        <span>Log Out</span>
                    </button>
                </div>
            )}
        </header>
    );
}
