// ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router";
import { hasRole } from "./auth";

export default function ProtectedRoute({ role }: { role: string }) {
    return hasRole(role) ? <Outlet /> : <Navigate to="/" replace />;
}