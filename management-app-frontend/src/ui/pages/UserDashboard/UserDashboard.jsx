import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Avatar,
    Chip,
    LinearProgress,
    Checkbox,
    IconButton,
    Snackbar,
    Alert
} from '@mui/material';
import {
    Assignment,
    CheckCircle,
    Schedule,
    PriorityHigh,
    Visibility,
    Timer,
    RadioButtonUnchecked,
    CheckCircleOutline
} from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';
import useMyTasks from '../../../hooks/useMyTasks';
import TaskView from "../../components/Task/UserTaskView/UserTaskView.jsx";
import './UserDashboard.css';

const UserDashboard = () => {
    const { user } = useAuth();
    const { tasks, loading, toggleFinish } = useMyTasks();

    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        finishedTasks: 0
    });

    const [viewingTask, setViewingTask] = useState(null);
    const [openTaskView, setOpenTaskView] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        if (tasks.length > 0) {
            setStats({
                totalTasks: tasks.length,
                completedTasks: tasks.filter(t => t.status === 'COMPLETED').length,
                pendingTasks: tasks.filter(t => t.status === 'PENDING').length,
                finishedTasks: tasks.filter(t => t.finished).length
            });
        }
    }, [tasks]);

    const handleToggleFinish = async (taskId) => {
        try {
            await toggleFinish(taskId);
            showSnackbar('Task status updated!', 'success');
        } catch (error) {
            console.error('Error toggling task:', error);
            showSnackbar('Failed to update task', 'error');
        }
    };

    const handleViewTask = (task) => {
        setViewingTask(task);
        setOpenTaskView(true);
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return '#10b981';
            case 'IN_PROGRESS': return '#3b82f6';
            case 'PENDING': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'URGENT': return '#ef4444';
            case 'HIGH': return '#f97316';
            case 'MEDIUM': return '#3b82f6';
            case 'LOW': return '#10b981';
            default: return '#6b7280';
        }
    };

    const getTimeRemaining = (dueDate) => {
        if (!dueDate) return null;

        const now = new Date();
        const due = new Date(dueDate);
        const diff = due - now;

        if (diff < 0) return { text: 'Overdue', color: '#ef4444', urgent: true };

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 7) return { text: `${days} days`, color: '#10b981', urgent: false };
        if (days > 2) return { text: `${days} days`, color: '#f59e0b', urgent: false };
        if (days > 0) return { text: `${days}d ${hours}h`, color: '#f97316', urgent: true };
        return { text: `${hours} hours`, color: '#ef4444', urgent: true };
    };

    const completionRate = stats.totalTasks > 0
        ? (stats.finishedTasks / stats.totalTasks) * 100
        : 0;

    return (
        <Box className="usr-dash-container">
            <Container maxWidth="xl">
                {/* Header */}
                <Box className="usr-dash-header">
                    <Typography variant="h3" className="usr-dash-title">
                        My Tasks
                    </Typography>
                    <Typography className="usr-dash-subtitle">
                        Welcome back, {user?.username || 'User'}! Track and manage your assignments.
                    </Typography>
                </Box>

                {/* Stats Grid */}
                <Grid container spacing={3} className="usr-dash-stats-grid">
                    <Grid item xs={12} sm={6} lg={3}>
                        <Card className="usr-dash-stat-card">
                            <CardContent className="usr-dash-stat-content">
                                <Avatar className="usr-dash-stat-avatar">
                                    <Assignment />
                                </Avatar>
                                <Box className="usr-dash-stat-info">
                                    <Typography className="usr-dash-stat-label">Total Tasks</Typography>
                                    <Typography className="usr-dash-stat-value">{stats.totalTasks}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <Card className="usr-dash-stat-card">
                            <CardContent className="usr-dash-stat-content">
                                <Avatar className="usr-dash-stat-avatar">
                                    <Schedule />
                                </Avatar>
                                <Box className="usr-dash-stat-info">
                                    <Typography className="usr-dash-stat-label">Pending</Typography>
                                    <Typography className="usr-dash-stat-value">{stats.pendingTasks}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <Card className="usr-dash-stat-card">
                            <CardContent className="usr-dash-stat-content">
                                <Avatar className="usr-dash-stat-avatar">
                                    <PriorityHigh />
                                </Avatar>
                                <Box className="usr-dash-stat-info">
                                    <Typography className="usr-dash-stat-label">Completed</Typography>
                                    <Typography className="usr-dash-stat-value">{stats.completedTasks}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <Card className="usr-dash-stat-card">
                            <CardContent className="usr-dash-stat-content">
                                <Avatar className="usr-dash-stat-avatar">
                                    <CheckCircle />
                                </Avatar>
                                <Box className="usr-dash-stat-info">
                                    <Typography className="usr-dash-stat-label">Finished</Typography>
                                    <Typography className="usr-dash-stat-value">{stats.finishedTasks}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Progress Card */}
                <Paper className="usr-dash-progress-card">
                    <Box className="usr-dash-progress-header">
                        <Typography className="usr-dash-progress-title">
                            Overall Progress
                        </Typography>
                        <Typography className="usr-dash-progress-percentage">
                            {completionRate.toFixed(0)}%
                        </Typography>
                    </Box>
                    <Box className="usr-dash-progress-bar-container">
                        <Box
                            className="usr-dash-progress-bar-fill"
                            sx={{ width: `${completionRate}%` }}
                        />
                    </Box>
                </Paper>

                {/* Tasks List */}
                <Paper className="usr-dash-tasks-section">
                    <Box className="usr-dash-tasks-header">
                        <Typography className="usr-dash-tasks-title">
                            Your Assigned Tasks
                        </Typography>
                        <Chip
                            label={tasks.length}
                            className="usr-dash-task-count-badge"
                        />
                    </Box>

                    {loading ? (
                        <Box className="usr-dash-empty-state">
                            <Typography>Loading your tasks...</Typography>
                        </Box>
                    ) : tasks.length === 0 ? (
                        <Box className="usr-dash-empty-state">
                            <Assignment className="usr-dash-empty-icon" />
                            <Typography variant="h6" className="usr-dash-empty-title">
                                No tasks assigned yet
                            </Typography>
                            <Typography className="usr-dash-empty-text">
                                Check back later for new assignments from your manager
                            </Typography>
                        </Box>
                    ) : (
                        tasks.map((task) => {
                            const timeRemaining = getTimeRemaining(task.dueDate);
                            return (
                                <Card
                                    key={task.id}
                                    className={`usr-dash-task-card ${task.finished ? 'usr-dash-task-finished' : ''}`}
                                >
                                    <CardContent className="usr-dash-task-content">
                                        <Box className="usr-dash-task-header">
                                            <Box className="usr-dash-task-left">
                                                <Box className="usr-dash-checkbox-wrapper">
                                                    <Checkbox
                                                        checked={task.finished || false}
                                                        onChange={() => handleToggleFinish(task.id)}
                                                        icon={<RadioButtonUnchecked />}
                                                        checkedIcon={<CheckCircleOutline />}
                                                        className={`usr-dash-checkbox ${task.finished ? 'usr-dash-checkbox-checked' : ''}`}
                                                    />
                                                </Box>
                                                <Box className="usr-dash-task-info">
                                                    <Typography
                                                        className={`usr-dash-task-title ${task.finished ? 'usr-dash-task-title-finished' : ''}`}
                                                    >
                                                        {task.title}
                                                    </Typography>
                                                    <Typography className={`usr-dash-task-description ${task.finished ? 'usr-dash-task-description-finished' : ''}`}>
                                                        {task.description?.substring(0, 100)}
                                                        {task.description?.length > 100 ? '...' : ''}
                                                    </Typography>
                                                    <Box className="usr-dash-task-meta">
                                                        <Box className="usr-dash-meta-item">
                                                            <Chip
                                                                label={task.priority}
                                                                size="small"
                                                                className={`usr-dash-priority-badge usr-dash-priority-${task.priority?.toLowerCase()}`}
                                                            />
                                                        </Box>
                                                        <Box className="usr-dash-meta-item">
                                                            <Chip
                                                                label={task.status?.replace('_', ' ')}
                                                                size="small"
                                                                className="usr-dash-status-chip"
                                                                sx={{
                                                                    borderColor: getStatusColor(task.status),
                                                                    color: getStatusColor(task.status),
                                                                }}
                                                                variant="outlined"
                                                            />
                                                        </Box>
                                                        {timeRemaining && (
                                                            <Chip
                                                                icon={<Timer />}
                                                                label={timeRemaining.text}
                                                                size="small"
                                                                className={`usr-dash-countdown-badge usr-dash-countdown-${timeRemaining.urgent ? 'danger' : timeRemaining.color === '#10b981' ? 'safe' : 'warning'}`}
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Box className="usr-dash-task-actions">
                                                <IconButton
                                                    className="usr-dash-action-btn"
                                                    onClick={() => handleViewTask(task)}
                                                    size="small"
                                                >
                                                    <Visibility />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </Paper>
            </Container>

            {/* Task View Dialog */}
            <TaskView
                open={openTaskView}
                onClose={() => setOpenTaskView(false)}
                task={viewingTask}
                onEdit={() => {}} // Users can't edit
            />

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    className="usr-dash-snackbar"
                    sx={{ borderRadius: '12px' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UserDashboard;