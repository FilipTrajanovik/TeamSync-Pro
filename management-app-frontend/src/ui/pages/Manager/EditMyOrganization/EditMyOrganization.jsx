import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
    Avatar,
    Chip,
    Divider,
    Grid,
    Card,
    CardContent,
    Fade
} from '@mui/material';
import {
    Business,
    ArrowBack,
    Save,
    Email,
    Phone,
    LocationOn,
    Category,
    CheckCircle,
    Info
} from '@mui/icons-material';
import useMyOrganizations from '../../../../hooks/useMyOrganizations';
import organizationRepository from '../../../../repository/organizationRepository';
import './EditMyOrganization.css';

const EditMyOrganization = () => {
    const navigate = useNavigate();
    const { organizations, loading: loadingOrg } = useMyOrganizations();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        contactPhone: '',
        address: ''
    });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [hasChanges, setHasChanges] = useState(false);
    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

    const organization = organizations && organizations.length > 0 ? organizations[0] : null;

    useEffect(() => {
        console.log('🔍 EditMyOrganization - Loading:', loadingOrg);
        console.log('🔍 EditMyOrganization - Organizations:', organizations);
    }, [loadingOrg, organizations]);


    useEffect(() => {
        if (organization) {
            setFormData({
                name: organization.name || '',
                description: organization.description || '',
                contactPhone: organization.contactPhone || '',
                address: organization.address || ''
            });
        }
    }, [organization]);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Organization name is required';
        }
        if (formData.contactPhone && !/^\+?[\d\s\-()]+$/.test(formData.contactPhone)) {
            newErrors.contactPhone = 'Invalid phone format';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            setSnackbar({ open: true, message: 'Please fix the errors before saving', severity: 'error' });
            return;
        }

        if (!organization) {
            setSnackbar({ open: true, message: 'Organization not found', severity: 'error' });
            return;
        }

        setSaving(true);
        try {
            const updateDto = {
                name: formData.name,
                description: formData.description,
                organizationType: organization.organizationType,
                contactEmail: organization.contactEmail,
                contactPhone: formData.contactPhone,
                address: formData.address
            };

            await organizationRepository.edit(organization.id, updateDto);

            setShowSuccessOverlay(true);
            setHasChanges(false);

            setTimeout(() => {
                setShowSuccessOverlay(false);
                navigate('/manager/dashboard');
            }, 2000);

        } catch (error) {
            console.error('Update error:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to update organization',
                severity: 'error'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (hasChanges) {
            if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
                navigate('/manager/dashboard');
            }
        } else {
            navigate('/manager/dashboard');
        }
    };

    if (loadingOrg) {
        return (
            <Box className="edit-org-loading">
                <Box className="loading-content">
                    <CircularProgress size={60} thickness={4} className="loading-spinner" />
                    <Typography variant="h6" className="loading-text">
                        Loading your organization...
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (!organization) {
        return (
            <Container maxWidth="md" sx={{ mt: 8 }}>
                <Alert severity="error">No organization found. Please contact your administrator.</Alert>
                <Button onClick={() => navigate('/manager/dashboard')} sx={{ mt: 2 }}>
                    Go Back to Dashboard
                </Button>
            </Container>
        );
    }

    const organizationTypeIcons = {
        HOSPITAL: '🏥',
        AUTO_REPAIR: '🔧',
        RESTAURANT: '🍽️',
        RETAIL: '🛒',
        OTHER: '🏢'
    };

    const organizationTypeLabels = {
        HOSPITAL: 'Hospital',
        AUTO_REPAIR: 'Auto Repair',
        RESTAURANT: 'Restaurant',
        RETAIL: 'Retail',
        OTHER: 'Other'
    };

    return (
        <>
            <Box className="edit-org-container">
                <Container maxWidth="lg" className="edit-org-content">
                    <Fade in timeout={800}>
                        <Box className="edit-org-header">
                            <Button startIcon={<ArrowBack />} onClick={handleCancel} className="back-button">
                                Back to Dashboard
                            </Button>

                            <Box className="header-content">
                                <Box className="header-icon-wrapper">
                                    <Avatar className="header-icon">
                                        <Business sx={{ fontSize: '2.5rem' }} />
                                    </Avatar>
                                    <div className="icon-pulse"></div>
                                </Box>
                                <Box>
                                    <Typography variant="h3" className="header-title">
                                        Organization Settings
                                    </Typography>
                                    <Typography variant="h6" className="header-subtitle">
                                        Manage your organization's information
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Fade>


                            <Fade in timeout={700}>
                                <Paper className="edit-form-paper">
                                    <Box className="form-header">
                                        <Typography variant="h5" className="form-title">
                                            Editable Information
                                        </Typography>
                                        <Chip label="Manager Access" icon={<Info />} className="access-chip" />
                                    </Box>

                                    <Box component="form" onSubmit={handleSubmit} className="edit-form">
                                        <Box className="form-fields">
                                            <Box className="form-field">
                                                <Typography variant="subtitle2" className="field-label">
                                                    Organization Name *
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    value={formData.name}
                                                    onChange={(e) => handleChange('name', e.target.value)}
                                                    error={!!errors.name}
                                                    helperText={errors.name}
                                                    placeholder="e.g., City General Hospital"
                                                    className="custom-textfield"
                                                />
                                            </Box>

                                            <Box className="form-field">
                                                <Typography variant="subtitle2" className="field-label">
                                                    Description
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    value={formData.description}
                                                    onChange={(e) => handleChange('description', e.target.value)}
                                                    multiline
                                                    rows={4}
                                                    placeholder="Brief description of your organization..."
                                                    className="custom-textfield"
                                                />
                                            </Box>

                                            <Box className="form-field">
                                                <Typography variant="subtitle2" className="field-label">
                                                    Contact Phone
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    value={formData.contactPhone}
                                                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                                                    error={!!errors.contactPhone}
                                                    helperText={errors.contactPhone || 'Format: +1 (555) 123-4567'}
                                                    placeholder="+1 (555) 123-4567"
                                                    InputProps={{
                                                        startAdornment: <Phone className="input-icon" />
                                                    }}
                                                    className="custom-textfield"
                                                />
                                            </Box>

                                            <Box className="form-field">
                                                <Typography variant="subtitle2" className="field-label">
                                                    Address
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    value={formData.address}
                                                    onChange={(e) => handleChange('address', e.target.value)}
                                                    placeholder="123 Main Street, City, State ZIP"
                                                    multiline
                                                    rows={2}
                                                    InputProps={{
                                                        startAdornment: <LocationOn className="input-icon input-icon-top" />
                                                    }}
                                                    className="custom-textfield"
                                                />
                                            </Box>
                                        </Box>

                                        <Divider sx={{ my: 3 }} />

                                        <Box className="form-actions">
                                            {!hasChanges && (
                                                <Alert severity="info" className="no-changes-alert">
                                                    No changes detected. Modify the form to enable saving.
                                                </Alert>
                                            )}

                                            <Box className="action-buttons">
                                                <Button
                                                    variant="outlined"
                                                    onClick={handleCancel}
                                                    disabled={saving}
                                                    className="cancel-button"
                                                    size="large"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    disabled={saving || !hasChanges}
                                                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                                    className="save-button"
                                                    size="large"
                                                >
                                                    {saving ? 'Saving Changes...' : 'Save Changes'}
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Fade>


                        <Grid item xs={12} md={4}>
                            <Fade in timeout={800}>
                                <Box className="sidebar-stack">
                                    <Paper className="sidebar-paper">
                                        <Box className="sidebar-header">
                                            <Category className="sidebar-icon" />
                                            <Typography variant="h6" className="sidebar-title">
                                                Organization Details
                                            </Typography>
                                        </Box>

                                        <Box className="sidebar-content">
                                            <Card className="info-card">
                                                <CardContent>
                                                    <Typography variant="caption" className="info-label">
                                                        TYPE
                                                    </Typography>
                                                    <Box className="info-value-wrapper">
                                                        <span className="type-icon">
                                                            {organizationTypeIcons[organization.organizationType]}
                                                        </span>
                                                        <Typography variant="h6" className="info-value">
                                                            {organizationTypeLabels[organization.organizationType]}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>

                                            <Card className="info-card">
                                                <CardContent>
                                                    <Typography variant="caption" className="info-label">
                                                        <Email sx={{ fontSize: 14, mr: 0.5 }} />
                                                        EMAIL
                                                    </Typography>
                                                    <Typography variant="body1" className="info-value">
                                                        {organization.contactEmail || 'Not provided'}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Box>
                                    </Paper>

                                    <Paper className="info-note-paper">
                                        <CheckCircle className="info-note-icon" />
                                        <Box>
                                            <Typography variant="subtitle2" className="info-note-title">
                                                Administrator Rights
                                            </Typography>
                                            <Typography variant="body2" className="info-note-text">
                                                Organization type and email can only be changed by an administrator for security purposes.
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Box>
                            </Fade>
                        </Grid>

                </Container>
            </Box>

            {showSuccessOverlay && (
                <Box className="success-overlay">
                    <Box className="success-content">
                        <CheckCircle className="success-icon" />
                        <Typography variant="h4" className="success-text">
                            Changes Saved Successfully!
                        </Typography>
                        <Typography variant="body1" className="success-subtext">
                            Redirecting to dashboard...
                        </Typography>
                    </Box>
                </Box>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    className="custom-alert"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default EditMyOrganization;