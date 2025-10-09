import React from 'react';
import {
    Dialog,
    Box,
    Typography,
    IconButton,
    Button,
    Avatar
} from '@mui/material';
import {
    Close as CloseIcon,
    Warning as WarningIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import './ClientDelete.css';

const ClientDelete = ({ open, onClose, onConfirm, client }) => {
    if (!client) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                className: 'apple-delete-dialog'
            }}
        >
            {/* Header */}
            <Box className="apple-delete-header">
                <IconButton onClick={onClose} className="close-button">
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Content */}
            <Box className="apple-delete-content">
                <Avatar className="warning-avatar">
                    <WarningIcon />
                </Avatar>

                <Typography className="delete-title">
                    Delete Client?
                </Typography>

                <Typography className="delete-message">
                    Are you sure you want to delete <strong>{client.firstName} {client.lastName}</strong>? This action cannot be undone.
                </Typography>

                <Box className="client-info-box">
                    <Typography className="info-label">Client Details</Typography>
                    <Typography className="info-text">
                        {client.firstName} {client.lastName}
                    </Typography>
                    <Typography className="info-subtext">
                        {client.email}
                    </Typography>
                </Box>
            </Box>

            {/* Footer */}
            <Box className="apple-delete-footer">
                <Button onClick={onClose} className="apple-button secondary">
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        onConfirm(client.id);
                        onClose();
                    }}
                    className="apple-button danger"
                    startIcon={<DeleteIcon />}
                >
                    Delete Client
                </Button>
            </Box>
        </Dialog>
    );
};

export default ClientDelete;