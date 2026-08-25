import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, dispatch } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800/60 py-4 px-6 md:px-12 flex items-center justify-between transition-all duration-300">
      {/* Brand logo */}
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-900 dark:from-white dark:via-slate-100 dark:to-indigo-200 bg-clip-text text-transparent tracking-wide">
          TaskFlow
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 cursor-pointer shadow-sm"
          title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
          {theme === "dark" ? (
            // Sun Icon
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          ) : (
            // Moon Icon
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* User Info & Logout */}
        {user && (
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow">
                {user.username ? user.username[0].toUpperCase() : "U"}
              </div>
              <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                {user.username}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-white dark:text-slate-300 dark:hover:text-white bg-slate-55 hover:bg-red-500/10 dark:bg-slate-800 dark:hover:bg-red-500/10 border border-slate-200 dark:border-slate-700 hover:border-red-500/30 dark:hover:border-red-500/30 rounded-lg transition-all duration-300 shadow-sm cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
