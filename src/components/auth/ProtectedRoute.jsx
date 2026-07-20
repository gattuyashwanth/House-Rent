import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function TenantRoute({ children }) {
  const { isTenantAuthenticated } = useAuth();
  return isTenantAuthenticated ? children : <Navigate to="/" replace />;
}

export function AdminRoute({ children }) {
  const { isAdminAuthenticated } = useAuth();
  return isAdminAuthenticated ? children : <Navigate to="/admin/login" replace />;
}
