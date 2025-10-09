import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    IconButton,
    InputAdornment,
    Alert,
    Paper
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Person,
    LockPerson,
    Login as LoginIcon
} from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';
import './UserLogin.css';

const UserLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login(formData.username, formData.password);

            if (response.role !== 'USER') {
                setError('Access denied. This portal is for users only.');
                setLoading(false);
                return;
            }

            navigate('/user/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
            setLoading(false);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box className="user-login-container">
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

                    <Box className="login-header">
                        <div className="logo-container">
                            <Person className="logo-icon" />
                            <div className="logo-pulse"></div>
                        </div>
                        <Typography className="login-title">
                            User Portal
                        </Typography>
                        <Typography className="login-subtitle">
                            Access your personal dashboard
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" className="error-alert" onClose={() => setError('')}>
                            {error}
                        </Alert>
                    )}

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
                                            <LockPerson className="input-icon" />
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
                                            <LoginIcon className="input-icon" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleTogglePassword}
                                                edge="end"
                                                className="visibility-toggle"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
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
                        >
                            <span className="btn-text">
                                {loading ? 'Authenticating...' : 'Sign In'}
                            </span>
                            <div className="btn-shimmer"></div>
                        </Button>
                    </form>

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

export default UserLogin;