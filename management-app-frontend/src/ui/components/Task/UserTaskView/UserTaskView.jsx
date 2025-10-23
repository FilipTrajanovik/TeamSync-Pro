import React, { useState } from 'react';
import {
    Dialog,
    Box,
    Typography,
    IconButton,
    Button,
    Chip,
    Grid,
    Divider,
    Switch,
    FormControlLabel,
    CircularProgress
} from '@mui/material';
import {
    Close as CloseIcon,
    Assignment as AssignmentIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    CalendarToday as CalendarIcon,
    Timer as TimerIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import './UserTaskView.css';

const UserTaskView = ({ open, onClose, task, onFinishToggle }) => {
    const [isToggling, setIsToggling] = useState(false);

    if (!task) return null;

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'URGENT': return { bg: 'rgba(220, 38, 38, 0.2)', color: '#dc2626', border: 'rgba(220, 38, 38, 0.4)' };
            case 'HIGH': return { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'rgba(239, 68, 68, 0.3)' };
            case 'MEDIUM': return { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', border: 'rgba(251, 146, 60, 0.3)' };
            case 'LOW': return { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' };
            default: return { bg: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: 'rgba(255, 255, 255, 0.2)' };
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: 'rgba(16, 185, 129, 0.3)' };
            case 'IN_PROGRESS': return { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' };
            case 'PENDING': return { bg: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', border: 'rgba(251, 191, 36, 0.3)' };
            case 'ON_HOLD': return { bg: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', border: 'rgba(148, 163, 184, 0.3)' };
            case 'CANCELLED': return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' };
            default: return { bg: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: 'rgba(255, 255, 255, 0.2)' };
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleFinishToggle = async () => {
        if (isToggling) return;
        setIsToggling(true);

        try {
            await onFinishToggle(task.id);
        } catch (error) {
            console.error('Error toggling finish status:', error);
        } finally {
            setIsToggling(false);
        }
    };

    const priorityStyle = getPriorityColor(task.priority);
    const statusStyle = getStatusColor(task.status);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                className: 'usr-task-view-dialog'
            }}
        >
            {/* Animated Background */}
            <div className="usr-task-view-bg">
                <div className="usr-floating-orb usr-orb-1"></div>
                <div className="usr-floating-orb usr-orb-2"></div>
            </div>

            {/* Header */}
            <Box className="usr-task-view-header">
                <Box className="usr-header-content">
                    <Box className="usr-header-icon-wrapper">
                        <AssignmentIcon className="usr-header-icon" />
                    </Box>
                    <Typography className="usr-header-title">
                        Task Details
                    </Typography>
                </Box>
                <IconButton onClick={onClose} className="usr-close-btn">
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Content */}
            <Box className="usr-task-view-content">
                {/* Title */}
                <Box className="usr-info-section">
                    <Typography className="usr-task-title">
                        {task.title}
                    </Typography>
                </Box>

                {/* Status & Priority Badges */}
                <Box className="usr-badges-section">
                    <Chip
                        label={task.priority}
                        className="usr-priority-chip"
                        sx={{
                            backgroundColor: priorityStyle.bg,
                            color: priorityStyle.color,
                            border: `1px solid ${priorityStyle.border}`,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            fontSize: '0.75rem'
                        }}
                    />
                    <Chip
                        label={task.status?.replace('_', ' ')}
                        className="usr-status-chip"
                        sx={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            border: `1px solid ${statusStyle.border}`,
                            fontWeight: 600,
                            fontSize: '0.75rem'
                        }}
                    />
                </Box>

                <Divider className="usr-divider" />

                {/* Description */}
                <Box className="usr-info-section">
                    <Typography className="usr-section-label">
                        📝 Description
                    </Typography>
                    <Typography className="usr-description-text">
                        {task.description || 'No description provided'}
                    </Typography>
                </Box>

                <Divider className="usr-divider" />

                {/* Task Details Grid */}
                <Box className="usr-info-section">
                    <Typography className="usr-section-label">
                        ℹ️ Task Information
                    </Typography>
                    <Grid container spacing={3} className="usr-details-grid">
                        <Grid item xs={12} sm={6}>
                            <Box className="usr-detail-item">
                                <CalendarIcon className="usr-detail-icon" />
                                <Box>
                                    <Typography className="usr-detail-label">
                                        Due Date
                                    </Typography>
                                    <Typography className="usr-detail-value">
                                        {formatDate(task.dueDate)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {task.assignedToUserId && (
                            <Grid item xs={12} sm={6}>
                                <Box className="usr-detail-item">
                                    <PersonIcon className="usr-detail-icon" />
                                    <Box>
                                        <Typography className="usr-detail-label">
                                            Assigned To
                                        </Typography>
                                        <Typography className="usr-detail-value">
                                            {task.assignedToUserId.name} {task.assignedToUserId.surname}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', display: 'block', mt: 0.5 }}>
                                            @{task.assignedToUserId.username}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        )}

                        {task.client && (
                            <Grid item xs={12} sm={6}>
                                <Box className="usr-detail-item">
                                    <PersonIcon className="usr-detail-icon" />
                                    <Box>
                                        <Typography className="usr-detail-label">
                                            Client
                                        </Typography>
                                        <Typography className="usr-detail-value">
                                            {task.client.firstName} {task.client.lastName}
                                        </Typography>
                                        {task.client.email && (
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', display: 'block', mt: 0.5 }}>
                                                {task.client.email}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Grid>
                        )}

                        {task.organization && (
                            <Grid item xs={12} sm={6}>
                                <Box className="usr-detail-item">
                                    <BusinessIcon className="usr-detail-icon" />
                                    <Box>
                                        <Typography className="usr-detail-label">
                                            Organization
                                        </Typography>
                                        <Typography className="usr-detail-value">
                                            {task.organization.name}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        )}

                        <Grid item xs={12} sm={6}>
                            <Box className="usr-detail-item">
                                <TimerIcon className="usr-detail-icon" />
                                <Box>
                                    <Typography className="usr-detail-label">
                                        Created On
                                    </Typography>
                                    <Typography className="usr-detail-value">
                                        {formatDate(task.createdAt)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {task.completedDate && (
                            <Grid item xs={12} sm={6}>
                                <Box className="usr-detail-item">
                                    <CheckCircleIcon className="usr-detail-icon" />
                                    <Box>
                                        <Typography className="usr-detail-label">
                                            Completed Date
                                        </Typography>
                                        <Typography className="usr-detail-value">
                                            {formatDate(task.completedDate)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </Box>

                <Divider className="usr-divider" />

                {/* Mark as Finished Toggle */}
                <Box className="usr-finish-section">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={task.finished || false}
                                onChange={handleFinishToggle}
                                disabled={isToggling}
                                className="usr-finish-switch"
                            />
                        }
                        label={
                            <Box className="usr-finish-label">
                                {isToggling ? (
                                    <CircularProgress
                                        size={24}
                                        sx={{ color: '#10b981' }}
                                    />
                                ) : (
                                    <CheckCircleIcon
                                        className="usr-finish-icon"
                                        sx={{ color: task.finished ? '#10b981' : 'rgba(255, 255, 255, 0.3)' }}
                                    />
                                )}
                                <Typography className="usr-finish-text">
                                    {isToggling ? 'Updating...' : task.finished ? 'Task Finished' : 'Mark as Finished'}
                                </Typography>
                            </Box>
                        }
                        className="usr-finish-control"
                    />
                </Box>
            </Box>

            {/* Footer */}
            <Box className="usr-task-view-footer">
                <Button
                    onClick={onClose}
                    className="usr-close-button"
                >
                    Close
                </Button>
            </Box>
        </Dialog>
    );
};

export default UserTaskView;