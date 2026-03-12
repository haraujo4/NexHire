import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
    allowedRole: 'company' | 'candidate';
}

export function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated || !user) {
        return <Navigate to="/" replace />;
    }

    if (user.role !== allowedRole) {
        console.warn(`[ProtectedRoute] Access denied: User role '${user.role}' does not match allowedRole '${allowedRole}'`);
        return <Navigate to={user.role === 'company' ? '/company' : '/candidate'} replace />;
    }

    return <Outlet />;
}
