import React from 'react';
import { useAuth } from '../../../hooks/useAuth.js';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
    const { getUserRole } = useAuth();
    const role = getUserRole();

    // Redirect based on user role
    switch (role) {
        case 'ADMIN':
        case 'OWNER':
            return <Navigate to="/admin/dashboard" replace />;
        case 'MANAGER':
            return <Navigate to="/manager/dashboard" replace />;
        case 'USER':
            return <Navigate to="/user/dashboard" replace />;
        default:
            return <Navigate to="/login" replace />;
    }
};

export default Dashboard;