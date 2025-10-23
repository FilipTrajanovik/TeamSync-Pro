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
    Paper,
    Fade,
    CircularProgress
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
    const [focusedField, setFocusedField] = useState('');

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

            // Success - Navigate after brief delay for visual feedback
            setTimeout(() => {
                navigate('/user/dashboard');
            }, 400);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
            setLoading(false);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleFocus = (fieldName) => {
        setFocusedField(fieldName);
    };

    const handleBlur = () => {
        setFocusedField('');
    };

    return (
        <Box className="user-portal-login-container">
            {/* Animated Background */}
            <div className="user-portal-bg">
                <div className="user-portal-grid"></div>
                <div className="user-portal-particles">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="user-portal-particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${5 + Math.random() * 10}s`
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            <Container maxWidth="sm" className="user-portal-content">
                <Fade in={true} timeout={800}>
                    <Paper className="user-portal-card" elevation={0}>
                        <div className="user-portal-glow"></div>

                        {/* Header */}
                        <Box className="user-portal-header">
                            <div className="user-portal-logo-container">
                                <Person className="user-portal-logo-icon" />
                                <div className="user-portal-logo-pulse"></div>
                            </div>
                            <Typography className="user-portal-title">
                                User Portal
                            </Typography>
                            <Typography className="user-portal-subtitle">
                                Access your personal dashboard
                            </Typography>
                        </Box>

                        {/* Error Alert */}
                        {error && (
                            <Fade in={true}>
                                <Alert
                                    severity="error"
                                    className="user-portal-error-alert"
                                    onClose={() => setError('')}
                                >
                                    {error}
                                </Alert>
                            </Fade>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="user-portal-form">
                            <Box className="user-portal-form-group">
                                <TextField
                                    name="username"
                                    label="Username"
                                    fullWidth
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('username')}
                                    onBlur={handleBlur}
                                    disabled={loading}
                                    className={`user-portal-input ${focusedField === 'username' ? 'user-portal-input-focused' : ''}`}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockPerson className="user-portal-input-icon" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            <Box className="user-portal-form-group">
                                <TextField
                                    name="password"
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    fullWidth
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('password')}
                                    onBlur={handleBlur}
                                    disabled={loading}
                                    className={`user-portal-input ${focusedField === 'password' ? 'user-portal-input-focused' : ''}`}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LoginIcon className="user-portal-input-icon" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleTogglePassword}
                                                    edge="end"
                                                    disabled={loading}
                                                    className="user-portal-visibility-toggle"
                                                    aria-label="toggle password visibility"
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
                                disabled={loading || !formData.username || !formData.password}
                                className="user-portal-button"
                            >
                                {loading ? (
                                    <>
                                        <CircularProgress
                                            size={20}
                                            className="user-portal-button-loader"
                                            sx={{ color: 'white', marginRight: '10px' }}
                                        />
                                        <span className="user-portal-button-text">Authenticating...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="user-portal-button-text">Sign In</span>
                                        <div className="user-portal-button-shimmer"></div>
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Footer */}
                        <Box className="user-portal-footer">
                            <Typography className="user-portal-footer-text">
                                Need help? Contact your system administrator
                            </Typography>
                        </Box>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
};

export default UserLogin;