import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Alert, Box, Button, Container, IconButton, InputAdornment, Paper, TextField, Typography} from '@mui/material';
import {Business, LockPerson, Login as LoginIcon, Visibility, VisibilityOff} from '@mui/icons-material';
import {useAuth} from '../../../hooks/useAuth';
import './ManagerLogin.css';

const ManagerLogin = () => {
    const navigate = useNavigate();
    const {login} = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userData = await login(formData.username, formData.password);
            console.log('Login response:', userData);
            console.log('User role:', userData?.role);

            // Check if user is a manager
            if (userData.role !== 'MANAGER') {
                setError('Access denied. This portal is for managers only.');
                setLoading(false);
                return;
            }

            // Success - redirect to manager dashboard
            console.log('Redirecting to manager dashboard...');
            navigate('/manager/dashboard', {replace: true});
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
            setLoading(false);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box className="manager-login-container">
            {/* Animated Background */}
            <div className="login-bg">
                <div className="login-grid"></div>
                <div className="floating-particles">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${5 + Math.random() * 10}s`
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            <Container maxWidth="sm" className="login-content">
                <Paper className="login-card" elevation={0}>
                    <div className="card-glow"></div>

                    {/* Header */}
                    <Box className="login-header">
                        <div className="logo-container">
                            <Business className="logo-icon"/>
                            <div className="logo-pulse"></div>
                        </div>
                        <Typography className="login-title">
                            Manager Portal
                        </Typography>
                        <Typography className="login-subtitle">
                            Access your organization management dashboard
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {error && (
                        <Alert severity="error" className="error-alert" onClose={() => setError('')}>
                            {error}
                        </Alert>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="login-form">
                        <Box className="form-group">
                            <TextField
                                name="username"
                                label="Username"
                                fullWidth
                                required
                                value={formData.username}
                                onChange={handleChange}
                                className="cyber-input"
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockPerson className="input-icon"/>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box className="form-group">
                            <TextField
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="cyber-input"
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LoginIcon className="input-icon"/>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleTogglePassword}
                                                edge="end"
                                                className="visibility-toggle"
                                            >
                                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            disabled={loading}
                            className="cyber-login-button"
                            onClick={(e) => {
                                console.log('🔘 Button clicked!');
                                e.preventDefault();
                                handleSubmit(e);
                            }}
                        >
                             <span className="btn-text">
                                 {loading ? 'Authenticating...' : 'Sign In'}
                              </span>
                            <div className="btn-shimmer"></div>
                        </Button>
                    </form>

                    {/* Footer */}
                    <Box className="login-footer">
                        <Typography className="footer-text">
                            Need help? Contact your system administrator
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default ManagerLogin;