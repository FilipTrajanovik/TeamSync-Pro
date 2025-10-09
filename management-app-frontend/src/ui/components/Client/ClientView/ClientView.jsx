import React, {useEffect} from 'react';
import {
    Dialog,
    Box,
    Typography,
    IconButton,
    Button,
    Avatar,
    Chip
} from '@mui/material';
import {
    Close as CloseIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Home as HomeIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import './ClientView.css';

const ClientView = ({ open, onClose, client, onEdit }) => {
    if (!client) return null;



    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                className: 'apple-view-dialog'
            }}
        >
            {/* Header */}
            <Box className="apple-view-header">
                <IconButton onClick={onClose} className="close-button">
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Content */}
            <Box className="apple-view-content">
                <Avatar className="client-avatar">
                    {client.firstName?.charAt(0)}{client.lastName?.charAt(0)}
                </Avatar>

                <Typography className="client-name">
                    {client.firstName} {client.lastName}
                </Typography>

                <Chip label="Client" className="client-badge" />

                {/* Information Cards */}
                <Box className="info-cards">
                    {/* Contact Information */}
                    <Box className="info-card">
                        <Box className="info-card-header">
                            <EmailIcon className="card-icon" />
                            <Typography className="card-label">Email</Typography>
                        </Box>
                        <Typography className="card-value">
                            {client.email || 'Not provided'}
                        </Typography>
                    </Box>

                    {client.phoneNumber && (
                        <Box className="info-card">
                            <Box className="info-card-header">
                                <PhoneIcon className="card-icon" />
                                <Typography className="card-label">Phone</Typography>
                            </Box>
                            <Typography className="card-value">
                                {client.phoneNumber}
                            </Typography>
                        </Box>
                    )}

                    {(client.address || client.city || client.country) && (
                        <Box className="info-card">
                            <Box className="info-card-header">
                                <HomeIcon className="card-icon" />
                                <Typography className="card-label">Location</Typography>
                            </Box>
                            <Typography className="card-value">
                                {client.address && <>{client.address}<br /></>}
                                {client.city && client.country ? `${client.city}, ${client.country}` : client.city || client.country}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Footer */}
            <Box className="apple-view-footer">
                <Button
                    onClick={() => {
                        onEdit(client);
                        onClose();
                    }}
                    className="apple-button primary"
                    startIcon={<EditIcon />}
                    fullWidth
                >
                    Edit Client
                </Button>
            </Box>
        </Dialog>
    );
};

export default ClientView;