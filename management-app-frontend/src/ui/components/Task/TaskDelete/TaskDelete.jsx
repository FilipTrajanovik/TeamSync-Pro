import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    IconButton,
    Chip
} from '@mui/material';
import {
    Close as CloseIcon,
    Warning as WarningIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import './TaskDelete.css';

const TaskDelete = ({ open, onClose, onConfirm, task }) => {
    if (!task) return null;

    const getPriorityColor = (priority) => {
        const configs = {
            LOW: '#10b981',
            MEDIUM: '#f59e0b',
            HIGH: '#ef4444',
            URGENT: '#dc2626'
        };
        return configs[priority] || '#f59e0b';
    };

    const getStatusColor = (status) => {
        const configs = {
            COMPLETED: 'success',
            IN_PROGRESS: 'info',
            PENDING: 'warning',
            ON_HOLD: 'default',
            CANCELLED: 'error'
        };
        return configs[status] || 'warning';
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                className: 'task-delete-dialog'
            }}
        >
            {/* Header */}
            <Box className="task-delete-header">
                <Box display="flex" alignItems="center" gap={2}>
                    <Box className="warning-icon-wrapper">
                        <WarningIcon sx={{ fontSize: 32 }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" fontWeight="bold" color="white">
                            Delete Task
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                            This action cannot be undone
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
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        Are you sure you want to delete this task?
                    </Typography>
                </Box>

                {/* Task Details Preview */}
                <Box
                    sx={{
                        p: 2.5,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.05) 100%)',
                        border: '2px solid #fee2e2'
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={1.5}>
                        <Typography variant="h6" fontWeight="bold">
                            {task.title}
                        </Typography>
                        <Chip
                            label={task.priority}
                            size="small"
                            sx={{
                                background: getPriorityColor(task.priority),
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.75rem'
                            }}
                        />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {task.description}
                    </Typography>

                    <Box display="flex" gap={1} flexWrap="wrap">
                        <Chip
                            label={task.status?.replace('_', ' ')}
                            size="small"
                            color={getStatusColor(task.status)}
                        />
                        {task.organization && (
                            <Chip
                                label={task.organization.name}
                                size="small"
                                variant="outlined"
                            />
                        )}
                        {task.assignedToUserId && (
                            <Chip
                                label={`Assigned to: ${task.assignedToUserId.name} ${task.assignedToUserId.surname}`}
                                size="small"
                                variant="outlined"
                            />
                        )}
                    </Box>
                </Box>

                <Box
                    sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 2,
                        background: '#fef3c7',
                        border: '1px solid #fcd34d'
                    }}
                >
                    <Typography variant="body2" fontWeight="600" color="#92400e">
                        Warning: All data associated with this task will be permanently deleted.
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 3,
                        fontWeight: 'bold'
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        onConfirm(task.id);
                        onClose();
                    }}
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    sx={{
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 3,
                        fontWeight: 'bold',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                        '&:hover': {
                            boxShadow: '0 6px 16px rgba(239, 68, 68, 0.5)',
                            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                        }
                    }}
                >
                    Delete Task
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskDelete;