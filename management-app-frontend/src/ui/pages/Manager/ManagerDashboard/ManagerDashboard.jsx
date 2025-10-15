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

    const [snackbar, setSnackbar] = useState({open: false, message: '', severity: 'success'});
    const loading = clientsLoading || tasksLoading || usersLoading || orgsLoading;

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
        <Box sx={{bgcolor: 'background.default', minHeight: '100vh', py: 4}}>
            <Container maxWidth="xl">
                {/* UPDATED HEADER WITH EDIT ORGANIZATION BUTTON */}
                <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography
                            variant="h4"
                            fontWeight={700}
                            sx={{ mb: 1 }}
                        >
                            Manager Dashboard
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Welcome back, {user?.name}! Manage your organization
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={2}>
                        {/* NEW: Edit Organization Button */}
                        <Button
                            variant="contained"
                            startIcon={<Settings />}
                            onClick={() => navigate('/manager/edit-organization')}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3,
                                py: 1.5,
                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                                '&:hover': {
                                    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
                                    transform: 'translateY(-2px)',
                                    transition: 'all 0.2s'
                                }
                            }}
                        >
                            Edit Organization
                        </Button>
                        <ThemeToggle />
                    </Box>
                </Box>

                <Grid container spacing={3} mb={4}>
                    <Grid item xs={12} sm={6} lg={3}>
                        <StatCard
                            title="Total Clients"
                            value={stats.totalClients}
                            subtitle="Active partnerships"
                            icon={<People/>}
                            color="#6366f1"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <StatCard
                            title="Total Tasks"
                            value={stats.totalTasks}
                            subtitle="All tasks"
                            icon={<Assignment/>}
                            color="#8b5cf6"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <StatCard
                            title="Pending"
                            value={stats.pendingTasks}
                            subtitle="Needs attention"
                            icon={<Schedule/>}
                            color="#f59e0b"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <StatCard
                            title="Completed"
                            value={stats.completedTasks}
                            subtitle="This month"
                            icon={<CheckCircle/>}
                            color="#10b981"
                        />
                    </Grid>
                </Grid>

                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{borderBottom: 1, borderColor: 'divider', bgcolor: 'white'}}>
                        <Tabs
                            value={activeTab}
                            onChange={(e, newValue) => setActiveTab(newValue)}
                            sx={{
                                px: 3,
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    minHeight: 64
                                }
                            }}
                        >
                            <Tab label="Tasks" icon={<Assignment/>} iconPosition="start"/>
                            <Tab label="Clients" icon={<People/>} iconPosition="start"/>
                            <Tab label="Team Members" icon={<PersonOutline/>} iconPosition="start"/>
                        </Tabs>
                    </Box>

                    <Box p={4}>
                        {activeTab === 0 && (
                            <>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                    <Box>
                                        <Typography variant="h6" fontWeight={700}>
                                            All Tasks
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Manage and delegate tasks to your team
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        startIcon={<Add/>}
                                        onClick={() => handleOpenTaskDialog()}
                                        sx={{
                                            bgcolor: '#6366f1',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            px: 3,
                                            py: 1.5,
                                            borderRadius: 2,
                                            '&:hover': {bgcolor: '#4f46e5'}
                                        }}
                                    >
                                        Create Task
                                    </Button>
                                </Box>

                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{bgcolor: '#f9fafb'}}>
                                                <TableCell sx={{fontWeight: 700}}>Task</TableCell>
                                                <TableCell sx={{fontWeight: 700}}>Client</TableCell>
                                                <TableCell sx={{fontWeight: 700}}>Assigned To</TableCell>
                                                <TableCell sx={{fontWeight: 700}}>Status</TableCell>
                                                <TableCell sx={{fontWeight: 700}}>Priority</TableCell>
                                                <TableCell sx={{fontWeight: 700}}>Due Date</TableCell>
                                                <TableCell align="right" sx={{fontWeight: 700}}>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {tasks.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} align="center" sx={{py: 4}}>
                                                        <Typography color="text.secondary">
                                                            No tasks yet. Create your first task to get started!
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                tasks.map((task) => (
                                                    <TableRow key={task.id} hover>
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {task.title}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {task.description}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            {task.clientId ? (
                                                                <Box display="flex" alignItems="center" gap={1}>
                                                                    <Avatar sx={{
                                                                        width: 32,
                                                                        height: 32,
                                                                        fontSize: '0.875rem',
                                                                        bgcolor: '#6366f1'
                                                                    }}>
                                                                        {task.clientName
                                                                            ? task.clientName.split(' ').map(n => n[0]).join('')
                                                                            : 'CL'
                                                                        }
                                                                    </Avatar>
                                                                    <Typography variant="body2">
                                                                        {task.clientName || `Client #${task.clientId}`}
                                                                    </Typography>
                                                                </Box>
                                                            ) : (
                                                                <Typography variant="body2" color="text.secondary">
                                                                    No Client
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {task.assignedToUserId ? (
                                                                <Box display="flex" alignItems="center" gap={1}>
                                                                    <Avatar sx={{
                                                                        width: 32,
                                                                        height: 32,
                                                                        fontSize: '0.875rem',
                                                                        bgcolor: '#8b5cf6'
                                                                    }}>
                                                                        {task.assignedToUserName
                                                                            ? task.assignedToUserName.split(' ').map(n => n[0]).join('')
                                                                            : task.assignedToUserId.substring(0, 2).toUpperCase()
                                                                        }
                                                                    </Avatar>
                                                                    <Typography variant="body2">
                                                                        {task.assignedToUserName || `@${task.assignedToUserId}`}
                                                                    </Typography>
                                                                </Box>
                                                            ) : (
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Unassigned
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={task.status.replace('_', ' ')}
                                                                size="small"
                                                                color={getStatusColor(task.status)}
                                                                sx={{fontWeight: 600}}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={task.priority}
                                                                size="small"
                                                                color={getPriorityColor(task.priority)}
                                                                variant="outlined"
                                                                sx={{fontWeight: 600}}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">
                                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleOpenTaskDialog(task)}
                                                                sx={{color: '#6366f1'}}
                                                            >
                                                                <Edit fontSize="small"/>
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleDeleteTask(task.id)}
                                                            >
                                                                <Delete fontSize="small"/>
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                        )}

                        {activeTab === 1 && (
                            <>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                    <Box>
                                        <Typography variant="h6" fontWeight={700}>
                                            Client Directory
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Manage your client relationships
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        startIcon={<PersonAdd/>}
                                        onClick={() => handleOpenClientDialog()}
                                        sx={{
                                            bgcolor: '#6366f1',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            px: 3,
                                            py: 1.5,
                                            borderRadius: 2,
                                            '&:hover': {bgcolor: '#4f46e5'}
                                        }}
                                    >
                                        Add Client
                                    </Button>
                                </Box>

                                <Grid container spacing={3}>
                                    {clients.length === 0 ? (
                                        <Grid item xs={12}>
                                            <Box textAlign="center" py={6}>
                                                <Typography color="text.secondary">
                                                    No clients yet. Add your first client to get started!
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ) : (
                                        clients.map((client) => (
                                            <Grid item xs={12} md={6} lg={4} key={client.id}>
                                                <Card
                                                    elevation={0}
                                                    sx={{
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        borderRadius: 2,
                                                        transition: 'all 0.2s',
                                                        '&:hover': {
                                                            borderColor: '#6366f1',
                                                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)'
                                                        }
                                                    }}
                                                >
                                                    <CardContent sx={{p: 3}}>
                                                        <Box display="flex" justifyContent="space-between" mb={2}>
                                                            <Avatar
                                                                sx={{bgcolor: '#6366f1', width: 48, height: 48}}>
                                                                {client.firstName[0]}{client.lastName[0]}
                                                            </Avatar>
                                                            <Box>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleOpenClientDialog(client)}
                                                                    sx={{color: '#6366f1'}}
                                                                >
                                                                    <Edit fontSize="small"/>
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => handleDeleteClient(client.id)}
                                                                >
                                                                    <Delete fontSize="small"/>
                                                                </IconButton>
                                                            </Box>
                                                        </Box>
                                                        <Typography variant="h6" fontWeight={700} mb={0.5}>
                                                            {client.firstName} {client.lastName}
                                                        </Typography>
                                                        <Divider sx={{my: 2}}/>
                                                        <Stack spacing={1}>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {client.email}
                                                            </Typography>
                                                            {client.phoneNumber && (
                                                                <Typography variant="caption"
                                                                            color="text.secondary">
                                                                    {client.phoneNumber}
                                                                </Typography>
                                                            )}
                                                        </Stack>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))
                                    )}
                                </Grid>
                            </>
                        )}

                        {activeTab === 2 && (
                            <>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                    <Box>
                                        <Typography variant="h6" fontWeight={700}>
                                            Team Members
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Manage your organization's team
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        startIcon={<PersonAdd/>}
                                        onClick={() => handleOpenUserDialog()}
                                        sx={{
                                            bgcolor: '#6366f1',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            px: 3,
                                            py: 1.5,
                                            borderRadius: 2,
                                            '&:hover': {bgcolor: '#4f46e5'}
                                        }}
                                    >
                                        Add Team Member
                                    </Button>
                                </Box>

                                <Grid container spacing={3}>
                                    {users.length === 0 ? (
                                        <Grid item xs={12}>
                                            <Box textAlign="center" py={6}>
                                                <Typography color="text.secondary">
                                                    No team members yet. Add your first team member!
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ) : (
                                        users.map((user) => {
                                            const taskStats = getUserTaskStats(user.username);
                                            return (
                                                <Grid item xs={12} md={6} lg={4} key={user.id}>
                                                    <Card
                                                        elevation={0}
                                                        sx={{
                                                            border: '1px solid',
                                                            borderColor: 'divider',
                                                            borderRadius: 2,
                                                            transition: 'all 0.2s',
                                                            '&:hover': {
                                                                borderColor: '#6366f1',
                                                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)'
                                                            }
                                                        }}
                                                    >
                                                        <CardContent sx={{p: 3}}>
                                                            <Box display="flex" justifyContent="space-between"
                                                                 mb={2}>
                                                                <Avatar sx={{
                                                                    bgcolor: '#8b5cf6',
                                                                    width: 48,
                                                                    height: 48
                                                                }}>
                                                                    {user.name[0]}{user.surname[0]}
                                                                </Avatar>
                                                                <Box>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleOpenUserDialog(user)}
                                                                        sx={{color: '#6366f1'}}
                                                                    >
                                                                        <Edit fontSize="small"/>
                                                                    </IconButton>
                                                                    <IconButton
                                                                        size="small"
                                                                        color="error"
                                                                        onClick={() => handleDeleteUser(user.id)}
                                                                    >
                                                                        <Delete fontSize="small"/>
                                                                    </IconButton>
                                                                </Box>
                                                            </Box>
                                                            <Typography variant="h6" fontWeight={700} mb={0.5}>
                                                                {user.name} {user.surname}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary"
                                                                        mb={2}>
                                                                @{user.username}
                                                            </Typography>
                                                            <Chip
                                                                label={user.role}
                                                                size="small"
                                                                sx={{
                                                                    mb: 2,
                                                                    bgcolor: '#f0f4ff',
                                                                    color: '#6366f1',
                                                                    fontWeight: 600
                                                                }}
                                                            />
                                                            <Divider sx={{my: 2}}/>
                                                            <Box>
                                                                <Box display="flex" justifyContent="space-between"
                                                                     mb={1}>
                                                                    <Typography variant="caption"
                                                                                color="text.secondary">
                                                                        Task Progress
                                                                    </Typography>
                                                                    <Typography variant="caption" fontWeight={600}>
                                                                        {taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}%
                                                                    </Typography>
                                                                </Box>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0}
                                                                    sx={{
                                                                        height: 8,
                                                                        borderRadius: 4,
                                                                        bgcolor: '#f0f4ff',
                                                                        '& .MuiLinearProgress-bar': {bgcolor: '#6366f1'}
                                                                    }}
                                                                />
                                                                <Typography variant="caption" color="text.secondary"
                                                                            sx={{mt: 1, display: 'block'}}>
                                                                    {taskStats.completed} of {taskStats.total} tasks
                                                                    completed
                                                                </Typography>
                                                            </Box>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            );
                                        })
                                    )}
                                </Grid>
                            </>
                        )}
                    </Box>
                </Paper>


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
                    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        sx={{width: '100%'}}
                        variant="filled"
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};
export default ManagerDashboard;