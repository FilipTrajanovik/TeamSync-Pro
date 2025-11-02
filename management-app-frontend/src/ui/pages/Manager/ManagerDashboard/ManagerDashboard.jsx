import React, {useEffect, useState} from 'react';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    Grid,
    IconButton,
    LinearProgress,
    Paper,
    Snackbar,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Typography
} from '@mui/material';
import {
    Add,
    Assignment,
    CheckCircle,
    Delete,
    Edit,
    People,
    PersonAdd,
    PersonOutline,
    Schedule,
    TrendingUp,
    Settings
} from '@mui/icons-material';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';
import ClientCreate from '../../../components/Client/ClientCreate/ClientCreate.jsx'
import TaskCreate from '../../../components/Task/TaskCreate/TaskCreate.jsx';
import UserCreate from '../../../components/Users/UserCreate/UserCreate.jsx';
import {useAuth} from '../../../../hooks/useAuth.js';

import useMyClients from '../../../../hooks/useMyClients.js'
import useTasks from '../../../../hooks/useTasks.js';
import useUsers from '../../../../hooks/useUsers.js';
import useMyOrganizations from '../../../../hooks/useMyOrganizations.js';
import ThemeToggle from '../../../components/ThemeToggle/ThemeToggle.jsx';
import useMyUsers from "../../../../hooks/useMyUsers.js";
import {useNavigate} from "react-router-dom";
import './ManagerDashboard.css'
import useSearchFilter from '../../../../hooks/useSearchFilter.js'
import SearchFilter from '../../../components/SearchFilter/SearchFilter.jsx'
import useManagerAnalytics from '../../../../hooks/useManagerAnalytics.js';

const ManagerDashboard = () => {
    const [activeTab, setActiveTab] = useState(0);
    const {user} = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        console.log('=== MANAGER DASHBOARD USER DEBUG ===');
        console.log('User object:', user);
        console.log('User organizations:', user?.organizations);
        console.log('First org:', user?.organizations?.[0]);
    }, [user]);




    const {
        clients,
        loading: clientsLoading,
        onAdd: addClient,
        onEdit: editClient,
        onDelete: deleteClient,
        fetchClientsByOrganization
    } = useMyClients();
    const {tasks, loading: tasksLoading, onAdd: addTask, onEdit: editTask, onDelete: deleteTask} = useTasks();
    const {onAdd: addUser, onEdit: editUser, onDelete: deleteUser, fetchUsersByOrganization} = useUsers();
    const {users, loading: usersLoading, fetchMyUsers} = useMyUsers();
    const {organizations, loading: orgsLoading} = useMyOrganizations();
    const managerOrganizationId = organizations.length > 0 ? organizations[0].id : null;
    const [stats, setStats] = useState({
        totalClients: 0,
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0,
        totalUsers: 0
    });

    const [openTaskDialog, setOpenTaskDialog] = useState(false);
    const [openClientDialog, setOpenClientDialog] = useState(false);
    const [openUserDialog, setOpenUserDialog] = useState(false);

    const [editingTask, setEditingTask] = useState(null);
    const [editingClient, setEditingClient] = useState(null);
    const [editingUser, setEditingUser] = useState(null);

    const [menuOpen, setMenuOpen] = useState(false);

    const [snackbar, setSnackbar] = useState({open: false, message: '', severity: 'success'});
    const loading = clientsLoading || tasksLoading || usersLoading || orgsLoading;


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
        filterableFields: ['status', 'priority', 'assignedUser'],
        defaultSortBy: 'DATE_DESC'
    });

    // USERS FILTER
    const {
        filteredData: filteredUsers,
        searchTerm: userSearchTerm,
        filters: userFilters,
        sortBy: userSortBy,
        handleSearchChange: handleUserSearchChange,
        handleFilterChange: handleUserFilterChange,
        handleSortChange: handleUserSortChange,
        clearFilters: clearUserFilters,
        activeFiltersCount: userActiveFiltersCount,
        resultCount: userResultCount,
        totalCount: userTotalCount
    } = useSearchFilter(users, {
        searchFields: ['name', 'username', 'email'],
        filterableFields: ['role'],  // Filter by role
        defaultSortBy: 'DATE_DESC'
    });

    // CLIENTS FILTER
    const {
        filteredData: filteredClients,
        searchTerm: clientSearchTerm,
        filters: clientFilters,
        sortBy: clientSortBy,
        handleSearchChange: handleClientSearchChange,
        handleFilterChange: handleClientFilterChange,
        handleSortChange: handleClientSortChange,
        clearFilters: clearClientFilters,
        activeFiltersCount: clientActiveFiltersCount,
        resultCount: clientResultCount,
        totalCount: clientTotalCount
    } = useSearchFilter(clients, {
        searchFields: ['firstName', 'lastName', 'email', 'phoneNumber'],
        filterableFields: [],  // No filters, just search
        defaultSortBy: 'DATE_DESC'
    });

    useEffect(() => {
        if (!tasksLoading && !clientsLoading && !usersLoading) {
            const pending = tasks.filter(t => t.status === 'PENDING').length;
            const completed = tasks.filter(t => t.status === 'COMPLETED').length;

            setStats({
                totalClients: clients.length,
                totalTasks: tasks.length,
                pendingTasks: pending,
                completedTasks: completed,
                totalUsers: users.length
            });
        }
    }, [tasks, clients, users, tasksLoading, clientsLoading, usersLoading]);

    useEffect(() => {
        if (managerOrganizationId) {
            console.log('Fetching data for organization:', managerOrganizationId);
            fetchMyUsers(managerOrganizationId);
            fetchClientsByOrganization(managerOrganizationId);
        }
    }, [managerOrganizationId, fetchMyUsers, fetchClientsByOrganization]);

    const {
        taskStats: analyticsTaskStats,
        priorityDistribution,
        taskTrend,
        clientTaskDistribution,
        loading: analyticsLoading,
        error: analyticsError,
        fetchAllData: fetchAnalytics
    } = useManagerAnalytics();

    // Replace the existing analytics useEffect with this:
    useEffect(() => {
        console.log('🔍 Analytics useEffect triggered');
        console.log('📦 managerOrganizationId:', managerOrganizationId);
        console.log('📦 organizations:', organizations);
        console.log('📦 user:', user);

        if (managerOrganizationId) {
            console.log('✅ Fetching analytics for org:', managerOrganizationId);
            fetchAnalytics(managerOrganizationId, 30);
        } else {
            console.warn('⚠️ No managerOrganizationId available yet');
        }
    }, [managerOrganizationId, fetchAnalytics]);

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({open: true, message, severity});
    };

    const handleCloseSnackbar = () => {
        setSnackbar({...snackbar, open: false});
    };

    const handleOpenTaskDialog = (task = null) => {
        setEditingTask(task);
        setOpenTaskDialog(true);
    };

    const handleTaskSubmit = async (taskData) => {
        try {
            // ✅ Clean and format the task data properly
            const taskDataWithOrg = {
                title: taskData.title,
                description: taskData.description,
                status: taskData.status || 'PENDING',
                priority: taskData.priority || 'MEDIUM',
                dueDate: taskData.dueDate ? `${taskData.dueDate}T00:00:00` : null,  // ✅ Convert to LocalDateTime format
                completedDate: null,  // ✅ Add this field
                clientId: taskData.clientId || null,  // ✅ Convert empty string to null
                assignedToUserId: taskData.assignedToUserId || null,  // ✅ Convert empty string to null
                organizationId: taskData.organizationId || managerOrganizationId,
                finished: false
            };

            console.log('=== TASK SUBMIT DEBUG ===');
            console.log('📤 Original taskData:', taskData);
            console.log('📤 Cleaned taskDataWithOrg:', taskDataWithOrg);
            console.log('📤 Required fields:');
            console.log('  ✅ title:', taskDataWithOrg.title);
            console.log('  ✅ description:', taskDataWithOrg.description);
            console.log('  ✅ clientId:', taskDataWithOrg.clientId);
            console.log('  ✅ assignedToUserId:', taskDataWithOrg.assignedToUserId);
            console.log('  ✅ organizationId:', taskDataWithOrg.organizationId);
            console.log('  ✅ dueDate:', taskDataWithOrg.dueDate);

            if (editingTask) {
                await editTask(editingTask.id, taskDataWithOrg);
                showSnackbar('Task updated successfully');
            } else {
                await addTask(taskDataWithOrg);
                showSnackbar('Task created successfully');
            }

            setOpenTaskDialog(false);
            setEditingTask(null);

        } catch (error) {
            console.error('❌ Task submit error:', error);
            console.error('❌ Error response:', error.response);
            console.error('❌ Error data:', error.response?.data);
            console.error('❌ Error status:', error.response?.status);

            showSnackbar(
                `Failed to ${editingTask ? 'update' : 'create'} task: ${error.response?.data?.message || error.message}`,
                'error'
            );
        }
    };

    const handleDeleteTask = (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            deleteTask(id);
            showSnackbar('Task deleted successfully');
        }
    };

    const handleOpenClientDialog = (client = null) => {
        setEditingClient(client);
        setOpenClientDialog(true);
    };

    const handleClientSubmit = async (clientData) => {
        try {
            console.log('📤 Submitting client data:', clientData);

            if (editingClient) {
                await editClient(editingClient.id, clientData);
                showSnackbar('Client updated successfully');
            } else {
                await addClient(clientData);
                showSnackbar('Client added successfully');
            }

            // ✅ No need to manually refresh - it's automatic now!
            setOpenClientDialog(false);
            setEditingClient(null);

        } catch (error) {
            console.error('❌ Client submit error:', error);
            showSnackbar('Failed to save client: ' + error.message, 'error');
        }
    };
    const handleDeleteClient = (id) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            deleteClient(id);
            showSnackbar('Client deleted successfully');
        }
    };

    const handleOpenUserDialog = (user = null) => {
        setEditingUser(user);
        setOpenUserDialog(true);
    };

    const handleUserSubmit = async (userData) => {
        try {
            const userDataWithOrg = {
                ...userData,
                organizationId: userData.organizationId || managerOrganizationId
            };

            console.log('📤 Submitting user data:', userDataWithOrg);

            if (editingUser) {
                await editUser(editingUser.id, userDataWithOrg);
            } else {
                await addUser(userDataWithOrg);
            }


            if (managerOrganizationId) {
                await fetchMyUsers(managerOrganizationId);
            }

            showSnackbar(editingUser ? 'User updated successfully' : 'User added successfully');
            setOpenUserDialog(false);
            setEditingUser(null);

        } catch (error) {
            console.error('❌ User submit error:', error);
            console.error('Error response:', error.response?.data);
            showSnackbar(
                `Failed to ${editingUser ? 'update' : 'add'} user: ${error.response?.data?.message || error.message}`,
                'error'
            );
        }
    };

    const handleDeleteUser = (id) => {
        if (window.confirm('Are you sure you want to remove this team member?')) {
            deleteUser(id);
            showSnackbar('Team member removed successfully');
        }
    };

    const StatCard = ({title, value, subtitle, icon, color, trend}) => (
        <Card
            elevation={0}
            sx={{
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                }
            }}
        >
            <CardContent sx={{p: 3}}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box flex={1}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={500}
                            mb={1}
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="h3"
                            fontWeight={700}
                            sx={{mb: 0.5, color: color}}
                        >
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Avatar
                        sx={{
                            bgcolor: `${color}15`,
                            color: color,
                            width: 56,
                            height: 56
                        }}
                    >
                        {icon}
                    </Avatar>
                </Box>
                {trend && (
                    <Box display="flex" alignItems="center" mt={2} gap={0.5}>
                        <TrendingUp sx={{fontSize: 16, color: 'success.main'}}/>
                        <Typography variant="caption" color="success.main" fontWeight={600}>
                            {trend}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            vs last month
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'success';
            case 'IN_PROGRESS':
                return 'info';
            case 'PENDING':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'URGENT':
                return 'error';
            case 'HIGH':
                return 'warning';
            case 'MEDIUM':
                return 'info';
            case 'LOW':
                return 'default';
            default:
                return 'default';
        }
    };

    const getUserTaskStats = (userId) => {
        const userTasks = tasks.filter(t => t.assignedToUserId === userId);
        const completed = userTasks.filter(t => t.status === 'COMPLETED').length;
        return {total: userTasks.length, completed};
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <LinearProgress sx={{width: '50%'}}/>
            </Box>
        );
    }

    return (
        <Box className="manager-dashboard-apple">
            {/* Hover Trigger Zone - Left edge */}
            <Box
                className="menu-trigger-zone"
                onMouseEnter={() => setMenuOpen(true)}
            />

            {/* Slide-out Menu */}
            <Box
                className={`slide-menu ${menuOpen ? 'open' : ''}`}
                onMouseLeave={() => setMenuOpen(false)}
            >
                {/* Menu Header */}
                <Box className="menu-header">
                    <Avatar className="menu-user-avatar">
                        {user?.name?.[0]}{user?.surname?.[0]}
                    </Avatar>
                    <Box>
                        <Typography className="menu-user-name">
                            {user?.name} {user?.surname}
                        </Typography>
                        <Typography className="menu-user-role">
                            Manager
                        </Typography>
                    </Box>
                </Box>

                <Divider className="menu-divider" />

                {/* Quick Stats */}
                <Box className="menu-stats">
                    <Box className="menu-stat-item">
                        <Assignment className="menu-stat-icon tasks-icon" />
                        <Box>
                            <Typography className="menu-stat-value">{stats.totalTasks}</Typography>
                            <Typography className="menu-stat-label">Tasks</Typography>
                        </Box>
                    </Box>
                    <Box className="menu-stat-item">
                        <People className="menu-stat-icon users-icon" />
                        <Box>
                            <Typography className="menu-stat-value">{stats.totalUsers}</Typography>
                            <Typography className="menu-stat-label">Users</Typography>
                        </Box>
                    </Box>
                    <Box className="menu-stat-item">
                        <PersonOutline className="menu-stat-icon clients-icon" />
                        <Box>
                            <Typography className="menu-stat-value">{stats.totalClients}</Typography>
                            <Typography className="menu-stat-label">Clients</Typography>
                        </Box>
                    </Box>
                    <Box className="menu-stat-item">
                        <CheckCircle className="menu-stat-icon progress-icon" />
                        <Box>
                            <Typography className="menu-stat-value">
                                {stats.totalTasks > 0
                                    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
                                    : 0}%
                            </Typography>
                            <Typography className="menu-stat-label">Done</Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider className="menu-divider" />

                {/* Navigation */}
                <Box className="menu-navigation">
                    <Button
                        fullWidth
                        className={`menu-nav-button ${activeTab === 0 ? 'active' : ''}`}
                        startIcon={<Assignment />}
                        onClick={() => {
                            setActiveTab(0);
                            setMenuOpen(false);
                        }}
                    >
                        Tasks
                    </Button>
                    <Button
                        fullWidth
                        className={`menu-nav-button ${activeTab === 1 ? 'active' : ''}`}
                        startIcon={<PersonOutline />}
                        onClick={() => {
                            setActiveTab(1);
                            setMenuOpen(false);
                        }}
                    >
                        Clients
                    </Button>
                    <Button
                        fullWidth
                        className={`menu-nav-button ${activeTab === 2 ? 'active' : ''}`}
                        startIcon={<People />}
                        onClick={() => {
                            setActiveTab(2);
                            setMenuOpen(false);
                        }}
                    >
                        Team
                    </Button>
                    <Button
                        fullWidth
                        className={`menu-nav-button ${activeTab === 3 ? 'active' : ''}`}
                        startIcon={<Settings />}
                        onClick={() => {
                            setActiveTab(3);
                            setMenuOpen(false);
                        }}
                    >
                        Organization
                    </Button>
                    <Button
                        fullWidth
                        className={`menu-nav-button ${activeTab === 4 ? 'active' : ''}`}
                        startIcon={<TrendingUp />}
                        onClick={() => {
                            setActiveTab(4);
                            setMenuOpen(false);
                        }}
                    >
                        Analytics
                    </Button>
                </Box>
            </Box>

            {/* Main Content Area */}
            <Box className="main-content-apple">
                <Container maxWidth="xl" sx={{ py: 4 }}>
                    {/* Tasks Tab */}
                    {activeTab === 0 && (
                        <Box>
                            <Box className="content-header-apple">
                                <Box>
                                    <Typography className="content-title-apple">
                                        Task Management
                                    </Typography>
                                    <Typography className="content-subtitle-apple">
                                        {stats.totalTasks} tasks · {stats.completedTasks} completed · {stats.pendingTasks} pending
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    onClick={() => handleOpenTaskDialog()}
                                    className="action-button-apple"
                                >
                                    New Task
                                </Button>
                            </Box>

                            <Box>
                                {/* Tasks Section */}
                                <SearchFilter
                                    searchTerm={searchTerm}
                                    searchPlaceholder="Search tasks..."
                                    onSearchChange={handleSearchChange}
                                    filters={filters}
                                    filterOptions={{
                                        status: [
                                            { value: 'ALL', label: 'All Status' },
                                            { value: 'PENDING', label: 'Pending' },
                                            { value: 'IN_PROGRESS', label: 'In Progress' },
                                            { value: 'COMPLETED', label: 'Completed' }
                                        ],
                                        priority: [
                                            { value: 'ALL', label: 'All Priority' },
                                            { value: 'LOW', label: 'Low' },
                                            { value: 'MEDIUM', label: 'Medium' },
                                            { value: 'HIGH', label: 'High' }
                                        ],
                                        assignedUser: [
                                            { value: 'ALL', label: 'All Users' },
                                            ...users
                                                .filter(user => user && user.id)
                                                .map(user => ({
                                                value: user.id.toString(),
                                                label: user.name
                                            }))
                                        ]
                                    }}
                                    onFilterChange={handleFilterChange}
                                    sortBy={sortBy}
                                    sortOptions={[
                                        { value: 'DATE_DESC', label: 'Newest First' },
                                        { value: 'PRIORITY_DESC', label: 'High Priority First' }
                                    ]}
                                    onSortChange={handleSortChange}
                                    onClearFilters={clearFilters}
                                    activeFiltersCount={activeFiltersCount}
                                    resultCount={resultCount}
                                    totalCount={totalCount}
                                />

                                {/* Display filteredTasks instead of tasks */}

                            </Box>


                            {tasksLoading ? (
                                <Box className="loading-container-apple">
                                    <Typography className="loading-text-apple">Loading tasks...</Typography>
                                </Box>
                            ) : filteredTasks.length === 0 ? (
                                <Box className="empty-state-apple">
                                    <Assignment className="empty-icon-apple" />
                                    <Typography className="empty-title-apple">No tasks yet</Typography>
                                    <Typography className="empty-text-apple">
                                        Create your first task to get started
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<Add />}
                                        onClick={() => handleOpenTaskDialog()}
                                        className="action-button-apple"
                                        sx={{ mt: 3 }}
                                    >
                                        Create Task
                                    </Button>
                                </Box>
                            ) : (
                                <TableContainer component={Paper} className="content-table-apple">
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Task</TableCell>
                                                <TableCell>Assigned To</TableCell>
                                                <TableCell>Client</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Priority</TableCell>
                                                <TableCell>Due Date</TableCell>
                                                <TableCell align="right">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredTasks.map((task) => {
                                                const assignedUser = users.find(u => u.username === task.assignedToUserId);
                                                const client = clients.find(c => c.id === task.clientId);
                                                return (
                                                    <TableRow key={task.id}>
                                                        <TableCell>
                                                            <Typography className="table-cell-title-apple">
                                                                {task.title}
                                                            </Typography>
                                                            <Typography className="table-cell-subtitle-apple">
                                                                {task.description?.substring(0, 50)}...
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            {assignedUser ? (
                                                                <Box display="flex" alignItems="center" gap={1}>
                                                                    <Avatar className="table-avatar-apple">
                                                                        {assignedUser.name[0]}{assignedUser.surname[0]}
                                                                    </Avatar>
                                                                    <Typography className="table-user-name-apple">
                                                                        {assignedUser.name} {assignedUser.surname}
                                                                    </Typography>
                                                                </Box>
                                                            ) : (
                                                                <Typography className="table-unassigned-apple">Unassigned</Typography>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography className="table-text-apple">
                                                                {client ? client.firstName : '—'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={task.status}
                                                                size="small"
                                                                className={`status-chip-apple ${task.status.toLowerCase()}`}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={task.priority}
                                                                size="small"
                                                                className={`priority-chip-apple ${task.priority.toLowerCase()}`}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography className="table-date-apple">
                                                                {task.dueDate
                                                                    ? new Date(task.dueDate).toLocaleDateString()
                                                                    : '—'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleOpenTaskDialog(task)}
                                                                className="table-action-button-apple edit"
                                                            >
                                                                <Edit fontSize="small" />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleDeleteTask(task.id)}
                                                                className="table-action-button-apple delete"
                                                            >
                                                                <Delete fontSize="small" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Box>
                    )}

                    {/* Clients Tab */}
                    {activeTab === 1 && (
                        <Box>
                            <Box className="content-header-apple">
                                <Box>
                                    <Typography className="content-title-apple">
                                        Clients
                                    </Typography>
                                    <Typography className="content-subtitle-apple">
                                        {stats.totalClients} total clients
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    onClick={() => handleOpenClientDialog()}
                                    className="action-button-apple"
                                >
                                    New Client
                                </Button>
                            </Box>

                            <SearchFilter
                                searchTerm={clientSearchTerm}
                                searchPlaceholder="Search clients by name, email, phone..."
                                onSearchChange={handleClientSearchChange}
                                filters={clientFilters}
                                filterOptions={{}}  // No filters, just search
                                onFilterChange={handleClientFilterChange}
                                sortBy={clientSortBy}
                                sortOptions={[
                                    { value: 'DATE_DESC', label: 'Newest First' },
                                    { value: 'DATE_ASC', label: 'Oldest First' },
                                    { value: 'TITLE_ASC', label: 'Name A-Z' },
                                    { value: 'TITLE_DESC', label: 'Name Z-A' }
                                ]}
                                onSortChange={handleClientSortChange}
                                onClearFilters={clearClientFilters}
                                activeFiltersCount={clientActiveFiltersCount}
                                resultCount={clientResultCount}
                                totalCount={clientTotalCount}
                                showFilters={false}  // Hide filter dropdowns
                            />

                            {clientsLoading ? (
                                <Box className="loading-container-apple">
                                    <Typography className="loading-text-apple">Loading clients...</Typography>
                                </Box>
                            ) : filteredClients.length === 0 ? (
                                <Box className="empty-state-apple">
                                    <PersonOutline className="empty-icon-apple" />
                                    <Typography className="empty-title-apple">No clients yet</Typography>
                                    <Typography className="empty-text-apple">
                                        Add your first client to get started
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<Add />}
                                        onClick={() => handleOpenClientDialog()}
                                        className="action-button-apple"
                                        sx={{ mt: 3 }}
                                    >
                                        Add Client
                                    </Button>
                                </Box>
                            ) : (
                                <Grid container spacing={3}>
                                    {filteredClients.map((client) => {
                                        const clientTasks = tasks.filter(t => t.clientId === client.id);
                                        const completedTasks = clientTasks.filter(t => t.status === 'COMPLETED').length;
                                        const progressPercentage = clientTasks.length > 0
                                            ? Math.round((completedTasks / clientTasks.length) * 100)
                                            : 0;

                                        return (
                                            <Grid item xs={12} md={6} lg={4} key={client.id}>
                                                <Card className="item-card-apple">
                                                    <CardContent sx={{ p: 3 }}>
                                                        <Box className="item-card-header-apple">
                                                            <Avatar className="item-avatar-apple client">
                                                                {client.firstName}
                                                            </Avatar>
                                                            <Box className="item-card-actions-apple">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleOpenClientDialog(client)}
                                                                    className="card-action-button-apple"
                                                                >
                                                                    <Edit fontSize="small" />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleDeleteClient(client.id)}
                                                                    className="card-action-button-apple delete"
                                                                >
                                                                    <Delete fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                        </Box>
                                                        <Typography className="item-card-title-apple">
                                                            {client.firstName}
                                                        </Typography>
                                                        <Typography className="item-card-subtitle-apple">
                                                            {client.email}
                                                        </Typography>
                                                        <Divider sx={{ my: 2 }} className="divider-apple" />
                                                        <Box>
                                                            <Box className="progress-label-apple">
                                                                <Typography className="progress-label-text-apple">
                                                                    Progress
                                                                </Typography>
                                                                <Typography className="progress-label-value-apple">
                                                                    {progressPercentage}%
                                                                </Typography>
                                                            </Box>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={progressPercentage}
                                                                className="progress-bar-apple"
                                                            />
                                                            <Typography className="progress-detail-apple">
                                                                {completedTasks} of {clientTasks.length} tasks
                                                            </Typography>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            )}
                        </Box>
                    )}

                    {/* Users Tab */}
                    {activeTab === 2 && (
                        <Box>
                            <Box className="content-header-apple">
                                <Box>
                                    <Typography className="content-title-apple">
                                        Team
                                    </Typography>
                                    <Typography className="content-subtitle-apple">
                                        {stats.totalUsers} team members
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    startIcon={<PersonAdd />}
                                    onClick={() => handleOpenUserDialog()}
                                    className="action-button-apple"
                                >
                                    Add Member
                                </Button>
                            </Box>


                            <SearchFilter
                                searchTerm={userSearchTerm}
                                searchPlaceholder="Search team members by name, username, email..."
                                onSearchChange={handleUserSearchChange}
                                filters={userFilters}
                                filterOptions={{
                                    role: [
                                        { value: 'ALL', label: 'All Roles' },
                                        { value: 'MANAGER', label: 'Manager' },
                                        { value: 'USER', label: 'User' }
                                    ]
                                }}
                                onFilterChange={handleUserFilterChange}
                                sortBy={userSortBy}
                                sortOptions={[
                                    { value: 'DATE_DESC', label: 'Newest First' },
                                    { value: 'DATE_ASC', label: 'Oldest First' },
                                    { value: 'TITLE_ASC', label: 'Name A-Z' },
                                    { value: 'TITLE_DESC', label: 'Name Z-A' }
                                ]}
                                onSortChange={handleUserSortChange}
                                onClearFilters={clearUserFilters}
                                activeFiltersCount={userActiveFiltersCount}
                                resultCount={userResultCount}
                                totalCount={userTotalCount}
                            />

                            {usersLoading ? (
                                <Box className="loading-container-apple">
                                    <Typography className="loading-text-apple">Loading team...</Typography>
                                </Box>
                            ) : filteredUsers.length === 0 ? (
                                <Box className="empty-state-apple">
                                    <People className="empty-icon-apple" />
                                    <Typography className="empty-title-apple">No team members yet</Typography>
                                    <Typography className="empty-text-apple">
                                        Build your team by adding members
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<PersonAdd />}
                                        onClick={() => handleOpenUserDialog()}
                                        className="action-button-apple"
                                        sx={{ mt: 3 }}
                                    >
                                        Add Team Member
                                    </Button>
                                </Box>
                            ) : (
                                <Grid container spacing={3}>
                                    {filteredUsers.map((user) => {
                                        const userTasks = tasks.filter(t => t.assignedToUserId === user.id);
                                        const taskStats = {
                                            total: userTasks.length,
                                            completed: userTasks.filter(t => t.status === 'COMPLETED').length
                                        };

                                        return (
                                            <Grid item xs={12} md={6} lg={4} key={user.id}>
                                                <Card className="item-card-apple">
                                                    <CardContent sx={{ p: 3 }}>
                                                        <Box className="item-card-header-apple">
                                                            <Avatar className="item-avatar-apple user">
                                                                {user.name[0]}{user.surname[0]}
                                                            </Avatar>
                                                            <Box className="item-card-actions-apple">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleOpenUserDialog(user)}
                                                                    className="card-action-button-apple"
                                                                >
                                                                    <Edit fontSize="small" />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleDeleteUser(user.id)}
                                                                    className="card-action-button-apple delete"
                                                                >
                                                                    <Delete fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                        </Box>
                                                        <Typography className="item-card-title-apple">
                                                            {user.name} {user.surname}
                                                        </Typography>
                                                        <Typography className="item-card-subtitle-apple">
                                                            @{user.username}
                                                        </Typography>
                                                        <Chip
                                                            label={user.role}
                                                            size="small"
                                                            className="role-chip-apple"
                                                            sx={{ mt: 1 }}
                                                        />
                                                        <Divider sx={{ my: 2 }} className="divider-apple" />
                                                        <Box>
                                                            <Box className="progress-label-apple">
                                                                <Typography className="progress-label-text-apple">
                                                                    Progress
                                                                </Typography>
                                                                <Typography className="progress-label-value-apple">
                                                                    {taskStats.total > 0
                                                                        ? Math.round((taskStats.completed / taskStats.total) * 100)
                                                                        : 0}%
                                                                </Typography>
                                                            </Box>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0}
                                                                className="progress-bar-apple"
                                                            />
                                                            <Typography className="progress-detail-apple">
                                                                {taskStats.completed} of {taskStats.total} tasks
                                                            </Typography>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            )}
                        </Box>
                    )}

                    {/* Organization Tab */}
                    {activeTab === 3 && (
                        <Box>
                            <Box className="content-header-apple">
                                <Box>
                                    <Typography className="content-title-apple">
                                        Organization
                                    </Typography>
                                    <Typography className="content-subtitle-apple">
                                        Manage your organization settings
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    startIcon={<Settings />}
                                    onClick={() => navigate(`/manager/edit-organization`)}
                                    className="action-button-apple"
                                >
                                    Edit
                                </Button>
                            </Box>

                            {orgsLoading ? (
                                <Box className="loading-container-apple">
                                    <Typography className="loading-text-apple">Loading...</Typography>
                                </Box>
                            ) : organizations.length === 0 ? (
                                <Box className="empty-state-apple">
                                    <Settings className="empty-icon-apple" />
                                    <Typography className="empty-title-apple">No organization found</Typography>
                                </Box>
                            ) : (
                                <Card className="org-info-card-apple">
                                    <CardContent sx={{ p: 4 }}>
                                        <Box display="flex" alignItems="center" gap={3} mb={3}>
                                            <Avatar className="org-avatar-apple">
                                                {organizations[0].name[0]}
                                            </Avatar>
                                            <Box>
                                                <Typography className="org-name-apple">
                                                    {organizations[0].name}
                                                </Typography>
                                                <Chip
                                                    label={organizations[0].type}
                                                    className="org-type-chip-apple"
                                                    size="small"
                                                />
                                            </Box>
                                        </Box>

                                        <Divider className="divider-apple" sx={{ mb: 3 }} />

                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <Typography className="org-label-apple">Description</Typography>
                                                <Typography className="org-value-apple">
                                                    {organizations[0].description || '—'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Typography className="org-label-apple">Email</Typography>
                                                <Typography className="org-value-apple">
                                                    {organizations[0].contactEmail}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Typography className="org-label-apple">Phone</Typography>
                                                <Typography className="org-value-apple">
                                                    {organizations[0].contactPhone || '—'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography className="org-label-apple">Address</Typography>
                                                <Typography className="org-value-apple">
                                                    {organizations[0].address || '—'}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            )}
                        </Box>
                    )}

                    {/* Analytics Tab - IMPROVED DESIGN */}
                    {activeTab === 4 && (
                        <Box>
                            <Box className="content-header-apple">
                                <Box>
                                    <Typography className="content-title-apple">
                                        Analytics Dashboard
                                    </Typography>
                                    <Typography className="content-subtitle-apple">
                                        Performance insights and trends for your organization
                                    </Typography>
                                </Box>
                            </Box>

                            {analyticsLoading ? (
                                <Box className="loading-container-apple">
                                    <Typography className="loading-text-apple">Loading analytics...</Typography>
                                </Box>
                            ) : analyticsError ? (
                                <Box className="empty-state-apple">
                                    <Typography className="empty-title-apple">Error loading analytics</Typography>
                                    <Typography className="empty-text-apple">{analyticsError}</Typography>
                                </Box>
                            ) : (
                                <>
                                    {/* Task Stats Cards - 4 Cards in a Row */}
                                    <Grid container spacing={2} sx={{ mb: 4 }}>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Card className="analytics-card-apple">
                                                <CardContent sx={{ p: 2.5 }}>
                                                    <Box display="flex" alignItems="center" gap={2}>
                                                        <Box
                                                            sx={{
                                                                width: 48,
                                                                height: 48,
                                                                borderRadius: '12px',
                                                                background: 'rgba(255, 255, 255, 0.1)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            <Assignment sx={{ color: '#fff', fontSize: 24 }} />
                                                        </Box>
                                                        <Box flex={1}>
                                                            <Typography className="analytics-card-title-apple">Total</Typography>
                                                            <Typography className="analytics-card-value-apple" sx={{ fontSize: '2rem !important' }}>
                                                                {analyticsTaskStats?.total || 0}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={3}>
                                            <Card className="analytics-card-apple">
                                                <CardContent sx={{ p: 2.5 }}>
                                                    <Box display="flex" alignItems="center" gap={2}>
                                                        <Box
                                                            sx={{
                                                                width: 48,
                                                                height: 48,
                                                                borderRadius: '12px',
                                                                background: 'rgba(16, 185, 129, 0.15)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            <CheckCircle sx={{ color: '#10b981', fontSize: 24 }} />
                                                        </Box>
                                                        <Box flex={1}>
                                                            <Typography className="analytics-card-title-apple">Completed</Typography>
                                                            <Typography className="analytics-card-value-apple" sx={{ fontSize: '2rem !important', color: '#10b981 !important' }}>
                                                                {analyticsTaskStats?.completed || 0}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={3}>
                                            <Card className="analytics-card-apple">
                                                <CardContent sx={{ p: 2.5 }}>
                                                    <Box display="flex" alignItems="center" gap={2}>
                                                        <Box
                                                            sx={{
                                                                width: 48,
                                                                height: 48,
                                                                borderRadius: '12px',
                                                                background: 'rgba(59, 130, 246, 0.15)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            <Schedule sx={{ color: '#3b82f6', fontSize: 24 }} />
                                                        </Box>
                                                        <Box flex={1}>
                                                            <Typography className="analytics-card-title-apple">Pending</Typography>
                                                            <Typography className="analytics-card-value-apple" sx={{ fontSize: '2rem !important', color: '#3b82f6 !important' }}>
                                                                {analyticsTaskStats?.pending || 0}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={3}>
                                            <Card className="analytics-card-apple">
                                                <CardContent sx={{ p: 2.5 }}>
                                                    <Box display="flex" alignItems="center" gap={2}>
                                                        <Box
                                                            sx={{
                                                                width: 48,
                                                                height: 48,
                                                                borderRadius: '12px',
                                                                background: 'rgba(245, 158, 11, 0.15)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            <TrendingUp sx={{ color: '#f59e0b', fontSize: 24 }} />
                                                        </Box>
                                                        <Box flex={1}>
                                                            <Typography className="analytics-card-title-apple">On Hold</Typography>
                                                            <Typography className="analytics-card-value-apple" sx={{ fontSize: '2rem !important', color: '#f59e0b !important' }}>
                                                                {analyticsTaskStats?.onHold || 0}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>

                                    {/* Charts Section - 2 Columns */}
                                    <Grid container spacing={3}>
                                        {/* Task Status Distribution - DONUT PIE CHART */}
                                        <Grid item xs={12} lg={6}>
                                            <Box className="chart-container-apple" sx={{ height: '500px' }}>
                                                <Typography className="chart-title-apple" sx={{ mb: 3 }}>
                                                    Task Status Overview
                                                </Typography>
                                                <ResponsiveContainer width="100%" height="85%">
                                                    <PieChart>
                                                        <Pie
                                                            data={[
                                                                { name: 'Completed', value: analyticsTaskStats?.completed || 0 },
                                                                { name: 'Pending', value: analyticsTaskStats?.pending || 0 },
                                                                { name: 'In Progress', value: analyticsTaskStats?.inProgress || 0 },
                                                                { name: 'On Hold', value: analyticsTaskStats?.onHold || 0 }
                                                            ].filter(item => item.value > 0)}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={80}
                                                            outerRadius={140}
                                                            paddingAngle={5}
                                                            dataKey="value"
                                                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                                            labelLine={false}
                                                        >
                                                            <Cell fill="#10b981" />
                                                            <Cell fill="#f59e0b" />
                                                            <Cell fill="#3b82f6" />
                                                            <Cell fill="#ef4444" />
                                                        </Pie>
                                                        <Tooltip
                                                            contentStyle={{
                                                                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                                borderRadius: '12px',
                                                                color: '#fff',
                                                                padding: '12px'
                                                            }}
                                                        />
                                                        <Legend
                                                            verticalAlign="bottom"
                                                            height={36}
                                                            iconType="circle"
                                                            wrapperStyle={{
                                                                color: '#fff',
                                                                fontSize: '14px',
                                                                paddingTop: '20px'
                                                            }}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </Box>
                                        </Grid>

                                        {/* Priority Distribution - DONUT PIE CHART */}
                                        <Grid item xs={12} lg={6}>
                                            <Box className="chart-container-apple" sx={{ height: '500px' }}>
                                                <Typography className="chart-title-apple" sx={{ mb: 3 }}>
                                                    Tasks by Priority Level
                                                </Typography>
                                                <ResponsiveContainer width="100%" height="85%">
                                                    <PieChart>
                                                        <Pie
                                                            data={priorityDistribution?.map(item => ({
                                                                name: item.fieldName,
                                                                value: item.count
                                                            }))}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={80}
                                                            outerRadius={140}
                                                            paddingAngle={5}
                                                            dataKey="value"
                                                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                                            labelLine={false}
                                                        >
                                                            {priorityDistribution?.map((entry, index) => {
                                                                const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
                                                                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                                                            })}
                                                        </Pie>
                                                        <Tooltip
                                                            contentStyle={{
                                                                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                                borderRadius: '12px',
                                                                color: '#fff',
                                                                padding: '12px'
                                                            }}
                                                        />
                                                        <Legend
                                                            verticalAlign="bottom"
                                                            height={36}
                                                            iconType="circle"
                                                            wrapperStyle={{
                                                                color: '#fff',
                                                                fontSize: '14px',
                                                                paddingTop: '20px'
                                                            }}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </Box>
                                        </Grid>

                                        {/* Task Trend - LINE CHART (Full Width) */}
                                        <Grid item xs={12}>
                                            <Box className="chart-container-apple" sx={{ height: '400px' }}>
                                                <Typography className="chart-title-apple" sx={{ mb: 3 }}>
                                                    Task Activity (Last 30 Days)
                                                </Typography>
                                                <ResponsiveContainer width="100%" height="85%">
                                                    <LineChart
                                                        data={taskTrend?.map(day => ({
                                                            date: new Date(day.date).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric'
                                                            }),
                                                            tasks: day.count
                                                        }))}
                                                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                                                    >
                                                        <defs>
                                                            <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                                                        <XAxis
                                                            dataKey="date"
                                                            stroke="rgba(255, 255, 255, 0.3)"
                                                            tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
                                                        />
                                                        <YAxis
                                                            stroke="rgba(255, 255, 255, 0.3)"
                                                            tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
                                                        />
                                                        <Tooltip
                                                            contentStyle={{
                                                                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                                borderRadius: '12px',
                                                                color: '#fff',
                                                                padding: '12px'
                                                            }}
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="tasks"
                                                            stroke="#3b82f6"
                                                            strokeWidth={3}
                                                            fill="url(#colorTasks)"
                                                            dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                                                            activeDot={{ r: 7, strokeWidth: 2 }}
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </Box>
                                        </Grid>

                                        {/* Client Task Distribution - HORIZONTAL BAR CHART */}
                                        <Grid item xs={12}>
                                            <Box className="chart-container-apple" sx={{ height: '500px' }}>
                                                <Typography className="chart-title-apple" sx={{ mb: 3 }}>
                                                    Client Performance Overview
                                                </Typography>
                                                <ResponsiveContainer width="100%" height="85%">
                                                    <BarChart
                                                        data={clientTaskDistribution?.slice(0, 8).map(client => ({
                                                            name: `${client.firstName} ${client.lastName}`,
                                                            completed: client.completedTasks,
                                                            pending: client.totalTasks - client.completedTasks,
                                                            completionRate: client.completionRate
                                                        }))}
                                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                                        layout="horizontal"
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                                                        <XAxis
                                                            type="number"
                                                            stroke="rgba(255, 255, 255, 0.3)"
                                                            tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
                                                        />
                                                        <YAxis
                                                            type="category"
                                                            dataKey="name"
                                                            stroke="rgba(255, 255, 255, 0.3)"
                                                            tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
                                                            width={150}
                                                        />
                                                        <Tooltip
                                                            contentStyle={{
                                                                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                                borderRadius: '12px',
                                                                color: '#fff',
                                                                padding: '12px'
                                                            }}
                                                        />
                                                        <Legend
                                                            wrapperStyle={{
                                                                color: '#fff',
                                                                fontSize: '14px',
                                                                paddingTop: '10px'
                                                            }}
                                                            iconType="circle"
                                                        />
                                                        <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" radius={[0, 8, 8, 0]} />
                                                        <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" radius={[0, 8, 8, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </>
                            )}
                        </Box>
                    )}
                </Container>
            </Box>

            {/* Dialogs */}
            <TaskCreate
                open={openTaskDialog}
                onClose={() => {
                    setOpenTaskDialog(false);
                    setEditingTask(null);
                }}
                onSubmit={handleTaskSubmit}
                task={editingTask}
                users={users}
                organizations={organizations}
                clients={clients}
                isManagerView={true}
            />

            <ClientCreate
                open={openClientDialog}
                onClose={() => {
                    setOpenClientDialog(false);
                    setEditingClient(null);
                }}
                onSubmit={handleClientSubmit}
                client={editingClient}
                organizations={organizations}
                isManagerView={true}
                defaultOrganizationId={managerOrganizationId}
            />

            <UserCreate
                open={openUserDialog}
                onClose={() => {
                    setOpenUserDialog(false);
                    setEditingUser(null);
                }}
                onSubmit={handleUserSubmit}
                user={editingUser}
                isManagerView={true}
                defaultOrganizationId={managerOrganizationId}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};
export default ManagerDashboard;