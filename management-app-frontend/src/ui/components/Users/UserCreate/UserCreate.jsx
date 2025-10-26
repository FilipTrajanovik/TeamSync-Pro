import React, { useState, useEffect } from 'react';
import {
    Dialog,
    TextField,
    Box,
    Typography,
    IconButton,
    Button,
    Avatar,
    InputAdornment,
    DialogContent,
    CircularProgress
} from '@mui/material';
import {
    Close,
    Person,
    Lock,
    AccountCircle,
    Visibility,
    VisibilityOff,
    PersonAdd,
    Info,
    Error as ErrorIcon
} from '@mui/icons-material';
import './UserCreate.css';

const UserCreate = ({ open, onClose, onSubmit, user = null, isManagerView = false, defaultOrganizationId = null }) => {
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        surname: '',
        password: '',
        repeatPassword: '',
        role: 'USER',
        organizationId: ''
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            console.log('Editing user:', user);
            setFormData({
                username: user.username || '',
                name: user.name || '',
                surname: user.surname || '',
                password: '',
                repeatPassword: '',
                role: user.role || 'USER',
                organizationId: user.organizationId || ''
            });
        } else {
            if (isManagerView && defaultOrganizationId) {
                setFormData({
                    username: '',
                    name: '',
                    surname: '',
                    password: '',
                    repeatPassword: '',
                    role: 'USER',
                    organizationId: defaultOrganizationId
                });
            } else {
                resetForm();
            }
        }
    }, [user, open, isManagerView, defaultOrganizationId]);

    const resetForm = () => {
        setFormData({
            username: '',
            name: '',
            surname: '',
            password: '',
            repeatPassword: '',
            role: 'USER',
            organizationId: isManagerView && defaultOrganizationId ? defaultOrganizationId : ''
        });
        setErrors({});
        setShowPassword(false);
        setShowRepeatPassword(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.username.trim()) newErrors.username = 'Username is required';
        if (!formData.name.trim()) newErrors.name = 'First name is required';
        if (!formData.surname.trim()) newErrors.surname = 'Last name is required';

        // Password validation only for new users
        if (!user) {
            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            }

            if (!formData.repeatPassword) {
                newErrors.repeatPassword = 'Please confirm your password';
            } else if (formData.password !== formData.repeatPassword) {
                newErrors.repeatPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('=== USER SUBMIT DEBUG ===');
        console.log('Form Data:', formData);
        console.log('Organization ID:', formData.organizationId);
        console.log('Is Manager View:', isManagerView);

        if (validate()) {
            setLoading(true);
            try {
                const userData = {
                    username: formData.username,
                    name: formData.name,
                    surname: formData.surname,
                    password: formData.password,
                    repeatPassword: formData.repeatPassword,
                    role: formData.role,
                    organizationId: formData.organizationId,
                };

                await onSubmit(userData);
                handleClose();
            } catch (error) {
                console.error('Error submitting user:', error);
                setErrors({ submit: 'Failed to save user. Please try again.' });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                className: 'user-create-dialog'
            }}
        >
            {/* Header */}
            <Box className="user-create-header">
                <Box className="user-create-header-content">
                    <Avatar className="user-create-header-avatar">
                        <PersonAdd />
                    </Avatar>
                    <Box className="user-create-header-text">
                        <Typography className="user-create-header-title">
                            {user ? 'Edit Team Member' : 'Add Team Member'}
                        </Typography>
                        <Typography className="user-create-header-subtitle">
                            {user ? 'Update member information' : 'Add a new member to your team'}
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    onClick={handleClose}
                    className="user-create-close-button"
                >
                    <Close />
                </IconButton>
            </Box>

            {/* Content */}
            <DialogContent className="user-create-content">
                <form onSubmit={handleSubmit}>
                    {/* Role Info Banner */}
                    {isManagerView && (
                        <Box className="user-create-role-banner">
                            <Info className="user-create-role-banner-icon" />
                            <Box className="user-create-role-banner-text">
                                <Typography className="user-create-role-banner-title">
                                    User Role
                                </Typography>
                                <Typography className="user-create-role-banner-subtitle">
                                    New team members will be added with User role automatically
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {/* Error Message */}
                    {errors.submit && (
                        <Box className="user-create-error">
                            <ErrorIcon className="user-create-error-icon" />
                            <Typography className="user-create-error-text">
                                {errors.submit}
                            </Typography>
                        </Box>
                    )}

                    {/* Account Information Section */}
                    <Box className="user-create-form-section">
                        <Typography className="user-create-section-title">
                            Account Information
                        </Typography>

                        {/* Username */}
                        <Box className="user-create-input-group">
                            <Person className="user-create-input-icon" />
                            <TextField
                                fullWidth
                                name="username"
                                label="Username"
                                value={formData.username}
                                onChange={handleChange}
                                error={!!errors.username}
                                helperText={errors.username}
                                disabled={!!user}
                                className="user-create-input"
                                placeholder="john_doe"
                            />
                        </Box>

                        {/* Password - Only for new users */}
                        {!user && (
                            <>
                                <Box className="user-create-input-group">
                                    <Lock className="user-create-input-icon" />
                                    <TextField
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        error={!!errors.password}
                                        helperText={errors.password}
                                        className="user-create-input"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                        placeholder="••••••••"
                                    />
                                </Box>

                                <Box className="user-create-input-group">
                                    <Lock className="user-create-input-icon" />
                                    <TextField
                                        fullWidth
                                        name="repeatPassword"
                                        label="Confirm Password"
                                        type={showRepeatPassword ? 'text' : 'password'}
                                        value={formData.repeatPassword}
                                        onChange={handleChange}
                                        error={!!errors.repeatPassword}
                                        helperText={errors.repeatPassword}
                                        className="user-create-input"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                                        edge="end"
                                                    >
                                                        {showRepeatPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                        placeholder="••••••••"
                                    />
                                </Box>
                            </>
                        )}
                    </Box>

                    {/* Personal Information Section */}
                    <Box className="user-create-form-section">
                        <Typography className="user-create-section-title">
                            Personal Information
                        </Typography>

                        {/* First Name */}
                        <Box className="user-create-input-group">
                            <AccountCircle className="user-create-input-icon" />
                            <TextField
                                fullWidth
                                name="name"
                                label="First Name"
                                value={formData.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                className="user-create-input"
                                placeholder="John"
                            />
                        </Box>

                        {/* Last Name */}
                        <Box className="user-create-input-group">
                            <AccountCircle className="user-create-input-icon" />
                            <TextField
                                fullWidth
                                name="surname"
                                label="Last Name"
                                value={formData.surname}
                                onChange={handleChange}
                                error={!!errors.surname}
                                helperText={errors.surname}
                                className="user-create-input"
                                placeholder="Doe"
                            />
                        </Box>
                    </Box>

                    {/* Footer - INSIDE FORM */}
                    <Box className="user-create-footer">
                        <Button
                            type="button"
                            onClick={handleClose}
                            className="user-create-button user-create-button-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="user-create-button user-create-button-primary"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {loading ? 'Saving...' : user ? 'Update Member' : 'Add Member'}
                        </Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UserCreate;