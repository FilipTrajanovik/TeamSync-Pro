import React, { useState, useEffect } from 'react';
import {
    Dialog,
    TextField,
    Grid,
    Box,
    Typography,
    IconButton,
    Button,
    Avatar,
    InputAdornment
} from '@mui/material';
import {
    Close as CloseIcon,
    Person as PersonIcon,
    Lock as LockIcon,
    AccountCircle as AccountCircleIcon,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import './UserCreate.css';

const UserCreate = ({ open, onClose, onSubmit, user = null }) => {
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        surname: '',
        password: '',
        repeatPassword: '',
        role: 'USER'
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    useEffect(() => {
        if (user) {
            console.log('Editing user:', user);
            setFormData({
                username: user.username || '',
                name: user.name || '',
                surname: user.surname || '',
                password: '',
                repeatPassword: '',
                role: user.role || 'USER'
            });
        } else {
            resetForm();
        }
    }, [user, open]);

    const resetForm = () => {
        setFormData({
            username: '',
            name: '',
            surname: '',
            password: '',
            repeatPassword: '',
            role: 'USER'
        });
        setErrors({});
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

        // Password validation only for new users or if password is being changed
        if (!user) {
            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            }

            if (formData.password !== formData.repeatPassword) {
                newErrors.repeatPassword = 'Passwords do not match';
            }
        } else if (formData.password) {
            // If editing and password is provided, validate it
            if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            }
            if (formData.password !== formData.repeatPassword) {
                newErrors.repeatPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const userData = {
                username: formData.username,
                name: formData.name,
                surname: formData.surname,
                password: formData.password,
                repeatPassword: formData.repeatPassword,
                role: formData.role
            };

            onSubmit(userData);
            handleClose();
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const roles = [
        { value: 'USER', label: 'User', icon: '👤', color: '#3b82f6' },
        { value: 'MANAGER', label: 'Manager', icon: '👨‍💼', color: '#f59e0b' },
        { value: 'ADMIN', label: 'Admin', icon: '👑', color: '#ef4444' }
    ];

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                className: 'apple-dialog'
            }}
        >
            {/* Header */}
            <Box className="apple-dialog-header">
                <Box className="header-content">
                    <Avatar className="header-avatar">
                        <PersonIcon />
                    </Avatar>
                    <Box>
                        <Typography className="header-title">
                            {user ? 'Edit User' : 'New User'}
                        </Typography>
                        <Typography className="header-subtitle">
                            {user ? 'Update user information' : 'Add a new user to your system'}
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={handleClose} className="close-button">
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Content */}
            <Box className="apple-dialog-content">
                <form onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <Box className="form-section">
                        <Typography className="section-title">Personal Information</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Box className="apple-input-group">
                                    <PersonIcon className="input-icon" />
                                    <TextField
                                        name="name"
                                        label="First Name"
                                        fullWidth
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        error={!!errors.name}
                                        helperText={errors.name}
                                        className="apple-input"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box className="apple-input-group">
                                    <PersonIcon className="input-icon" />
                                    <TextField
                                        name="surname"
                                        label="Last Name"
                                        fullWidth
                                        required
                                        value={formData.surname}
                                        onChange={handleChange}
                                        error={!!errors.surname}
                                        helperText={errors.surname}
                                        className="apple-input"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Account Information */}
                    <Box className="form-section">
                        <Typography className="section-title">Account Information</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box className="apple-input-group">
                                    <AccountCircleIcon className="input-icon" />
                                    <TextField
                                        name="username"
                                        label="Username"
                                        fullWidth
                                        required
                                        value={formData.username}
                                        onChange={handleChange}
                                        error={!!errors.username}
                                        helperText={errors.username || (user ? 'Username cannot be changed' : '')}
                                        className="apple-input"
                                        variant="outlined"
                                        disabled={!!user}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Security */}
                    <Box className="form-section">
                        <Typography className="section-title">
                            {user ? 'Change Password (Optional)' : 'Security'}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Box className="apple-input-group">
                                    <LockIcon className="input-icon" />
                                    <TextField
                                        name="password"
                                        label={user ? "New Password" : "Password"}
                                        type={showPassword ? 'text' : 'password'}
                                        fullWidth
                                        required={!user}
                                        value={formData.password}
                                        onChange={handleChange}
                                        error={!!errors.password}
                                        helperText={errors.password || (user ? 'Leave blank to keep current password' : '')}
                                        className="apple-input"
                                        variant="outlined"
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
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box className="apple-input-group">
                                    <LockIcon className="input-icon" />
                                    <TextField
                                        name="repeatPassword"
                                        label="Confirm Password"
                                        type={showRepeatPassword ? 'text' : 'password'}
                                        fullWidth
                                        required={!user || !!formData.password}
                                        value={formData.repeatPassword}
                                        onChange={handleChange}
                                        error={!!errors.repeatPassword}
                                        helperText={errors.repeatPassword}
                                        className="apple-input"
                                        variant="outlined"
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
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Role Selection */}
                    <Box className="form-section">
                        <Typography className="section-title">User Role</Typography>
                        <Grid container spacing={2}>
                            {roles.map((role) => (
                                <Grid item xs={12} md={4} key={role.value}>
                                    <Box
                                        className={`role-card ${formData.role === role.value ? 'selected' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
                                        sx={{
                                            borderColor: formData.role === role.value ? role.color : 'rgba(0,0,0,0.08)',
                                            '&:hover': {
                                                borderColor: role.color
                                            }
                                        }}
                                    >
                                        <Typography className="role-icon">{role.icon}</Typography>
                                        <Typography className="role-label">{role.label}</Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </form>
            </Box>

            {/* Footer */}
            <Box className="apple-dialog-footer">
                <Button onClick={handleClose} className="apple-button secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} className="apple-button primary">
                    {user ? 'Update User' : 'Add User'}
                </Button>
            </Box>
        </Dialog>
    );
};

export default UserCreate;