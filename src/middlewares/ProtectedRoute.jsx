import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("authToken"); // Check if token exists

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
