import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
    Typography,
    Chip,
    Avatar,
    Autocomplete
} from '@mui/material';
import { Business, Close } from '@mui/icons-material';

const OrganizationForm = ({ open, onClose, onSubmit, organization, managers }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'HOSPITAL',
        contactEmail: '',
        contactPhone: '',
        address: '',
        managerId: null
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (organization) {
            setFormData({
                name: organization.name || '',
                description: organization.description || '',
                type: organization.type || 'HOSPITAL',
                contactEmail: organization.contactEmail || '',
                contactPhone: organization.contactPhone || '',
                address: organization.address || '',
                managerId: organization.managerId || null
            });
        } else {
            setFormData({
                name: '',
                description: '',
                type: 'HOSPITAL',
                contactEmail: '',
                contactPhone: '',
                address: '',
                managerId: null
            });
        }
        setErrors({});
    }, [organization, open]);

    const organizationTypes = [
        { value: 'HOSPITAL', label: 'Hospital', icon: '🏥' },
        { value: 'AUTO_REPAIR', label: 'Auto Repair', icon: '🔧' },
        { value: 'RESTAURANT', label: 'Restaurant', icon: '🍽️' },
        { value: 'RETAIL', label: 'Retail', icon: '🛒' },
        { value: 'OTHER', label: 'Other', icon: '🏢' }
    ];

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Organization name is required';
        }

        if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
            newErrors.contactEmail = 'Invalid email format';
        }

        if (formData.contactPhone && !/^\+?[\d\s-()]+$/.test(formData.contactPhone)) {
            newErrors.contactPhone = 'Invalid phone format';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            onSubmit(formData);
            handleClose();
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            description: '',
            type: 'HOSPITAL',
            contactEmail: '',
            contactPhone: '',
            address: '',
            managerId: null
        });
        setErrors({});
        onClose();
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
    };

    const selectedType = organizationTypes.find(t => t.value === formData.type);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
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
                        <Business />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            {organization ? 'Edit Organization' : 'Create New Organization'}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {organization ? 'Update organization details' : 'Add a new organization to the system'}
                        </Typography>
                    </Box>
                </Box>
                <Button
                    onClick={handleClose}
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        fullWidth
                        label="Organization Name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        required
                        placeholder="e.g., City General Hospital"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px'
                            }
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Description"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        multiline
                        rows={3}
                        placeholder="Brief description of the organization..."
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px'
                            }
                        }}
                    />

                    <TextField
                        select
                        fullWidth
                        label="Organization Type"
                        value={formData.type}
                        onChange={(e) => handleChange('type', e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px'
                            }
                        }}
                    >
                        {organizationTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <span style={{ fontSize: '20px' }}>{type.icon}</span>
                                    {type.label}
                                </Box>
                            </MenuItem>
                        ))}
                    </TextField>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: 2
                    }}>
                        <TextField
                            fullWidth
                            label="Contact Email"
                            type="email"
                            value={formData.contactEmail}
                            onChange={(e) => handleChange('contactEmail', e.target.value)}
                            error={!!errors.contactEmail}
                            helperText={errors.contactEmail}
                            placeholder="contact@organization.com"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px'
                                }
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Contact Phone"
                            value={formData.contactPhone}
                            onChange={(e) => handleChange('contactPhone', e.target.value)}
                            error={!!errors.contactPhone}
                            helperText={errors.contactPhone}
                            placeholder="+1 (555) 123-4567"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px'
                                }
                            }}
                        />
                    </Box>

                    <TextField
                        fullWidth
                        label="Address"
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        placeholder="123 Main Street, City, State ZIP"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px'
                            }
                        }}
                    />

                    <Autocomplete
                        options={managers || []}
                        getOptionLabel={(option) => `${option.name} ${option.surname} (@${option.username})`}
                        value={managers?.find(m => m.id === formData.managerId) || null}
                        onChange={(event, newValue) => {
                            handleChange('managerId', newValue?.id || null);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Assign Manager (Optional)"
                                placeholder="Search for a manager..."
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px'
                                    }
                                }}
                            />
                        )}
                        renderOption={(props, option) => (
                            <li {...props}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: '#667eea', width: 35, height: 35 }}>
                                        {option.name[0]}{option.surname[0]}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body1">
                                            {option.name} {option.surname}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            @{option.username}
                                        </Typography>
                                    </Box>
                                </Box>
                            </li>
                        )}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px'
                            }
                        }}
                    />

                    {selectedType && (
                        <Box
                            sx={{
                                p: 2,
                                bgcolor: '#f5f5f5',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Selected Type:
                            </Typography>
                            <Chip
                                label={selectedType.label}
                                icon={<span>{selectedType.icon}</span>}
                                color="primary"
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    fontWeight: 600
                                }}
                            />
                        </Box>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
                <Button
                    onClick={handleClose}
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
                    {organization ? 'Update Organization' : 'Create Organization'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrganizationForm;