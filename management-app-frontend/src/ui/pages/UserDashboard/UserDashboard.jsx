import React, {useEffect, useState} from 'react';
import {
    Alert,
    Avatar,
    Box,
    Card,
    CardContent,
    Checkbox,
    Chip,
    Container,
    Grid,
    IconButton,
    Paper,
    Snackbar,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import {
    Assignment,
    BarChart as BarChartIcon,
    ChatBubble,
    CheckCircle,
    CheckCircleOutline,
    PriorityHigh,
    RadioButtonUnchecked,
    Schedule,
    Timer,
    TrendingUp,
    Visibility
} from '@mui/icons-material';
import {useAuth} from '../../../hooks/useAuth';
import useMyTasks from '../../../hooks/useMyTasks';
import useUserAnalytics from '../../../hooks/useUserAnalytics';
import TaskView from "../../components/Task/UserTaskView/UserTaskView.jsx";
import './UserDashboard.css';
import useSearchFilter from "../../../hooks/useSearchFilter.js";
import SearchFilter from "../../components/SearchFilter/SearchFilter.jsx";
import CommentList from '../../components/Comments/CommentList/CommentList.jsx';
import {
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import Navbar from "../../components/Navbar/Navbar.jsx";


const UserDashboard = () => {
    const {user} = useAuth();
    const {tasks, loading, toggleFinish} = useMyTasks();
    const {
        taskStats,
        priorityDistribution,
        taskTrend,
        personalMetrics,
        loading: analyticsLoading,
        error: analyticsError,
        fetchAllData
    } = useUserAnalytics();

    // Tab state for switching between Tasks and Analytics
    const [currentTab, setCurrentTab] = useState(0);

    const [selectedTaskForComments, setSelectedTaskForComments] = useState(null);
    const [openCommentsModal, setOpenCommentsModal] = useState(false);

    //TASKS FILTER
    const {
        filteredData: filteredTasks,
        searchTerm,
        filters,
        sortBy,
        handleSearchChange,
        handleFilterChange,
        handleSortChange,
        clearFilters,
        activeFiltersCount,
        resultCount,
        totalCount
    } = useSearchFilter(tasks, {
        searchFields: ['title', 'description'],
        filterableFields: ['status', 'priority'],
        defaultSortBy: 'DATE_DESC'
    });

    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        finishedTasks: 0
    });

    const [viewingTask, setViewingTask] = useState(null);
    const [openTaskView, setOpenTaskView] = useState(false);
    const [snackbar, setSnackbar] = useState({open: false, message: '', severity: 'success'});

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

    // Fetch analytics data when user is available
    useEffect(() => {
        if (user?.username) {
            fetchAllData(user.username, 7);
        }
    }, [user?.username, fetchAllData]);

    const handleToggleFinish = async (taskId) => {
        try {
            await toggleFinish(taskId);
            showSnackbar('Task status updated!', 'success');
            // Refresh analytics after task update
            if (user?.username) {
                fetchAllData(user.username, 7);
            }
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
        setSnackbar({open: true, message, severity});
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED':
                return '#10b981';
            case 'IN_PROGRESS':
                return '#3b82f6';
            case 'PENDING':
                return '#f59e0b';
            default:
                return '#6b7280';
        }
    };

    const getTimeRemaining = (dueDate) => {
        if (!dueDate) return null;

        const now = new Date();
        const due = new Date(dueDate);
        const diff = due - now;

        if (diff < 0) return {text: 'Overdue', color: '#ef4444', urgent: true};

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 7) return {text: `${days} days`, color: '#10b981', urgent: false};
        if (days > 2) return {text: `${days} days`, color: '#f59e0b', urgent: false};
        if (days > 0) return {text: `${days}d ${hours}h`, color: '#f97316', urgent: true};
        return {text: `${hours} hours`, color: '#ef4444', urgent: true};
    };

    const completionRate = stats.totalTasks > 0
        ? (stats.finishedTasks / stats.totalTasks) * 100
        : 0;

    // Chart colors matching your design
    const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    const handleOpenComments = (task) => {
        setSelectedTaskForComments(task)
        setOpenCommentsModal(true)
    }

    const handleCloseComments = () => {
        setSelectedTaskForComments(null)
        setOpenCommentsModal(false)
    }

    return (
        <>
            <Navbar/>
            <Box className="usr-dash-container">
                <Container maxWidth="xl">
                    {/* Header */}
                    <Box className="usr-dash-header">
                        <Typography variant="h3" className="usr-dash-title">
                            My Dashboard
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
                                        <Assignment/>
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
                                        <Schedule/>
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
                                        <PriorityHigh/>
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
                                        <CheckCircle/>
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
                                sx={{width: `${completionRate}%`}}
                            />
                        </Box>
                    </Paper>

                    {/* Tabs for Tasks and Analytics */}
                    <Paper className="usr-dash-tasks-section" sx={{marginBottom: '32px'}}>
                        <Tabs
                            value={currentTab}
                            onChange={(e, newValue) => setCurrentTab(newValue)}
                            sx={{
                                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                                '& .MuiTab-root': {
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    fontWeight: 600,
                                    fontSize: '0.938rem',
                                    textTransform: 'none',
                                    minHeight: '56px',
                                    '&.Mui-selected': {
                                        color: '#ffffff'
                                    }
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#10b981',
                                    height: '3px'
                                }
                            }}
                        >
                            <Tab icon={<Assignment/>} iconPosition="start" label="My Tasks"/>
                            <Tab icon={<BarChartIcon/>} iconPosition="start" label="Analytics"/>
                        </Tabs>
                    </Paper>

                    {/* Tasks Tab */}
                    {currentTab === 0 && (
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

                            <SearchFilter
                                searchTerm={searchTerm}
                                searchPlaceholder="Search my tasks by title or description..."
                                onSearchChange={handleSearchChange}
                                filters={filters}
                                filterOptions={{
                                    status: [
                                        {value: 'ALL', label: 'All Status'},
                                        {value: 'PENDING', label: 'Pending'},
                                        {value: 'IN_PROGRESS', label: 'In Progress'},
                                        {value: 'COMPLETED', label: 'Completed'},
                                        {value: 'CANCELLED', label: 'Cancelled'},
                                        {value: 'ON_HOLD', label: 'On Hold'}
                                    ],
                                    priority: [
                                        {value: 'ALL', label: 'All Priority'},
                                        {value: 'LOW', label: 'Low'},
                                        {value: 'MEDIUM', label: 'Medium'},
                                        {value: 'HIGH', label: 'High'},
                                        {value: 'URGENT', label: 'Urgent'}
                                    ]
                                }}
                                onFilterChange={handleFilterChange}
                                sortBy={sortBy}
                                sortOptions={[
                                    {value: 'DATE_DESC', label: 'Newest First'},
                                    {value: 'DATE_ASC', label: 'Oldest First'},
                                    {value: 'TITLE_ASC', label: 'Title A-Z'},
                                    {value: 'TITLE_DESC', label: 'Title Z-A'},
                                    {value: 'PRIORITY_DESC', label: 'Priority High→Low'},
                                    {value: 'PRIORITY_ASC', label: 'Priority Low→High'}
                                ]}
                                onSortChange={handleSortChange}
                                onClearFilters={clearFilters}
                                activeFiltersCount={activeFiltersCount}
                                resultCount={resultCount}
                                totalCount={totalCount}
                            />

                            {loading ? (
                                <Box className="usr-dash-empty-state">
                                    <Typography>Loading your tasks...</Typography>
                                </Box>
                            ) : filteredTasks.length === 0 ? (
                                <Box className="usr-dash-empty-state">
                                    <Assignment className="usr-dash-empty-icon"/>
                                    <Typography variant="h6" className="usr-dash-empty-title">
                                        No tasks assigned yet
                                    </Typography>
                                    <Typography className="usr-dash-empty-text">
                                        Check back later for new assignments from your manager
                                    </Typography>
                                </Box>
                            ) : (
                                filteredTasks.map((task) => {
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
                                                                icon={<RadioButtonUnchecked/>}
                                                                checkedIcon={<CheckCircleOutline/>}
                                                                className={`usr-dash-checkbox ${task.finished ? 'usr-dash-checkbox-checked' : ''}`}
                                                            />
                                                        </Box>
                                                        <Box className="usr-dash-task-info">
                                                            <Typography
                                                                className={`usr-dash-task-title ${task.finished ? 'usr-dash-task-title-finished' : ''}`}
                                                            >
                                                                {task.title}
                                                            </Typography>
                                                            <Typography
                                                                className={`usr-dash-task-description ${task.finished ? 'usr-dash-task-description-finished' : ''}`}>
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
                                                                        icon={<Timer/>}
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
                                                            <Visibility/>
                                                        </IconButton>

                                                        <IconButton
                                                            className="usr-dash-action-btn"
                                                            onClick={() => handleOpenComments(task)}
                                                            size="small"
                                                            title="View Comments"
                                                        >
                                                            <ChatBubble/>
                                                        </IconButton>

                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            )}
                        </Paper>
                    )}

                    {/* Analytics Tab */}
                    {currentTab === 1 && (
                        <Box>
                            {analyticsLoading ? (
                                <Paper className="usr-dash-tasks-section">
                                    <Box className="usr-dash-empty-state">
                                        <Typography>Loading analytics...</Typography>
                                    </Box>
                                </Paper>
                            ) : analyticsError ? (
                                <Paper className="usr-dash-tasks-section">
                                    <Box className="usr-dash-empty-state">
                                        <Typography color="error">Failed to load
                                            analytics: {analyticsError}</Typography>
                                    </Box>
                                </Paper>
                            ) : (
                                <Box sx={{display: 'flex', flexDirection: 'column', gap: '32px'}}>

                                    {/* ROW 1: Personal Performance Metrics */}
                                    {personalMetrics && (
                                        <Paper className="usr-dash-progress-card" sx={{padding: '40px !important'}}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                marginBottom: '32px'
                                            }}>
                                                <TrendingUp sx={{color: '#10b981', fontSize: '32px'}}/>
                                                <Typography sx={{
                                                    color: '#ffffff',
                                                    fontSize: '1.75rem',
                                                    fontWeight: 700,
                                                    letterSpacing: '-0.5px'
                                                }}>
                                                    Personal Performance Metrics
                                                </Typography>
                                            </Box>
                                            <Grid container spacing={4}>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Box sx={{
                                                        textAlign: 'center',
                                                        padding: '32px 24px',
                                                        background: 'rgba(16, 185, 129, 0.08)',
                                                        backdropFilter: 'blur(10px)',
                                                        borderRadius: '20px',
                                                        border: '1px solid rgba(16, 185, 129, 0.2)',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-4px)',
                                                            boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)',
                                                            border: '1px solid rgba(16, 185, 129, 0.4)'
                                                        }
                                                    }}>
                                                        <Typography sx={{
                                                            color: 'rgba(255, 255, 255, 0.6)',
                                                            fontSize: '0.875rem',
                                                            marginBottom: '16px',
                                                            fontWeight: 600,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '1px'
                                                        }}>
                                                            Completion Rate
                                                        </Typography>
                                                        <Typography sx={{
                                                            color: '#10b981',
                                                            fontSize: '3.5rem',
                                                            fontWeight: 800,
                                                            lineHeight: 1,
                                                            textShadow: '0 0 30px rgba(16, 185, 129, 0.5)'
                                                        }}>
                                                            {personalMetrics.completionRate?.toFixed(1) ?? '0'}%
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Box sx={{
                                                        textAlign: 'center',
                                                        padding: '32px 24px',
                                                        background: 'rgba(59, 130, 246, 0.08)',
                                                        backdropFilter: 'blur(10px)',
                                                        borderRadius: '20px',
                                                        border: '1px solid rgba(59, 130, 246, 0.2)',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-4px)',
                                                            boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)',
                                                            border: '1px solid rgba(59, 130, 246, 0.4)'
                                                        }
                                                    }}>
                                                        <Typography sx={{
                                                            color: 'rgba(255, 255, 255, 0.6)',
                                                            fontSize: '0.875rem',
                                                            marginBottom: '16px',
                                                            fontWeight: 600,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '1px'
                                                        }}>
                                                            Avg Completion Time
                                                        </Typography>
                                                        <Typography sx={{
                                                            color: '#3b82f6',
                                                            fontSize: '3.5rem',
                                                            fontWeight: 800,
                                                            lineHeight: 1,
                                                            textShadow: '0 0 30px rgba(59, 130, 246, 0.5)'
                                                        }}>
                                                            {personalMetrics.avgCompletionTimeHours?.toFixed(1) ?? 'N/A'}
                                                            {personalMetrics.avgCompletionTimeHours != null && 'h'}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Box sx={{
                                                        textAlign: 'center',
                                                        padding: '32px 24px',
                                                        background: 'rgba(251, 146, 60, 0.08)',
                                                        backdropFilter: 'blur(10px)',
                                                        borderRadius: '20px',
                                                        border: '1px solid rgba(251, 146, 60, 0.2)',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-4px)',
                                                            boxShadow: '0 20px 40px rgba(251, 146, 60, 0.2)',
                                                            border: '1px solid rgba(251, 146, 60, 0.4)'
                                                        }
                                                    }}>
                                                        <Typography sx={{
                                                            color: 'rgba(255, 255, 255, 0.6)',
                                                            fontSize: '0.875rem',
                                                            marginBottom: '16px',
                                                            fontWeight: 600,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '1px'
                                                        }}>
                                                            On-Time Rate
                                                        </Typography>
                                                        <Typography sx={{
                                                            color: '#fb923c',
                                                            fontSize: '3.5rem',
                                                            fontWeight: 800,
                                                            lineHeight: 1,
                                                            textShadow: '0 0 30px rgba(251, 146, 60, 0.5)'
                                                        }}>
                                                            {personalMetrics.onTimeCompletionRate?.toFixed(1) ?? '0'}%
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Box sx={{
                                                        textAlign: 'center',
                                                        padding: '32px 24px',
                                                        background: 'rgba(139, 92, 246, 0.08)',
                                                        backdropFilter: 'blur(10px)',
                                                        borderRadius: '20px',
                                                        border: '1px solid rgba(139, 92, 246, 0.2)',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-4px)',
                                                            boxShadow: '0 20px 40px rgba(139, 92, 246, 0.2)',
                                                            border: '1px solid rgba(139, 92, 246, 0.4)'
                                                        }
                                                    }}>
                                                        <Typography sx={{
                                                            color: 'rgba(255, 255, 255, 0.6)',
                                                            fontSize: '0.875rem',
                                                            marginBottom: '16px',
                                                            fontWeight: 600,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '1px'
                                                        }}>
                                                            Active Tasks
                                                        </Typography>
                                                        <Typography sx={{
                                                            color: '#8b5cf6',
                                                            fontSize: '3.5rem',
                                                            fontWeight: 800,
                                                            lineHeight: 1,
                                                            textShadow: '0 0 30px rgba(139, 92, 246, 0.5)'
                                                        }}>
                                                            {personalMetrics.activeTasks ?? 0}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    )}

                                    {/* ROW 2: Task Status Distribution */}
                                    {taskStats && (
                                        <Paper className="usr-dash-progress-card" sx={{padding: '40px !important'}}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                marginBottom: '32px'
                                            }}>
                                                <CheckCircle sx={{color: '#10b981', fontSize: '32px'}}/>
                                                <Typography sx={{
                                                    color: '#ffffff',
                                                    fontSize: '1.75rem',
                                                    fontWeight: 700,
                                                    letterSpacing: '-0.5px'
                                                }}>
                                                    Task Status Distribution
                                                </Typography>
                                            </Box>
                                            {(() => {
                                                const chartData = [
                                                    {name: 'Completed', value: taskStats.completedTasks || 0},
                                                    {name: 'Pending', value: taskStats.pendingTasks || 0},
                                                    {name: 'Overdue', value: taskStats.overdueTasks || 0}
                                                ].filter(item => item.value > 0);

                                                const hasData = chartData.length > 0 && chartData.some(item => item.value > 0);

                                                return hasData ? (
                                                    <ResponsiveContainer width="100%" height={450}>
                                                        <PieChart>
                                                            <Pie
                                                                data={chartData}
                                                                cx="50%"
                                                                cy="50%"
                                                                innerRadius={110}
                                                                outerRadius={180}
                                                                fill="#8884d8"
                                                                paddingAngle={4}
                                                                dataKey="value"
                                                                nameKey="name"
                                                                label={({
                                                                            name,
                                                                            value,
                                                                            percent
                                                                        }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                                                                labelLine={{
                                                                    stroke: 'rgba(255, 255, 255, 0.5)',
                                                                    strokeWidth: 2
                                                                }}
                                                            >
                                                                {chartData.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`}
                                                                          fill={CHART_COLORS[(index + 1) % CHART_COLORS.length]}/>
                                                                ))}
                                                            </Pie>
                                                            <Tooltip
                                                                contentStyle={{
                                                                    backgroundColor: 'rgba(20, 20, 20, 0.95)',
                                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                                    borderRadius: '12px',
                                                                    color: '#ffffff',
                                                                    padding: '16px',
                                                                    fontSize: '14px',
                                                                    fontWeight: 600
                                                                }}
                                                            />
                                                            <Legend
                                                                wrapperStyle={{paddingTop: '30px'}}
                                                                formatter={(value) => (
                                                                    <span style={{
                                                                        color: '#ffffff',
                                                                        fontSize: '16px',
                                                                        fontWeight: 600
                                                                    }}>
                                                                    {value}
                                                                </span>
                                                                )}
                                                            />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        height: 450,
                                                        color: 'rgba(255, 255, 255, 0.5)'
                                                    }}>
                                                        <Typography variant="h6">
                                                            No task status data available yet
                                                        </Typography>
                                                    </Box>
                                                );
                                            })()}
                                        </Paper>
                                    )}

                                    {/* ROW 3: Priority Distribution */}
                                    {priorityDistribution && priorityDistribution.length > 0 && (
                                        <Paper className="usr-dash-progress-card" sx={{padding: '40px !important'}}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                marginBottom: '32px'
                                            }}>
                                                <PriorityHigh sx={{color: '#ef4444', fontSize: '32px'}}/>
                                                <Typography sx={{
                                                    color: '#ffffff',
                                                    fontSize: '1.75rem',
                                                    fontWeight: 700,
                                                    letterSpacing: '-0.5px'
                                                }}>
                                                    Priority Distribution
                                                </Typography>
                                            </Box>
                                            {(() => {
                                                const chartData = priorityDistribution
                                                    .map(item => ({
                                                        name: item.fieldName,
                                                        value: item.count
                                                    }))
                                                    .filter(item => item.value > 0);

                                                const hasData = chartData.length > 0;

                                                return hasData ? (
                                                    <ResponsiveContainer width="100%" height={450}>
                                                        <PieChart>
                                                            <Pie
                                                                data={chartData}
                                                                cx="50%"
                                                                cy="50%"
                                                                innerRadius={110}
                                                                outerRadius={180}
                                                                fill="#8884d8"
                                                                paddingAngle={4}
                                                                dataKey="value"
                                                                nameKey="name"
                                                                label={({
                                                                            name,
                                                                            value,
                                                                            percent
                                                                        }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                                                                labelLine={{
                                                                    stroke: 'rgba(255, 255, 255, 0.5)',
                                                                    strokeWidth: 2
                                                                }}
                                                            >
                                                                {chartData.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`}
                                                                          fill={CHART_COLORS[index % CHART_COLORS.length]}/>
                                                                ))}
                                                            </Pie>
                                                            <Tooltip
                                                                contentStyle={{
                                                                    backgroundColor: 'rgba(20, 20, 20, 0.95)',
                                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                                    borderRadius: '12px',
                                                                    color: '#ffffff',
                                                                    padding: '16px',
                                                                    fontSize: '14px',
                                                                    fontWeight: 600
                                                                }}
                                                            />
                                                            <Legend
                                                                wrapperStyle={{paddingTop: '30px'}}
                                                                formatter={(value) => (
                                                                    <span style={{
                                                                        color: '#ffffff',
                                                                        fontSize: '16px',
                                                                        fontWeight: 600
                                                                    }}>
                                                                    {value}
                                                                </span>
                                                                )}
                                                            />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        height: 450,
                                                        color: 'rgba(255, 255, 255, 0.5)'
                                                    }}>
                                                        <Typography variant="h6">
                                                            No priority distribution data available yet
                                                        </Typography>
                                                    </Box>
                                                );
                                            })()}
                                        </Paper>
                                    )}

                                    {/* ROW 4: Task Completion Trend */}
                                    {taskTrend && taskTrend.length > 0 && (
                                        <Paper className="usr-dash-progress-card" sx={{padding: '40px !important'}}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                marginBottom: '32px'
                                            }}>
                                                <Schedule sx={{color: '#3b82f6', fontSize: '32px'}}/>
                                                <Typography sx={{
                                                    color: '#ffffff',
                                                    fontSize: '1.75rem',
                                                    fontWeight: 700,
                                                    letterSpacing: '-0.5px'
                                                }}>
                                                    Task Completion Trend (Last 7 Days)
                                                </Typography>
                                            </Box>
                                            <ResponsiveContainer width="100%" height={450}>
                                                <LineChart data={taskTrend}>
                                                    <defs>
                                                        <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3"
                                                                   stroke="rgba(255, 255, 255, 0.1)"/>
                                                    <XAxis
                                                        dataKey="date"
                                                        stroke="rgba(255, 255, 255, 0.5)"
                                                        tick={{fill: 'rgba(255, 255, 255, 0.7)', fontSize: 13}}
                                                        tickLine={{stroke: 'rgba(255, 255, 255, 0.3)'}}
                                                    />
                                                    <YAxis
                                                        stroke="rgba(255, 255, 255, 0.5)"
                                                        tick={{fill: 'rgba(255, 255, 255, 0.7)', fontSize: 13}}
                                                        tickLine={{stroke: 'rgba(255, 255, 255, 0.3)'}}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: 'rgba(20, 20, 20, 0.95)',
                                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                                            borderRadius: '12px',
                                                            color: '#ffffff',
                                                            padding: '16px',
                                                            fontSize: '14px',
                                                            fontWeight: 600
                                                        }}
                                                        labelStyle={{color: '#10b981', fontWeight: 700}}
                                                    />
                                                    <Legend
                                                        wrapperStyle={{paddingTop: '20px'}}
                                                        formatter={() => (
                                                            <span style={{
                                                                color: '#ffffff',
                                                                fontSize: '16px',
                                                                fontWeight: 600
                                                            }}>
                                                            Tasks Completed
                                                        </span>
                                                        )}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="count"
                                                        stroke="#10b981"
                                                        strokeWidth={4}
                                                        fill="url(#colorTrend)"
                                                        dot={{fill: '#10b981', r: 7, strokeWidth: 2, stroke: '#0a0a0a'}}
                                                        activeDot={{r: 10, strokeWidth: 3, stroke: '#10b981'}}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </Paper>
                                    )}

                                </Box>
                            )}
                        </Box>
                    )}
                </Container>

                {/* Task View Dialog */}
                <TaskView
                    open={openTaskView}
                    onClose={() => setOpenTaskView(false)}
                    task={viewingTask}
                    onEdit={() => {
                    }}
                />

                {/* Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({...snackbar, open: false})}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                >
                    <Alert
                        onClose={() => setSnackbar({...snackbar, open: false})}
                        severity={snackbar.severity}
                        variant="filled"
                        className="usr-dash-snackbar"
                        sx={{borderRadius: '12px'}}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>

                <CommentList
                    open={openCommentsModal}
                    onClose={handleCloseComments}
                    taskId={selectedTaskForComments?.id}
                    taskTitle={selectedTaskForComments?.title}
                />

            </Box>

        </>
    );
};

export default UserDashboard;