import { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'admin' | 'super-admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const auth = useContext(AuthContext);
    const location = useLocation();

    useEffect(() => {
        // You can add additional checks here if needed
    }, [auth?.user]);

    if (!auth) {
        return <div>Loading...</div>;
    }

    if (auth.loading) {
        return <div>Loading...</div>;
    }

    if (!auth.user) {
        // Redirect to login page with the return url
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // If role is required, check if user has the required role
    if (requiredRole) {
        const userRole = auth.user.role;
        if (userRole !== requiredRole && userRole !== 'super-admin') {
            return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute; 