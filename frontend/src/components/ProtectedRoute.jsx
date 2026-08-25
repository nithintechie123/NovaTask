import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, token } = useAuth();

  // If token is present but user details are not yet loaded, show a premium loading screen
  if (token && !user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_60%)]"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="h-16 w-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Initializing secure session...</p>
        </div>
      </div>
    );
  }

  // If no token is found, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
