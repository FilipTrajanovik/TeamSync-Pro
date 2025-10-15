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
import TaskView from '../../components/Task/TaskView/TaskView.jsx';
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
        <Box className="user-dashboard-modern">
            <Container maxWidth="xl">
                {/* Header */}
                <Box className="dashboard-header">
                    <Typography variant="h3" className="header-title">
                        My Tasks
                    </Typography>
                    <Typography className="header-subtitle">
                        Welcome back, {user?.username || 'User'}! Track and manage your assignments.
                    </Typography>
                </Box>

                {/* Stats Grid */}
                <Grid container spacing={3} className="stats-grid">
                    <Grid item xs={12} sm={6} lg={3}>
                        <Card className="stat-card">
                            <CardContent className="stat-content">
                                <Avatar className="stat-avatar" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                    <Assignment />
                                </Avatar>
                                <Box className="stat-info">
                                    <Typography className="stat-label">Total Tasks</Typography>
                                    <Typography className="stat-value">{stats.totalTasks}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <Card className="stat-card">
                            <CardContent className="stat-content">
                                <Avatar className="stat-avatar" sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                                    <Schedule />
                                </Avatar>
                                <Box className="stat-info">
                                    <Typography className="stat-label">Pending</Typography>
                                    <Typography className="stat-value">{stats.pendingTasks}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <Card className="stat-card">
                            <CardContent className="stat-content">
                                <Avatar className="stat-avatar" sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                                    <PriorityHigh />
                                </Avatar>
                                <Box className="stat-info">
                                    <Typography className="stat-label">Completed</Typography>
                                    <Typography className="stat-value">{stats.completedTasks}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <Card className="stat-card">
                            <CardContent className="stat-content">
                                <Avatar className="stat-avatar" sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                                    <CheckCircle />
                                </Avatar>
                                <Box className="stat-info">
                                    <Typography className="stat-label">Finished</Typography>
                                    <Typography className="stat-value">{stats.finishedTasks}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Progress Card */}
                <Paper className="progress-card">
                    <Box className="progress-header">
                        <Typography className="progress-title">
                            Overall Progress
                        </Typography>
                        <Typography className="progress-percentage">
                            {completionRate.toFixed(0)}%
                        </Typography>
                    </Box>
                    <Box className="progress-bar-container">
                        <Box
                            className="progress-bar-fill"
                            sx={{ width: `${completionRate}%` }}
                        />
                    </Box>
                </Paper>

                {/* Tasks List */}
                <Paper className="tasks-section">
                    <Box className="tasks-header">
                        <Typography className="tasks-title">
                            Your Assigned Tasks
                        </Typography>
                        <Chip
                            label={tasks.length}
                            className="task-count-badge"
                        />
                    </Box>

                    {loading ? (
                        <Box className="empty-state">
                            <Typography>Loading your tasks...</Typography>
                        </Box>
                    ) : tasks.length === 0 ? (
                        <Box className="empty-state">
                            <Assignment className="empty-icon" />
                            <Typography variant="h6" className="empty-title">
                                No tasks assigned yet
                            </Typography>
                            <Typography className="empty-text">
                                Check back later for new assignments from your manager
                            </Typography>
                        </Box>
                    ) : (
                        tasks.map((task) => {
                            const timeRemaining = getTimeRemaining(task.dueDate);
                            return (
                                <Card
                                    key={task.id}
                                    className={`task-card ${task.finished ? 'finished' : ''}`}
                                >
                                    <CardContent className="task-card-content">
                                        <Box className="task-header">
                                            <Box className="task-left">
                                                <Box className="task-checkbox-wrapper">
                                                    <Checkbox
                                                        checked={task.finished || false}
                                                        onChange={() => handleToggleFinish(task.id)}
                                                        icon={<RadioButtonUnchecked />}
                                                        checkedIcon={<CheckCircleOutline />}
                                                        className={`task-checkbox ${task.finished ? 'checked' : ''}`}
                                                    />
                                                </Box>
                                                <Box className="task-info">
                                                    <Typography
                                                        className={`task-title ${task.finished ? 'finished' : ''}`}
                                                    >
                                                        {task.title}
                                                    </Typography>
                                                    <Typography className={`task-description ${task.finished ? 'finished' : ''}`}>
                                                        {task.description?.substring(0, 100)}
                                                        {task.description?.length > 100 ? '...' : ''}
                                                    </Typography>
                                                    <Box className="task-meta">
                                                        <Box className="meta-item">
                                                            <Chip
                                                                label={task.priority}
                                                                size="small"
                                                                className={`priority-badge priority-${task.priority?.toLowerCase()}`}
                                                            />
                                                        </Box>
                                                        <Box className="meta-item">
                                                            <Chip
                                                                label={task.status?.replace('_', ' ')}
                                                                size="small"
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
                                                                className={`countdown-badge countdown-${timeRemaining.urgent ? 'danger' : timeRemaining.color === '#10b981' ? 'safe' : 'warning'}`}
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Box className="task-actions">
                                                <IconButton
                                                    className="task-action-btn"
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
                    sx={{ borderRadius: '12px' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UserDashboard;