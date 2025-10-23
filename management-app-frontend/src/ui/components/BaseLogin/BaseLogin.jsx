/**
 * BaseLoginForm Component
 *
 * A reusable login form component following SOLID principles:
 * - Single Responsibility: Handles only login UI logic
 * - Open/Closed: Open for extension (props), closed for modification
 * - Liskov Substitution: Can be used for any portal type
 * - Interface Segregation: Minimal required props
 * - Dependency Inversion: Depends on abstractions (props), not concrete implementations
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Container,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography,
    CircularProgress,
    Fade,
    Collapse
} from '@mui/material';
import {
    Login as LoginIcon,
    Visibility,
    VisibilityOff,
    CheckCircle
} from '@mui/icons-material';

const BaseLoginForm = ({
                           // Required Props
                           title,
                           subtitle,
                           icon: IconComponent,
                           onLogin,
                           redirectPath,
                           portalRole,

                           // Optional Props
                           className = 'manager-login-container',
                           gradientColors = { start: '#667eea', end: '#764ba2' },
                           minUsernameLength = 3,
                           minPasswordLength = 6,
                           usernameLabel = 'Username',
                           passwordLabel = 'Password',
                           submitButtonText = 'Sign In',
                           loadingText = 'Authenticating...',
                           successText = 'Success!',
                           footerText = 'Need help? Contact your system administrator',
                           usernameIcon = null,
                           showFooter = true,
                           particleCount = 30
                       }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [touched, setTouched] = useState({
        username: false,
        password: false
    });

    // Validation Logic
    const validateForm = () => {
        const errors = {};

        if (!formData.username.trim()) {
            errors.username = 'Username is required';
        } else if (formData.username.length < minUsernameLength) {
            errors.username = `Username must be at least ${minUsernameLength} characters`;
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < minPasswordLength) {
            errors.password = `Password must be at least ${minPasswordLength} characters`;
        }

        return errors;
    };

    const formErrors = validateForm();
    const isValid = Object.keys(formErrors).length === 0;

    // Event Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mark all fields as touched
        setTouched({ username: true, password: true });

        // Validate
        if (!isValid) {
            setError('Please fill in all fields correctly');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const userData = await onLogin(formData.username, formData.password);

            // Check portal role if specified
            if (portalRole && userData.role !== portalRole) {
                setError(`Access denied. This portal is for ${portalRole.toLowerCase()}s only.`);
                setLoading(false);
                return;
            }

            // Success animation
            setSuccess(true);

            // Wait for success animation then redirect
            setTimeout(() => {
                navigate(redirectPath, { replace: true });
            }, 800);

        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
            setLoading(false);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const getFieldError = (field) => {
        return touched[field] && formErrors[field];
    };

    const UsernameIcon = usernameIcon || LoginIcon;

    return (
        <Box className={className}>
            {/* Animated Background */}
            <div className="login-bg">
                <div className="login-grid"></div>
                <div className="floating-particles">
                    {[...Array(particleCount)].map((_, i) => (
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
                <Fade in={true} timeout={600}>
                    <Paper className="login-card" elevation={0}>
                        <div className="card-glow"></div>

                        {/* Header */}
                        <Box className="login-header">
                            <div className="logo-container">
                                <IconComponent className="logo-icon" />
                                <div className="logo-pulse"></div>
                            </div>
                            <Typography className="login-title">
                                {title}
                            </Typography>
                            <Typography className="login-subtitle">
                                {subtitle}
                            </Typography>
                        </Box>

                        {/* Error Alert */}
                        <Collapse in={!!error}>
                            <Alert
                                severity="error"
                                className="error-alert"
                                onClose={() => setError('')}
                            >
                                {error}
                            </Alert>
                        </Collapse>

                        {/* Success Alert */}
                        <Collapse in={success}>
                            <Alert
                                severity="success"
                                className="success-alert"
                                icon={<CheckCircle />}
                            >
                                {successText}
                            </Alert>
                        </Collapse>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="login-form">
                            <Box className="form-group">
                                <TextField
                                    name="username"
                                    label={usernameLabel}
                                    fullWidth
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('username')}
                                    error={!!getFieldError('username')}
                                    helperText={getFieldError('username')}
                                    disabled={loading || success}
                                    className="cyber-input"
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <UsernameIcon className="input-icon" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            <Box className="form-group">
                                <TextField
                                    name="password"
                                    label={passwordLabel}
                                    type={showPassword ? 'text' : 'password'}
                                    fullWidth
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('password')}
                                    error={!!getFieldError('password')}
                                    helperText={getFieldError('password')}
                                    disabled={loading || success}
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
                                                    disabled={loading || success}
                                                    tabIndex={-1}
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
                                disabled={loading || success}
                                className={`cyber-login-button ${success ? 'success' : ''}`}
                            >
                                {success ? (
                                    <>
                                        <CheckCircle className="success-icon" />
                                        <span className="btn-text">{successText}</span>
                                    </>
                                ) : loading ? (
                                    <>
                                        <CircularProgress size={20} className="loading-spinner" />
                                        <span className="btn-text">{loadingText}</span>
                                    </>
                                ) : (
                                    <span className="btn-text">{submitButtonText}</span>
                                )}
                                <div className="btn-shimmer"></div>
                            </Button>
                        </form>

                        {/* Footer */}
                        {showFooter && (
                            <Box className="login-footer">
                                <Typography className="footer-text">
                                    {footerText}
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
};

export default BaseLoginForm;