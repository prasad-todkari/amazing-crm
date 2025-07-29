import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles, userRole }) {
  return allowedRoles.includes(userRole) ? <Outlet /> : <Navigate to="/unauthorized" replace />;
}