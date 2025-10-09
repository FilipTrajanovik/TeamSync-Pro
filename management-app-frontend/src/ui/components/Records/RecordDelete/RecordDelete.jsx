import React from 'react';
import {
    Dialog,
    Box,
    Typography,
    IconButton,
    Button
} from '@mui/material';
import {
    Close as CloseIcon,
    Warning as WarningIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import './RecordDelete.css';

const RecordDelete = ({ open, onClose, record, onConfirm }) => {
    if (!record) return null;

    const handleConfirm = () => {
        onConfirm(record.id);
        onClose();
    };

    const getClientName = () => {
        if (record.client) {
            return `${record.client.firstName || ''} ${record.client.lastName || ''}`.trim() || `Client #${record.clientId}`;
        }
        return `Client #${record.clientId}`;
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                className: 'cyber-delete-dialog'
            }}
        >
            <div className="delete-dialog-glow"></div>

            <Box className="cyber-delete-header">
                <Box className="delete-icon-wrapper">
                    <WarningIcon className="warning-icon" />
                    <div className="warning-pulse"></div>
                </Box>
                <IconButton onClick={onClose} className="cyber-delete-close-btn">
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box className="cyber-delete-content">
                <Typography className="delete-title">
                    Delete Record?
                </Typography>
                <Typography className="delete-message">
                    This action cannot be undone. The following record will be permanently deleted:
                </Typography>

                <Box className="record-preview">
                    <Box className="preview-row">
                        <Typography className="preview-label">Client:</Typography>
                        <Typography className="preview-value">{getClientName()}</Typography>
                    </Box>
                    <Box className="preview-row">
                        <Typography className="preview-label">Profile Type:</Typography>
                        <Typography className="preview-value">{record.profileType}</Typography>
                    </Box>
                    {record.createdAt && (
                        <Box className="preview-row">
                            <Typography className="preview-label">Created:</Typography>
                            <Typography className="preview-value">
                                {new Date(record.createdAt).toLocaleDateString()}
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Box className="warning-box">
                    <WarningIcon className="warning-box-icon" />
                    <Typography className="warning-text">
                        All associated data will be permanently removed from the database.
                    </Typography>
                </Box>
            </Box>

            <Box className="cyber-delete-footer">
                <Button onClick={onClose} className="cyber-btn-cancel">
                    <span className="btn-text">Cancel</span>
                </Button>
                <Button onClick={handleConfirm} className="cyber-btn-delete">
                    <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
                    <span className="btn-text">Delete Record</span>
                    <div className="btn-danger-shimmer"></div>
                </Button>
            </Box>
        </Dialog>
    );
};

export default RecordDelete;
