import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-slate-400 text-lg animate-pulse">Loading NovaTask...</p>
      </div>
    );
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
