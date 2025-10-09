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
    LinearProgress
} from '@mui/material';
import {
    Assignment,
    CheckCircle,
    Schedule,
    PriorityHigh
} from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';
import taskRepository from '../../../repository/taskRepository';
import './UserDashboard.css';

const UserDashboard = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyTasks();
    }, []);

    const fetchMyTasks = async () => {
        try {
            // Fetch tasks assigned to current user
            const response = await taskRepository.findByAssigned(user.username);
            setTasks(response.data);

            setStats({
                totalTasks: response.data.length,
                completedTasks: response.data.filter(t => t.status === 'COMPLETED').length,
                pendingTasks: response.data.filter(t => t.status === 'PENDING').length,
                inProgressTasks: response.data.filter(t => t.status === 'IN_PROGRESS').length
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon, color }) => (
        <Card className="stat-card" sx={{ height: '100%' }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography color="textSecondary" variant="body2" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                            {value}
                        </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
                        {icon}
                    </Avatar>
                </Box>
            </CardContent>
        </Card>
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'success';
            case 'IN_PROGRESS': return 'info';
            case 'PENDING': return 'warning';
            default: return 'default';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'URGENT': return '#f44336';
            case 'HIGH': return '#ff9800';
            case 'MEDIUM': return '#2196f3';
            case 'LOW': return '#4caf50';
            default: return '#9e9e9e';
        }
    };

    const completionRate = stats.totalTasks > 0
        ? (stats.completedTasks / stats.totalTasks) * 100
        : 0;

    return (
        <Box className="user-dashboard">
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box mb={4}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        My Tasks
                    </Typography>
                    <Typography color="textSecondary">
                        Welcome back, {user?.name}! Here are your assigned tasks.
                    </Typography>
                </Box>

                <Grid container spacing={3} mb={4}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Total Tasks"
                            value={stats.totalTasks}
                            icon={<Assignment />}
                            color="#667eea"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Pending"
                            value={stats.pendingTasks}
                            icon={<Schedule />}
                            color="#ffa726"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="In Progress"
                            value={stats.inProgressTasks}
                            icon={<PriorityHigh />}
                            color="#42a5f5"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Completed"
                            value={stats.completedTasks}
                            icon={<CheckCircle />}
                            color="#43e97b"
                        />
                    </Grid>
                </Grid>

                <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Completion Rate
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Box flex={1}>
                            <LinearProgress
                                variant="determinate"
                                value={completionRate}
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: '#e0e0e0',
                                    '& .MuiLinearProgress-bar': {
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                    }
                                }}
                            />
                        </Box>
                        <Typography variant="h6" fontWeight="bold">
                            {completionRate.toFixed(0)}%
                        </Typography>
                    </Box>
                </Paper>

                <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold" mb={3}>
                        My Task List
                    </Typography>

                    {loading ? (
                        <Typography align="center" color="textSecondary">
                            Loading tasks...
                        </Typography>
                    ) : tasks.length === 0 ? (
                        <Box textAlign="center" py={4}>
                            <Assignment sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                            <Typography variant="h6" color="textSecondary">
                                No tasks assigned yet
                            </Typography>
                            <Typography color="textSecondary">
                                Check back later for new assignments
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {tasks.map((task) => (
                                <Grid item xs={12} md={6} key={task.id}>
                                    <Card
                                        className="task-card"
                                        sx={{
                                            height: '100%',
                                            borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)'
                                            }
                                        }}
                                    >
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                                                <Typography variant="h6" fontWeight="bold">
                                                    {task.title}
                                                </Typography>
                                                <Chip
                                                    label={task.status}
                                                    size="small"
                                                    color={getStatusColor(task.status)}
                                                />
                                            </Box>

                                            <Typography color="textSecondary" mb={2}>
                                                {task.description}
                                            </Typography>

                                            <Box display="flex" gap={1} flexWrap="wrap">
                                                <Chip
                                                    label={task.priority}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: getPriorityColor(task.priority),
                                                        color: 'white'
                                                    }}
                                                />
                                                {task.dueDate && (
                                                    <Chip
                                                        icon={<Schedule />}
                                                        label={new Date(task.dueDate).toLocaleDateString()}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default UserDashboard;