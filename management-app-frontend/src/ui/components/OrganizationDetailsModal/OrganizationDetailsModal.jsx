import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Divider,
    Chip,
    Avatar,
    Grid
} from '@mui/material';
import {
    Business,
    Email,
    Phone,
    LocationOn,
    Person,
    Close
} from '@mui/icons-material';

const OrganizationDetailsModal = ({ open, onClose, organization }) => {
    if (!organization) return null;

    const getTypeIcon = (type) => {
        switch (type) {
            case 'HOSPITAL': return '🏥';
            case 'AUTO_REPAIR': return '🔧';
            case 'RESTAURANT': return '🍽️';
            case 'RETAIL': return '🛒';
            default: return '🏢';
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
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
                    <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', width: 50, height: 50 }}>
                        <span style={{ fontSize: '24px' }}>{getTypeIcon(organization.type)}</span>
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            {organization.name}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Organization Details
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

            <DialogContent sx={{ pt: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                                Organization Type
                            </Typography>
                            <Chip
                                label={organization.type}
                                icon={<span>{getTypeIcon(organization.type)}</span>}
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    fontWeight: 600
                                }}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                            Description
                        </Typography>
                        <Typography variant="body1">
                            {organization.description || 'No description provided'}
                        </Typography>
                    </Grid>

                    {organization.contactEmail && (
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email color="action" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Email
                                    </Typography>
                                    <Typography variant="body2">
                                        {organization.contactEmail}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    )}

                    {organization.contactPhone && (
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Phone color="action" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Phone
                                    </Typography>
                                    <Typography variant="body2">
                                        {organization.contactPhone}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    )}

                    {organization.address && (
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                                <LocationOn color="action" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Address
                                    </Typography>
                                    <Typography variant="body2">
                                        {organization.address}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    )}

                    {organization.manager && (
                        <>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: '#667eea' }}>
                                        <Person />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Assigned Manager
                                        </Typography>
                                        <Typography variant="body1" fontWeight="600">
                                            {organization.manager.name} {organization.manager.surname}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            @{organization.manager.username}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </>
                    )}
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '10px',
                        textTransform: 'none',
                        px: 3
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrganizationDetailsModal;