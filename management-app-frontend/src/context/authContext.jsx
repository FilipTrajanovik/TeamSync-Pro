import React, { createContext, useState, useEffect } from 'react';
import userRepository from '../repository/userRepository';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount, check if user is already logged in
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser && storedUser !== 'undefined') {
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Error parsing user data:', e);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    // Login function
    const login = async (username, password) => {  // Changed parameter name
        try {
            const response = await userRepository.login({ username, password });  // Changed to username
            const { token, user } = response.data;
            console.log('Full API response:', response);
            console.log('Response data:', response.data);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setToken(token);
            setUser(user);

            return user;
        } catch (error) {
            console.error('Login failed:', error);
           throw error;
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            const response = await userRepository.register(userData);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Registration failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!token;
    };

    // Get user role
    const getUserRole = () => {
        return user?.role || null;
    };

    // Check if user has specific role
    const hasRole = (role) => {
        return user?.role === role;
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        getUserRole,
        hasRole
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;