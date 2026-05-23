import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();

  // Esperamos restauracion de sesion:
  if (loading) {
    return <p>Loading...</p>;
  }

  // Sin sesion:
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // No admin:
  if (profile?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin OK:
  return children;
};
