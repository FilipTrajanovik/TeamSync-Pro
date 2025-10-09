import React from 'react';
import {
    Dialog,
    Box,
    Typography,
    IconButton,
    Button,
    Chip,
    Divider
} from '@mui/material';
import {
    Close as CloseIcon,
    Edit as EditIcon,
    Person as PersonIcon,
    Category as CategoryIcon,
    CalendarToday as CalendarIcon,
    Code as CodeIcon
} from '@mui/icons-material';
import './RecordView.css';

const RecordView = ({ open, onClose, record, onEdit }) => {
    if (!record) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getClientName = () => {
        if (record.client) {
            return `${record.client.firstName || ''} ${record.client.lastName || ''}`.trim() || `Client #${record.clientId}`;
        }
        return `Client #${record.clientId}`;
    };

    const formatJSON = (data) => {
        try {
            const parsed = typeof data === 'string' ? JSON.parse(data) : data;
            return JSON.stringify(parsed, null, 2);
        } catch (e) {
            return data;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                className: 'cyber-view-dialog'
            }}
        >
            <div className="view-dialog-glow"></div>

            <Box className="cyber-view-header">
                <Box className="view-header-content">
                    <Box className="view-icon-wrapper">
                        <CodeIcon className="view-header-icon" />
                    </Box>
                    <Box>
                        <Typography className="view-header-title">
                            Record Details
                        </Typography>
                        <Typography className="view-header-subtitle">
                            View complete record information
                        </Typography>
                    </Box>
                </Box>
                <Box className="header-actions">
                    <IconButton
                        onClick={() => {
                            onClose();
                            onEdit(record);
                        }}
                        className="cyber-edit-btn"
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={onClose} className="cyber-view-close-btn">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>

            <Box className="cyber-view-content">
                <Box className="info-grid">
                    <Box className="info-card">
                        <Box className="info-icon-wrapper client">
                            <PersonIcon />
                        </Box>
                        <Typography className="info-label">Client</Typography>
                        <Typography className="info-value">{getClientName()}</Typography>
                    </Box>

                    <Box className="info-card">
                        <Box className="info-icon-wrapper type">
                            <CategoryIcon />
                        </Box>
                        <Typography className="info-label">Profile Type</Typography>
                        <Chip
                            label={record.profileType}
                            className="profile-type-chip"
                        />
                    </Box>

                    <Box className="info-card">
                        <Box className="info-icon-wrapper date">
                            <CalendarIcon />
                        </Box>
                        <Typography className="info-label">Created</Typography>
                        <Typography className="info-value date-value">
                            {formatDate(record.createdAt)}
                        </Typography>
                    </Box>
                </Box>

                <Divider className="cyber-divider" />

                <Box className="json-section">
                    <Box className="json-header">
                        <CodeIcon className="json-icon" />
                        <Typography className="json-title">JSON Data</Typography>
                    </Box>
                    <Box className="json-viewer">
                        <pre className="json-content">
                            {formatJSON(record.jsonData)}
                        </pre>
                    </Box>
                </Box>
            </Box>

            <Box className="cyber-view-footer">
                <Button onClick={onClose} className="cyber-btn-close">
                    <span className="btn-text">Close</span>
                </Button>
                <Button
                    onClick={() => {
                        onClose();
                        onEdit(record);
                    }}
                    className="cyber-btn-edit"
                >
                    <EditIcon sx={{ mr: 1, fontSize: 18 }} />
                    <span className="btn-text">Edit Record</span>
                </Button>
            </Box>
        </Dialog>
    );
};

export default RecordView;
