import { ReactNode, useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/app-store/AuthContext";

interface ProtectedRouteProps {
  children?: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Verifying session...</div>;
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children || <Outlet />}</>;
}
