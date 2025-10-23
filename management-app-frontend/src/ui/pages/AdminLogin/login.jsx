import React, {useEffect, useState} from 'react';
import { useAuth } from '../../../hooks/useAuth.js';
import { useNavigate, Link } from 'react-router-dom';
import './AdminLogin.css';

const Login = () => {



    const [username, setUsername] = useState('');  // Changed from email
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('=== ADMIN LOGIN DEBUG ===');
            console.log('1. Starting login with:', { username, password });

            const userData = await login(username, password);
            console.log('2. Login result:', userData);
            console.log('3. User role:', userData?.role);

            // Check if user is admin
            if (userData.role !== 'ADMIN' && userData.role !== 'OWNER') {
                setError('Access denied. This portal is for administrators only.');
                setLoading(false);
                return;
            }

            console.log('4. Admin verified, checking localStorage...');
            console.log('   Token:', localStorage.getItem('token'));
            console.log('   User:', localStorage.getItem('user'));
            console.log('5. Redirecting to /admin/dashboard');

            navigate('/admin/dashboard', { replace: true });
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>  {/* Changed label */}
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="register-link">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;