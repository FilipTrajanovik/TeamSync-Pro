import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Avatar,
    Alert
} from '@mui/material';
import { PersonAdd, Close } from '@mui/icons-material';

const CreateManagerForm = ({ open, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        surname: ''
    });

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        if (!open) {
            setFormData({
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                name: '',
                surname: ''
            });
            setErrors({});
            setSubmitError('');
        }
    }, [open]);

    const validate = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.name.trim()) {
            newErrors.name = 'First name is required';
        }

        if (!formData.surname.trim()) {
            newErrors.surname = 'Last name is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validate()) {
            try {
                await onSubmit({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    repeatPassword: formData.confirmPassword,
                    name: formData.name,
                    surname: formData.surname,
                    role: 'MANAGER'
                });
                onClose();
            } catch (error) {
                setSubmitError(error.response?.data?.message || 'Failed to create manager');
            }
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
        setSubmitError('');
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                }
            }}
        >
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pb: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                        <PersonAdd />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            Create Manager Account
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Add a new manager to the system
                        </Typography>
                    </Box>
                </Box>
                <Button
                    onClick={onClose}
                    sx={{
                        color: 'white',
                        minWidth: 'auto',
                        p: 1
                    }}
                >
                    <Close />
                </Button>
            </DialogTitle>

            <DialogContent sx={{ pt: 3, pb: 2 }}>
                {submitError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {submitError}
                    </Alert>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                        fullWidth
                        label="Username"
                        value={formData.username}
                        onChange={(e) => handleChange('username', e.target.value)}
                        error={!!errors.username}
                        helperText={errors.username}
                        required
                        placeholder="manager123"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />

                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="First Name"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
                            required
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                        />

                        <TextField
                            fullWidth
                            label="Last Name"
                            value={formData.surname}
                            onChange={(e) => handleChange('surname', e.target.value)}
                            error={!!errors.surname}
                            helperText={errors.surname}
                            required
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                        />
                    </Box>

                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                        placeholder="manager@example.com"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        required
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />

                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        required
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        borderRadius: '10px',
                        textTransform: 'none',
                        px: 3
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '10px',
                        textTransform: 'none',
                        px: 3,
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                        '&:hover': {
                            boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
                        }
                    }}
                >
                    Create Manager
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateManagerForm;