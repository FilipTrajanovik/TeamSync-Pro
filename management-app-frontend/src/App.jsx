import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './ui/components/routing/ProtectedRoute.jsx';
import PortalSelection from './ui/pages/PortalSelection/PortalSelection.jsx';
import AdminLogin from './ui/pages/AdminLogin/login.jsx';
import ManagerLogin from './ui/pages/Manager/ManagerLogin/ManagerLogin.jsx';
import UserLogin from './ui/pages/UserLogin/UserLogin.jsx';
import Register from './ui/pages/register/register.jsx';
import Dashboard from './ui/pages/dashboard/dashboard.jsx';
import AdminDashboard from './ui/pages/AdminDashboard/AdminDashboard.jsx';
import ManagerDashboard from './ui/pages/Manager/ManagerDashboard/ManagerDashboard';
import UserDashboard from './ui/pages/UserDashboard/UserDashboard';
import './App.css';
import { ThemeProvider } from './context/ThemeContext';
import EditMyOrganization from "./ui/pages/Manager/EditMyOrganization/EditMyOrganization.jsx";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* LOGIN PAGES - NO THEME PROVIDER */}
                    <Route path="/" element={<PortalSelection />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/manager/login" element={<ManagerLogin />} />
                    <Route path="/user/login" element={<UserLogin />} />
                    <Route path="/login" element={<Navigate to="/" replace />} />
                    <Route path="/register" element={<Register />} />

                    {/* DASHBOARD PAGES - WITH THEME PROVIDER */}
                    <Route path="/*" element={
                        <ThemeProvider>
                            <Routes>
                                <Route
                                    path="/dashboard"
                                    element={
                                        <ProtectedRoute>
                                            <Dashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/dashboard"
                                    element={
                                        <ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}>
                                            <AdminDashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/manager/dashboard"
                                    element={
                                        <ProtectedRoute allowedRoles={['MANAGER']}>
                                            <ManagerDashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/manager/edit-organization"
                                    element={
                                        <ProtectedRoute allowedRoles={['MANAGER']}>
                                            <EditMyOrganization />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/user/dashboard"
                                    element={
                                        <ProtectedRoute allowedRoles={['USER']}>
                                            <UserDashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </ThemeProvider>
                    } />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;