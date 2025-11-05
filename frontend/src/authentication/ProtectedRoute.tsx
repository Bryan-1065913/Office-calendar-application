// ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router";
import { useAuth } from './AuthContext';


export default function ProtectedRoute({ role }: { role?: string }) {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // check role
    if (role && user?.role !== role) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;

}