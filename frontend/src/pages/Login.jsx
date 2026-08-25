import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { dispatch, token } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/user/login", { email, password });
      dispatch({ type: "LOGIN", payload: { user: res.data.user, token: res.data.token } });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden transition-all duration-300">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 cursor-pointer shadow-sm z-20"
        title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      >
        {theme === "dark" ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-[128px] pointer-events-none"></div>

      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 p-8 rounded-2xl w-full max-w-md shadow-2xl relative z-10 transition-all duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Sign in to manage your tasks</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-200 text-sm p-4 rounded-xl flex items-center space-x-2">
            <svg className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium text-sm mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium text-sm mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/25 transition-all duration-300 hover:translate-y-[-1px] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-semibold transition-colors duration-200"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
