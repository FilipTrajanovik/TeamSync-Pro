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
import './UserDelete.css';

const UserDelete = ({ open, onClose, onConfirm, user }) => {
    if (!user) return null;

    const getRoleColor = (role) => {
        const colors = {
            USER: '#3b82f6',
            MANAGER: '#f59e0b',
            ADMIN: '#ef4444',
            OWNER: '#8b5cf6'
        };
        return colors[role] || '#3b82f6';
    };

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
            <Box className="apple-delete-header">
                <IconButton onClick={onClose} className="close-button">
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box className="apple-delete-content">
                <Avatar className="warning-avatar">
                    <WarningIcon />
                </Avatar>

                <Typography className="delete-title">
                    Delete User?
                </Typography>

                <Typography className="delete-message">
                    Are you sure you want to delete <strong>{user.name} {user.surname}</strong>? This action cannot be undone.
                </Typography>

                <Box className="user-info-box">
                    <Typography className="info-label">User Details</Typography>
                    <Typography className="info-text">
                        {user.name} {user.surname}
                    </Typography>
                    <Typography className="info-subtext">
                        @{user.username}
                    </Typography>
                    <Box
                        className="info-role-badge"
                        sx={{
                            background: `${getRoleColor(user.role)}20`,
                            color: getRoleColor(user.role),
                            border: `1px solid ${getRoleColor(user.role)}`
                        }}
                    >
                        {user.role}
                    </Box>
                </Box>

                <Box className="warning-box">
                    <Typography className="warning-text">
                        ⚠️ All data associated with this user will be permanently deleted.
                    </Typography>
                </Box>
            </Box>

            <Box className="apple-delete-footer">
                <Button onClick={onClose} className="apple-button secondary">
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        onConfirm(user.username);
                        onClose();
                    }}
                    className="apple-button danger"
                    startIcon={<DeleteIcon />}
                >
                    Delete User
                </Button>
            </Box>
        </Dialog>
    );
};

export default UserDelete;