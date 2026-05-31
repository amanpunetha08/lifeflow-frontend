import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import DashboardLayout from '../layouts/DashboardLayout';

export default function ProtectedRoute() {
  const tokens = useAuthStore((s) => s.tokens);
  if (!tokens) return <Navigate to="/login" replace />;
  return <DashboardLayout />;
}
