import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, getUserRole } = useAuth();

    console.log('ProtectedRoute check:', {
        isAuthenticated: isAuthenticated(),
        userRole: getUserRole(),
        allowedRoles: allowedRoles
    });

    if (!isAuthenticated()) {
        console.log('Not authenticated, redirecting to portal selection');
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        const userRole = getUserRole();

        if (!allowedRoles.includes(userRole)) {
            console.log('User does not have required role, redirecting to their dashboard');

            // Redirect to appropriate dashboard based on role
            if (userRole === 'ADMIN' || userRole === 'OWNER') {
                return <Navigate to="/admin/dashboard" replace />;
            } else if (userRole === 'MANAGER') {
                return <Navigate to="/manager/dashboard" replace />;
            } else if (userRole === 'USER') {
                return <Navigate to="/user/dashboard" replace />;
            }

            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;