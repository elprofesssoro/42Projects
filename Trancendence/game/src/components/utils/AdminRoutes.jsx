import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AdminRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default AdminRoutes;
