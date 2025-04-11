import React, { JSX, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: JSX.Element;
    requiredRole?: 'admin' | 'superadmin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { user, role } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check for role authorization. Superadmin bypasses other role checks.
    if (requiredRole && role !== requiredRole && role !== 'superadmin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
