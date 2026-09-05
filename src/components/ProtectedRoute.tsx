import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role !== 'admin') {
      localStorage.removeItem('token');
      return <Navigate to="/login?error=enumerator_web" replace />;
    }
  } catch {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}