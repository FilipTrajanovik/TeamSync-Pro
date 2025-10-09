import React, {useEffect, useState} from 'react';
import {
    Dialog,
    TextField,
    Grid,
    Box,
    Typography,
    IconButton,
    Button,
    Avatar,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import {
    Close as CloseIcon,
    Storage as StorageIcon,
    Person as PersonIcon,
    Category as CategoryIcon,
    Code as CodeIcon
} from '@mui/icons-material';

import './RecordCreate.css';

const RecordCreate = ({open, onClose, onSubmit, record=null, clients = []}) => {

    const [formData, setFormData] = useState({
        clientId: '',
        profileType: '',
        jsonData: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if(record && open){
          setFormData({
              clientId: record.clientId || '',
              profileType: record.profileType || '',
              jsonData: record.jsonData || '',
          })
        }else if(!record && open){
            resetForm();
        }
    },[record?.id, open])

    const resetForm = () => {
        setFormData({
            clientId: '',
            profileType: '',
            jsonData: '',
        });
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }

    const validate = () => {
        const newErrors = {};
        if(!formData.clientId) newErrors.clientId = 'ClientId is required';
        if(!formData.jsonData.trim()) newErrors.jsonData = 'JsonData is required';
        if(!formData.profileType.trim()) newErrors.profileType = 'ProfileType is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e) => {
        console.log('🔍 FORM DATA BEFORE SUBMIT:', formData);
        e.preventDefault();
        if (validate()) {
            const recordData = {
                clientId: formData.clientId,
                profileType: formData.profileType,
                jsonData: formData.jsonData,
            }
            if (record) {
                recordData.id = record.id;
            }
            console.log('📤 SENDING RECORD DATA:', recordData);
            onSubmit(recordData);

        }
    }

    const handleClose = () => {
        resetForm();
        onClose();
    }

    const profileTypes = [
        'FitnessTracker', 'MedicalHistory', 'TransactionLog', 'UserPreferences', 'ActivityLog'
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
                        <StorageIcon />
                    </Avatar>
                    <Box>
                        <Typography className="header-title">
                            {record ? 'Edit Record' : 'New Record'}
                        </Typography>
                        <Typography className="header-subtitle">
                            {record ? 'Update client data record' : 'Add a new data record for a client'}
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
                    <Box className="form-section">
                        <Typography className="section-title">Record Details</Typography>
                        <Grid container spacing={2}>

                            {/* Client ID Selection */}
                            <Grid item xs={12} md={6}>
                                <Box className="apple-input-group">
                                    <PersonIcon className="input-icon" />
                                    <FormControl fullWidth required error={!!errors.clientId}>
                                        <InputLabel>Client</InputLabel>
                                        <Select
                                            name="clientId"
                                            value={formData.clientId}
                                            onChange={handleChange}
                                            label="Client"
                                            className="apple-select"
                                        >
                                            <MenuItem value="">
                                                <em>Select Client</em>
                                            </MenuItem>
                                            {clients.map((client) => (
                                                <MenuItem key={client.id} value={client.id}>
                                                    {client.firstName+ ' ' + client.lastName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.clientId && (
                                            <Typography color="error" variant="caption" sx={{ mt: 0.5, ml: 2 }}>
                                                {errors.clientId}
                                            </Typography>
                                        )}
                                    </FormControl>
                                </Box>
                            </Grid>

                            {/* Profile Type Selection */}
                            <Grid item xs={12} md={6}>
                                <Box className="apple-input-group">
                                    <CategoryIcon className="input-icon" />
                                    <FormControl fullWidth required error={!!errors.profileType}>
                                        <InputLabel>Profile Type</InputLabel>
                                        <Select
                                            name="profileType"
                                            value={formData.profileType}
                                            onChange={handleChange}
                                            label="Profile Type"
                                            className="apple-select"
                                        >
                                            <MenuItem value="">
                                                <em>Select Type</em>
                                            </MenuItem>
                                            {profileTypes.map((type) => (
                                                <MenuItem key={type} value={type}>
                                                    {type}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.profileType && (
                                            <Typography color="error" variant="caption" sx={{ mt: 0.5, ml: 2 }}>
                                                {errors.profileType}
                                            </Typography>
                                        )}
                                    </FormControl>
                                </Box>
                            </Grid>

                            {/* JSON Data Textarea */}
                            <Grid item xs={12}>
                                <Box className="apple-input-group">
                                    <CodeIcon className="input-icon" style={{ top: '24px', transform: 'none' }} />
                                    <TextField
                                        name="jsonData"
                                        label="JSON Data"
                                        fullWidth
                                        required
                                        multiline
                                        rows={10}
                                        value={formData.jsonData}
                                        onChange={handleChange}
                                        error={!!errors.jsonData}
                                        helperText={errors.jsonData || 'Enter the data in valid JSON format.'}
                                        className="apple-input"
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
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
                    {record ? 'Update Record' : 'Add Record'}
                </Button>
            </Box>
        </Dialog>
    );
};

export default RecordCreate;