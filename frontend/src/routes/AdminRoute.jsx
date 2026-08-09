import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-500" />
          <p className="text-sm text-zinc-500">
            Verifying administrator access...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  const roles = Array.isArray(user.roles)
    ? user.roles
    : [];

  const isAdmin =
    roles.includes("ROLE_ADMIN") ||
    roles.includes("ADMIN");

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
