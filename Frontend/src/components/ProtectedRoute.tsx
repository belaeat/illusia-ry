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
        // Log authentication state for debugging
        console.log('ProtectedRoute - Auth state:', {
            user: auth?.user ? {
                email: auth.user.email,
                role: auth.user.role,
                uid: auth.user.uid
            } : null,
            loading: auth?.loading,
            isUserMode: auth?.isUserMode,
            requiredRole
        });
    }, [auth?.user, requiredRole]);

    if (!auth) {
        console.log('ProtectedRoute - No auth context available');
        return <div>Loading...</div>;
    }

    if (auth.loading) {
        console.log('ProtectedRoute - Auth is loading');
        return <div>Loading...</div>;
    }

    if (!auth.user) {
        console.log('ProtectedRoute - No user found, redirecting to login');
        // Redirect to login page with the return url
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // If role is required, check if user has the required role
    if (requiredRole) {
        const userRole = auth.user.role;
        const isUserMode = auth.isUserMode;

        console.log('ProtectedRoute - Role check:', {
            userRole,
            requiredRole,
            isUserMode
        });

        // If in user mode, deny access to admin routes
        if (isUserMode) {
            console.log('ProtectedRoute - User is in user mode, denying access');
            return <Navigate to="/" replace />;
        }

        // Check if user has the required role
        if (userRole !== requiredRole && userRole !== 'super-admin') {
            console.log('ProtectedRoute - User does not have required role');
            return <Navigate to="/" replace />;
        }
    }

    console.log('ProtectedRoute - Access granted');
    return <>{children}</>;
};

export default ProtectedRoute; 