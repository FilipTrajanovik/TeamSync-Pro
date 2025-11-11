import React, {useEffect} from 'react';
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
import Settings from './ui/pages/Settings/Settings.jsx';
import LandingPage from './ui/pages/LandingPage/LandingPage.jsx';

function App() {

    useEffect(() => {
        if(!localStorage.getItem("sessionId")){
            const sessionId = crypto.randomUUID()
            localStorage.setItem("sessionId", sessionId)
            console.log("New session created: ", sessionId);
        }else{
            console.log("Existing session: ", localStorage.getItem("sessionId"));
        }
    }, []);

    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* PUBLIC ROUTES - NO THEME PROVIDER, NO AUTH */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/portal" element={<PortalSelection />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/manager/login" element={<ManagerLogin />} />
                    <Route path="/user/login" element={<UserLogin />} />

                    {/* PROTECTED ROUTES - WITH THEME PROVIDER */}
                    <Route
                        path="/dashboard"
                        element={
                            <ThemeProvider>
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            </ThemeProvider>
                        }
                    />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ThemeProvider>
                                <ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            </ThemeProvider>
                        }
                    />
                    <Route
                        path="/manager/dashboard"
                        element={
                            <ThemeProvider>
                                <ProtectedRoute allowedRoles={['MANAGER']}>
                                    <ManagerDashboard />
                                </ProtectedRoute>
                            </ThemeProvider>
                        }
                    />
                    <Route
                        path="/manager/edit-organization"
                        element={
                            <ThemeProvider>
                                <ProtectedRoute allowedRoles={['MANAGER']}>
                                    <EditMyOrganization />
                                </ProtectedRoute>
                            </ThemeProvider>
                        }
                    />
                    <Route
                        path="/user/dashboard"
                        element={
                            <ThemeProvider>
                                <ProtectedRoute allowedRoles={['USER']}>
                                    <UserDashboard />
                                </ProtectedRoute>
                            </ThemeProvider>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <ThemeProvider>
                                <ProtectedRoute allowedRoles={['USER', 'MANAGER', 'ADMIN', 'OWNER']}>
                                    <Settings/>
                                </ProtectedRoute>
                            </ThemeProvider>
                        }
                    />


                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;