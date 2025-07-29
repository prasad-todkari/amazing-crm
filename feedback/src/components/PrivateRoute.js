import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, roles = [] }) => {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/login" />;
  if (roles.length && !roles.includes(auth.role)) return <Navigate to="/unauthorized" />;
  return children;
};

export default PrivateRoute
