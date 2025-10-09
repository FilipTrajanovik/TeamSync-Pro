import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    IconButton,
    Chip,
    Grid,
    Divider,
    Avatar
} from '@mui/material';
import {
    Close as CloseIcon,
    Assignment as AssignmentIcon,
    Business as BusinessIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    CheckCircle as CheckCircleIcon,
    Description as DescriptionIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import './TaskView.css';

const TaskView = ({ open, onClose, task, onEdit }) => {
    if (!task) return null;

    const getPriorityConfig = (priority) => {
        const configs = {
            LOW: { color: '#10b981', icon: '✓', label: 'Low Priority' },
            MEDIUM: { color: '#f59e0b', icon: '⚡', label: 'Medium Priority' },
            HIGH: { color: '#ef4444', icon: '🔥', label: 'High Priority' },
            URGENT: { color: '#dc2626', icon: '🚨', label: 'Urgent' }
        };
        return configs[priority] || configs.MEDIUM;
    };

    const getStatusConfig = (status) => {
        const configs = {
            COMPLETED: { color: '#10b981', bg: '#d1fae5', icon: '✅', label: 'Completed' },
            IN_PROGRESS: { color: '#3b82f6', bg: '#dbeafe', icon: '🔄', label: 'In Progress' },
            PENDING: { color: '#f59e0b', bg: '#fef3c7', icon: '⏳', label: 'Pending' },
            ON_HOLD: { color: '#6b7280', bg: '#f3f4f6', icon: '⏸️', label: 'On Hold' },
            CANCELLED: { color: '#ef4444', bg: '#fee2e2', icon: '❌', label: 'Cancelled' }
        };
        return configs[status] || configs.PENDING;
    };

    const priorityConfig = getPriorityConfig(task.priority);
    const statusConfig = getStatusConfig(task.status);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                className: 'task-view-dialog'
            }}
        >
            {/* Header */}
            <Box className="task-view-header">
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                        className="task-view-icon"
                        sx={{
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            width: 56,
                            height: 56
                        }}
                    >
                        <AssignmentIcon sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight="bold" color="white">
                            Task Details
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                            Complete task information
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    onClick={onClose}
                    sx={{ color: 'white' }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: 3 }}>
                {/* Title & Priority Badge */}
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={3}>
                    <Box flex={1}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {task.title}
                        </Typography>
                    </Box>
                    <Chip
                        label={task.priority}
                        icon={<span style={{ marginLeft: 8 }}>{priorityConfig.icon}</span>}
                        sx={{
                            background: priorityConfig.color,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            px: 1
                        }}
                    />
                </Box>

                {/* Status */}
                <Box
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        background: statusConfig.bg,
                        border: `1px solid ${statusConfig.color}40`,
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.25rem'
                        }}
                    >
                        {statusConfig.icon}
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                            Current Status
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" sx={{ color: statusConfig.color }}>
                            {statusConfig.label}
                        </Typography>
                    </Box>
                </Box>

                {/* Description */}
                <Box mb={3}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <DescriptionIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
                            DESCRIPTION
                        </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ pl: 4 }}>
                        {task.description}
                    </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Details Grid */}
                <Grid container spacing={3}>
                    {/* Organization */}
                    {task.organization && (
                        <Grid item xs={12} md={6}>
                            <Box className="info-card">
                                <Box className="info-icon" sx={{ background: '#667eea20' }}>
                                    <BusinessIcon sx={{ color: '#667eea' }} />
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Organization
                                    </Typography>
                                    <Typography variant="body1" fontWeight="600">
                                        {task.organization.name}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    )}

                    {/* Assigned User */}
                    {task.assignedToUserId && (
                        <Grid item xs={12} md={6}>
                            <Box className="info-card">
                                <Box className="info-icon" sx={{ background: '#10b98120' }}>
                                    <PersonIcon sx={{ color: '#10b981' }} />
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Assigned To
                                    </Typography>
                                    <Typography variant="body1" fontWeight="600">
                                        {task.assignedToUserId.name} {task.assignedToUserId.surname}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        @{task.assignedToUserId.username}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    )}

                    {/* Created By */}
                    {task.createdByUserId && (
                        <Grid item xs={12} md={6}>
                            <Box className="info-card">
                                <Box className="info-icon" sx={{ background: '#3b82f620' }}>
                                    <PersonIcon sx={{ color: '#3b82f6' }} />
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Created By
                                    </Typography>
                                    <Typography variant="body1" fontWeight="600">
                                        {task.createdByUserId.name} {task.createdByUserId.surname}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        @{task.createdByUserId.username}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    )}

                    {/* Client */}
                    {task.client && (
                        <Grid item xs={12} md={6}>
                            <Box className="info-card">
                                <Box className="info-icon" sx={{ background: '#f59e0b20' }}>
                                    <PersonIcon sx={{ color: '#f59e0b' }} />
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Client
                                    </Typography>
                                    <Typography variant="body1" fontWeight="600">
                                        {task.client.firstName} {task.client.lastName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {task.client.email}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    )}

                    {/* Due Date */}
                    {task.dueDate && (
                        <Grid item xs={12} md={6}>
                            <Box className="info-card">
                                <Box className="info-icon" sx={{ background: '#ec489920' }}>
                                    <CalendarIcon sx={{ color: '#ec4899' }} />
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Due Date
                                    </Typography>
                                    <Typography variant="body1" fontWeight="600">
                                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    )}

                    {/* Completed Date */}
                    {task.completedDate && (
                        <Grid item xs={12} md={6}>
                            <Box className="info-card">
                                <Box className="info-icon" sx={{ background: '#10b98120' }}>
                                    <CheckCircleIcon sx={{ color: '#10b981' }} />
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Completed Date
                                    </Typography>
                                    <Typography variant="body1" fontWeight="600">
                                        {new Date(task.completedDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 3
                    }}
                >
                    Close
                </Button>
                <Button
                    onClick={() => {
                        onEdit(task);
                        onClose();
                    }}
                    variant="contained"
                    startIcon={<EditIcon />}
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 3,
                        fontWeight: 'bold',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                        '&:hover': {
                            boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)'
                        }
                    }}
                >
                    Edit Task
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskView;