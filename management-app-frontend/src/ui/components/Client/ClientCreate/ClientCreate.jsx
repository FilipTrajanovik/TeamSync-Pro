import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Box,
    Button,
    Dialog,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import {
    Business as BusinessIcon,
    CalendarToday as CalendarIcon,
    Close as CloseIcon,
    Email as EmailIcon,
    Home as HomeIcon,
    Notes as NotesIcon,
    Person as PersonIcon,
    Phone as PhoneIcon
} from '@mui/icons-material';
import './ClientCreate.css';

const ClientCreate = ({open, onClose, onSubmit, client = null, organizations = [], isManagerView = false, defaultOrganizationId=null}) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        dateOfBirth: '',
        notes: '',
        organizationId: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (client) {
            console.log('=== EDIT CLIENT DEBUG ===');
            console.log('Full client object:', client);
            console.log('Phone:', client.phoneNumber);
            console.log('Birthday:', client.birthday);
            console.log('Organization:', client.organization);
            console.log('Organization ID:', client.organizationId);

            setFormData({
                firstName: client.firstName || '',
                lastName: client.lastName || '',
                email: client.email || '',
                phoneNumber: client.phoneNumber || '',
                address: client.address || '',
                dateOfBirth: client.birthday || '',
                notes: client.notes || '',
                organizationId: client.organizationId || ''
            });
        } else {

            if (isManagerView && defaultOrganizationId) {
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phoneNumber: '',
                    address: '',
                    dateOfBirth: '',
                    notes: '',
                    organizationId: defaultOrganizationId
                });
            }else {
                resetForm();
            }
        }
    }, [client, open, organizations, isManagerView, defaultOrganizationId]);

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            address: '',
            dateOfBirth: '',
            notes: '',
            organizationId: isManagerView && defaultOrganizationId ? defaultOrganizationId : ''
        });
        setErrors({});
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: ''}));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        // Check for both empty string and null/undefined
        if (!isManagerView && (!formData.organizationId || formData.organizationId === '')) {
            newErrors.organizationId = 'Organization is required';
        }

        // CRITICAL: For managers, ensure organizationId is set
        if (isManagerView && (!formData.organizationId || formData.organizationId === '')) {
            console.error('❌ Organization ID is missing for manager!');
            newErrors.organizationId = 'Organization ID is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('=== CLIENT SUBMIT DEBUG ===');
        console.log('Form Data:', formData);
        console.log('Organization ID:', formData.organizationId);
        console.log('Is Manager View:', isManagerView);
        console.log('Organizations:', organizations);

        if (validate()) {
            const clientData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                dateOfBirth: formData.dateOfBirth || null,
                notes: formData.notes || null,
                organizationId: formData.organizationId
            };

            console.log('Submitting client data:', clientData);
            onSubmit(clientData);
            handleClose();
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
                        <PersonIcon/>
                    </Avatar>
                    <Box>
                        <Typography className="header-title">
                            {client ? 'Edit Client' : 'New Client'}
                        </Typography>
                        <Typography className="header-subtitle">
                            {client ? 'Update client information' : 'Add a new client to your system'}
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={handleClose} className="close-button">
                    <CloseIcon/>
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
                                    <PersonIcon className="input-icon"/>
                                    <TextField
                                        name="firstName"
                                        label="First Name"
                                        fullWidth
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        error={!!errors.firstName}
                                        helperText={errors.firstName}
                                        className="apple-input"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box className="apple-input-group">
                                    <PersonIcon className="input-icon"/>
                                    <TextField
                                        name="lastName"
                                        label="Last Name"
                                        fullWidth
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        error={!!errors.lastName}
                                        helperText={errors.lastName}
                                        className="apple-input"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box className="apple-input-group">
                                    <CalendarIcon className="input-icon"/>
                                    <TextField
                                        name="dateOfBirth"
                                        label="Date of Birth"
                                        type="date"
                                        fullWidth
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        className="apple-input"
                                        variant="outlined"
                                        InputLabelProps={{shrink: true}}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Contact Information */}
                    <Box className="form-section">
                        <Typography className="section-title">Contact Information</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Box className="apple-input-group">
                                    <EmailIcon className="input-icon"/>
                                    <TextField
                                        name="email"
                                        label="Email Address"
                                        type="email"
                                        fullWidth
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        className="apple-input"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box className="apple-input-group">
                                    <PhoneIcon className="input-icon"/>
                                    <TextField
                                        name="phoneNumber"
                                        label="Phone Number"
                                        fullWidth
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className="apple-input"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box className="apple-input-group">
                                    <HomeIcon className="input-icon"/>
                                    <TextField
                                        name="address"
                                        label="Street Address"
                                        fullWidth
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="apple-input"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Organization & Notes */}
                    <Box className="form-section">
                        <Typography className="section-title">Organization & Notes</Typography>
                        <Grid container spacing={2}>
                            {!isManagerView && (
                                <Grid item xs={12}>
                                    <Box className="apple-input-group">
                                        <BusinessIcon className="input-icon"/>
                                        <FormControl fullWidth required error={!!errors.organizationId}>
                                            <InputLabel>Organization</InputLabel>
                                            <Select
                                                name="organizationId"
                                                value={formData.organizationId}
                                                onChange={handleChange}
                                                label="Organization"
                                                className="apple-select"
                                            >
                                                <MenuItem value="">
                                                    <em>Select Organization</em>
                                                </MenuItem>
                                                {organizations.map((org) => (

                                                    <MenuItem key={org.id} value={org.id}>
                                                        {org.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.organizationId && (
                                                <Typography color="error" variant="caption" sx={{mt: 0.5, ml: 2}}>
                                                    {errors.organizationId}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </Box>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Box className="apple-input-group">
                                    <NotesIcon className="input-icon"/>
                                    <TextField
                                        name="notes"
                                        label="Notes"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={formData.notes}
                                        onChange={handleChange}
                                        className="apple-input"
                                        variant="outlined"
                                        placeholder="Add any additional notes about this client..."
                                    />
                                </Box>
                            </Grid>
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
                    {client ? 'Update Client' : 'Add Client'}
                </Button>
            </Box>
        </Dialog>
    );
};

export default ClientCreate;