import React, {useState} from 'react';
import {Avatar, Box, Button, Chip, Container, Fade, Grid, IconButton, Typography, Zoom} from '@mui/material';
import {
    Add,
    Assignment,
    Business,
    Delete,
    Edit,
    Insights,
    People,
    PersonAdd,
    Speed,
    TrendingUp,
    Visibility
} from '@mui/icons-material';
import {useAuth} from '../../../hooks/useAuth.js';
import Navbar from '../../components/navbar/Navbar';
import OrganizationForm from '../../components/Organization/Organization.jsx';
import OrganizationDetailsModal from '../../components/OrganizationDetailsModal/OrganizationDetailsModal.jsx';
import CreateManagerForm from '../../components/CreateManagerForm/CreateManagerForm.jsx';
import './AdminDashboard.css';
import TaskCreate from '../../components/Task/TaskCreate/TaskCreate.jsx';
import TaskDelete from '../../components/Task/TaskDelete/TaskDelete.jsx';
import TaskView from '../../components/Task/TaskView/TaskView.jsx';


import useOrganizations from '../../../hooks/useOrganizations.js';
import useUsers from '../../../hooks/useUsers.js';
import useTasks from '../../../hooks/useTasks.js';
import useClients from '../../../hooks/useClients.js';
import useRecords from '../../../hooks/useRecords.js';
import ClientCreate from '../../components/Client/ClientCreate/ClientCreate.jsx';
import ClientDelete from '../../components/Client/ClientDelete/ClientDelete.jsx';
import ClientView from '../../components/Client/ClientView/ClientView.jsx';
import UserCreate from '../../components/Users/UserCreate/UserCreate.jsx'
import UserDelete from '../../components/Users/UserDelete/UserDelete.jsx';
import UserView from '../../components/Users/UserView/UserView.jsx';
import RecordCreate from '../../components/Records/RecordCreate/RecordCreate.jsx'
import RecordDelete from "../../components/Records/RecordDelete/RecordDelete.jsx";
import RecordView from "../../components/Records/RecordView/RecordView.jsx";

const AdminDashboard = () => {
    const {user} = useAuth();


    const {
        organizations,
        loading: orgsLoading,
        onAdd: addOrganization,
        onEdit: editOrganization,
        onDelete: deleteOrganization
    } = useOrganizations();
    const {users, loading: usersLoading, onAdd: addUser, onEdit: editUser, onDelete: deleteUser} = useUsers();
    const {tasks, loading: tasksLoading, onAdd: addTask, onEdit: editTask, onDelete: deleteTask} = useTasks();
    const {
        clients,
        loading: clientsLoading,
        onAdd: addClient,
        onEdit: editClient,
        onDelete: deleteClient,
    } = useClients();
    const {records, loading: recordsLoading, onAdd: addRecord, onDelete: deleteRecord, onEdit:editRecord} = useRecords();


    const managers = users.filter(u => u.role === 'MANAGER');
    const stats = {
        totalOrganizations: organizations.length,
        totalManagers: managers.length,
        totalUsers: users.filter(u => u.role === 'USER').length,
        totalRecords: records.length
    };


    const [openDialog, setOpenDialog] = useState(false);
    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const [openManagerDialog, setOpenManagerDialog] = useState(false);
    const [editingOrg, setEditingOrg] = useState(null);
    const [viewingOrg, setViewingOrg] = useState(null);

    const [openTaskDialog, setOpenTaskDialog] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [openTaskDeleteDialog, setOpenTaskDeleteDialog] = useState(false);
    const [openTaskViewDialog, setOpenTaskViewDialog] = useState(false);
    const [viewingTask, setViewingTask] = useState(null);
    const [deletingTask, setDeletingTask] = useState(null);

    const [openClientDialog, setOpenClientDialog] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [openClientDeleteDialog, setOpenClientDeleteDialog] = useState(false);
    const [openClientViewDialog, setOpenClientViewDialog] = useState(false);
    const [viewingClient, setViewingClient] = useState(null);
    const [deletingClient, setDeletingClient] = useState(null);

    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [openUserDeleteDialog, setOpenUserDeleteDialog] = useState(false);
    const [openUserViewDialog, setOpenUserViewDialog] = useState(false);
    const [viewingUser, setViewingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);

    const [openRecordDialog, setOpenRecordDialog] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [openRecordDeleteDialog, setOpenRecordDeleteDialog] = useState(false);
    const [openRecordViewDialog, setOpenRecordViewDialog] = useState(false);
    const [viewingRecord, setViewingRecord] = useState(null);
    const [deletingRecord, setDeletingRecord] = useState(null);


    const loading = orgsLoading || usersLoading || tasksLoading || clientsLoading || recordsLoading;

    // Organization handlers
    const handleOpenDialog = (org = null) => {
        setEditingOrg(org);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingOrg(null);
    };

    const handleViewOrganization = (org) => {
        setViewingOrg(org);
        setOpenDetailsModal(true);
    };

    const handleCloseDetailsModal = () => {
        setOpenDetailsModal(false);
        setViewingOrg(null);
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingOrg) {
                editOrganization(editingOrg.id, formData);
            } else {
                addOrganization(formData);
            }
        } catch (error) {
            console.error('Error saving organization:', error);
            alert('Failed to save organization. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this organization?')) {
            try {
                deleteOrganization(id);
            } catch (error) {
                console.error('Error deleting organization:', error);
                alert('Failed to delete organization. Please try again.');
            }
        }
    };

    // Manager handlers
    const handleOpenManagerDialog = () => {
        setOpenManagerDialog(true);
    };

    const handleCloseManagerDialog = () => {
        setOpenManagerDialog(false);
    };

    const handleCreateManager = async (managerData) => {
        try {
            addUser(managerData);
            alert('Manager created successfully!');
        } catch (error) {
            console.error('Error creating manager:', error);
            throw error;
        }
    };

    // Task handlers
    const handleOpenTaskDialog = (task = null) => {
        setEditingTask(task);
        setOpenTaskDialog(true);
    };

    const handleCloseTaskDialog = () => {
        setOpenTaskDialog(false);
        setEditingTask(null);
    };

    const handleSubmitTask = async (taskData) => {
        try {
            const taskPayload = {
                ...taskData,
                dueDate: taskData.dueDate ? `${taskData.dueDate}T00:00:00` : null,
                assignedToUserId: taskData.assignedToUserId || null,
                clientId: taskData.clientId || null,
                finished: false
            };

            if (editingTask) {
                editTask(editingTask.id, taskPayload);
            } else {
                addTask(taskPayload);
            }
            alert(editingTask ? 'Task updated successfully!' : 'Task created successfully!');
        } catch (error) {
            console.error('Error saving task:', error);
            alert(`Failed to save task: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleOpenTaskViewDialog = (task) => {
        setViewingTask(task);
        setOpenTaskViewDialog(true);
    };

    const handleCloseTaskViewDialog = () => {
        setOpenTaskViewDialog(false);
        setViewingTask(null);
    };

    const handleOpenTaskDeleteDialog = (task) => {
        setDeletingTask(task);
        setOpenTaskDeleteDialog(true);
    };

    const handleCloseTaskDeleteDialog = () => {
        setOpenTaskDeleteDialog(false);
        setDeletingTask(null);
    };

    const handleConfirmDeleteTask = async (taskId) => {
        try {
            deleteTask(taskId);
            alert('Task deleted successfully!');
        } catch (error) {
            console.error('Error deleting task:', error);
            alert(`Failed to delete task: ${error.message}`);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'HOSPITAL':
                return '🏥';
            case 'AUTO_REPAIR':
                return '🔧';
            case 'RESTAURANT':
                return '🍽️';
            case 'RETAIL':
                return '🛒';
            default:
                return '🏢';
        }
    };

    // CLIENT HANDLERS
    const handleOpenClientDialog = (client = null) => {
        setEditingClient(client);
        setOpenClientDialog(true);
    };

    const handleCloseClientDialog = () => {
        setOpenClientDialog(false);
        setEditingClient(null);
    };

    const handleSubmitClient = async (clientData) => {
        try {
            if (editingClient) {
                editClient(editingClient.id, clientData);
                alert('Client updated successfully!');
            } else {
                addClient(clientData);
                alert('Client created successfully!');
            }
        } catch (error) {
            console.error('Error saving client:', error);
            alert(`Failed to save client: ${error.message}`);
        }
    };

    const handleOpenClientViewDialog = (client) => {
        setViewingClient(client);
        setOpenClientViewDialog(true);
    };

    const handleCloseClientViewDialog = () => {
        setOpenClientViewDialog(false);
        setViewingClient(null);
    };

    const handleOpenClientDeleteDialog = (client) => {
        setDeletingClient(client);
        setOpenClientDeleteDialog(true);
    };

    const handleCloseClientDeleteDialog = () => {
        setOpenClientDeleteDialog(false);
        setDeletingClient(null);
    };

    const handleConfirmDeleteClient = async (clientId) => {
        try {
            deleteClient(clientId);
            alert('Client deleted successfully!');
        } catch (error) {
            console.error('Error deleting client:', error);
            alert(`Failed to delete client: ${error.message}`);
        }
    };
    const handleOpenUserDialog = (user = null) => {
        setEditingUser(user);
        setOpenUserDialog(true);
    };

    const handleCloseUserDialog = () => {
        setOpenUserDialog(false);
        setEditingUser(null);
    };

    const handleSubmitUser = async (userData) => {
        try {
            if (editingUser) {
                editUser(editingUser.username, userData);
                alert('User updated successfully!');
            } else {
                addUser(userData);
                alert('User created successfully!');
            }
        } catch (error) {
            console.error('Error saving user:', error);
            alert(`Failed to save user: ${error.message}`);
        }
    };

    const handleOpenUserViewDialog = (user) => {
        setViewingUser(user);
        setOpenUserViewDialog(true);
    };

    const handleCloseUserViewDialog = () => {
        setOpenUserViewDialog(false);
        setViewingUser(null);
    };

    const handleOpenUserDeleteDialog = (user) => {
        setDeletingUser(user);
        setOpenUserDeleteDialog(true);
    };

    const handleCloseUserDeleteDialog = () => {
        setOpenUserDeleteDialog(false);
        setDeletingUser(null);
    };

    const handleConfirmDeleteUser = async (username) => {
        try {
            deleteUser(username);
            alert('User deleted successfully!');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(`Failed to delete user: ${error.message}`);
        }
    };

    // Record handlers

    const handleOpenRecordDialog = (record = null) => {
        setEditingRecord(record);
        setOpenRecordDialog(true);
    }

    const handleCloseRecordDialog = () => {
        setOpenRecordDialog(false);
        setEditingRecord(null);
    }

    const handleSubmitRecord = async (recordData) => {
        try {
            console.log('🎯 handleSubmitRecord called');
            console.log('📦 recordData parameter:', recordData);
            console.log('📝 editingRecord state:', editingRecord);

            if (recordData.id) {
                console.log('✏️ About to call editRecord with:', recordData.id, recordData);
                await editRecord(recordData.id, recordData);
                handleCloseRecordDialog();
                alert(`Record updated successfully`)
            } else {
                await addRecord(recordData);
                handleCloseRecordDialog();
                alert(`Record created successfully`)
            }
        } catch (error) {
            console.error('Error saving record:', error);
            alert(`Failed to save record: ${error.message}`)
        }
    }

    const handleOpenRecordViewDialog = (record) => {
        setViewingRecord(record);
        setOpenRecordViewDialog(true);
    };

    const handleCloseRecordViewDialog = () => {
        setOpenRecordViewDialog(false);
        setViewingRecord(null);
    };

    const handleOpenRecordDeleteDialog = (record) => {
        setDeletingRecord(record);
        setOpenRecordDeleteDialog(true);
    };

    const handleCloseRecordDeleteDialog = () => {
        setOpenRecordDeleteDialog(false);
        setDeletingRecord(null);
    };

    const handleConfirmDeleteRecord = async (recordId) => {
        try {
            // Assuming you have deleteRecord function from useRecords
            // You'll need to add onDelete to useRecords hook
            await deleteRecord(recordId)
            alert('Record deleted successfully!');
        } catch (error) {
            console.error('Error deleting record:', error);
            alert(`Failed to delete record: ${error.message}`);
        }
    };

    const StatCard = ({title, value, icon, gradient, delay}) => (
        <Zoom in={true} style={{transitionDelay: `${delay}ms`}}>
            <Box className="cyber-stat-card">
                <div className="stat-card-glow"></div>
                <Box className="stat-card-content">
                    <Box className="stat-header">
                        <Box className="stat-icon-wrapper" sx={{background: gradient}}>
                            {icon}
                            <div className="icon-ripple"></div>
                        </Box>
                        <Box className="stat-trend">
                            <TrendingUp className="trend-icon"/>
                            <Typography className="trend-text">+12%</Typography>
                        </Box>
                    </Box>
                    <Typography className="stat-label">{title}</Typography>
                    <Typography className="stat-value">{value}</Typography>
                    <Box className="stat-progress">
                        <div className="progress-bar" style={{width: '75%', background: gradient}}></div>
                    </Box>
                </Box>
            </Box>
        </Zoom>
    );

    return (
        <>
            <Navbar/>
            <Box className="futuristic-dashboard">

                <div className="cyber-bg">
                    <div className="cyber-grid"></div>
                    <div className="floating-particles">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="particle" style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${5 + Math.random() * 10}s`
                            }}></div>
                        ))}
                    </div>
                </div>

                <Container maxWidth="xl" className="dashboard-container">

                    <Fade in={true} timeout={1000}>
                        <Box className="dashboard-hero">
                            <Box className="hero-content">
                                <Box className="hero-badge">
                                    <Speed className="badge-icon"/>
                                    <span>SYSTEM CONTROL CENTER</span>
                                </Box>
                                <Typography className="hero-title">
                                    Welcome back, <span className="gradient-text">{user?.name}</span>
                                </Typography>
                                <Typography className="hero-subtitle">
                                    Your command center for total system oversight and control
                                </Typography>
                            </Box>
                            <Button
                                className="cyber-button primary"
                                startIcon={<PersonAdd/>}
                                onClick={handleOpenManagerDialog}
                            >
                                <span className="btn-text">Create Manager</span>
                                <div className="btn-shimmer"></div>
                            </Button>
                        </Box>
                    </Fade>


                    <Grid container spacing={3} className="stats-grid">
                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard
                                title="Organizations"
                                value={stats.totalOrganizations}
                                icon={<Business/>}
                                gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                delay={100}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard
                                title="Managers"
                                value={stats.totalManagers}
                                icon={<People/>}
                                gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                                delay={200}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard
                                title="Users"
                                value={stats.totalUsers}
                                icon={<People/>}
                                gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                                delay={300}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard
                                title="Records"
                                value={stats.totalRecords}
                                icon={<Assignment/>}
                                gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                                delay={400}
                            />
                        </Grid>
                    </Grid>


                    <Fade in={true} timeout={1500}>
                        <Box className="cyber-section">
                            <Box className="section-header">
                                <Box className="section-title-wrapper">
                                    <Insights className="section-icon"/>
                                    <Typography className="section-title">Organizations Hub</Typography>
                                    <Chip label={organizations.length} className="section-badge"/>
                                </Box>
                                <Button
                                    className="cyber-button secondary"
                                    startIcon={<Add/>}
                                    onClick={() => handleOpenDialog()}
                                >
                                    <span className="btn-text">Add Organization</span>
                                </Button>
                            </Box>

                            <Box className="data-grid">
                                {loading ? (
                                    <Box className="loading-state">
                                        <div className="loading-spinner"></div>
                                        <Typography>Loading data...</Typography>
                                    </Box>
                                ) : organizations.length === 0 ? (
                                    <Box className="empty-state">
                                        <Business className="empty-icon"/>
                                        <Typography className="empty-text">No organizations found</Typography>
                                        <Typography className="empty-subtext">Create your first organization to get
                                            started</Typography>
                                    </Box>
                                ) : (
                                    organizations.map((org, index) => (
                                        <Zoom key={org.id} in={true} style={{transitionDelay: `${index * 50}ms`}}>
                                            <Box className="data-card">
                                                <div className="card-glow"></div>
                                                <Box className="card-header">
                                                    <Box className="card-icon">{getTypeIcon(org.type)}</Box>
                                                    <Chip label={org.type} className="type-chip"/>
                                                </Box>
                                                <Typography className="card-title">{org.name}</Typography>
                                                <Typography className="card-description">{org.description}</Typography>
                                                <Box className="card-meta">
                                                    {org.contactEmail && (
                                                        <Typography className="meta-item">
                                                            📧 {org.contactEmail}
                                                        </Typography>
                                                    )}
                                                    {org.contactPhone && (
                                                        <Typography className="meta-item">
                                                            📞 {org.contactPhone}
                                                        </Typography>
                                                    )}
                                                </Box>
                                                <Box className="card-actions">
                                                    <IconButton className="action-btn view"
                                                                onClick={() => handleViewOrganization(org)}>
                                                        <Visibility/>
                                                    </IconButton>
                                                    <IconButton className="action-btn edit"
                                                                onClick={() => handleOpenDialog(org)}>
                                                        <Edit/>
                                                    </IconButton>
                                                    <IconButton className="action-btn delete"
                                                                onClick={() => handleDelete(org.id)}>
                                                        <Delete/>
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Zoom>
                                    ))
                                )}
                            </Box>
                        </Box>
                    </Fade>

                    {/* Tasks Section */}
                    <Fade in={true} timeout={2000}>
                        <Box className="cyber-section">
                            <Box className="section-header">
                                <Box className="section-title-wrapper">
                                    <Assignment className="section-icon"/>
                                    <Typography className="section-title">Active Tasks</Typography>
                                    <Chip label={tasks.length} className="section-badge"/>
                                </Box>
                                <Button
                                    className="cyber-button accent"
                                    startIcon={<Add/>}
                                    onClick={() => handleOpenTaskDialog()}
                                >
                                    <span className="btn-text">Create Task</span>
                                </Button>
                            </Box>

                            <Box className="data-grid">
                                {tasks.length === 0 ? (
                                    <Box className="empty-state">
                                        <Assignment className="empty-icon"/>
                                        <Typography className="empty-text">No tasks found</Typography>
                                        <Typography className="empty-subtext">Create your first task to get
                                            started</Typography>
                                    </Box>
                                ) : (
                                    tasks.map((task, index) => (
                                        <Zoom key={task.id} in={true} style={{transitionDelay: `${index * 50}ms`}}>
                                            <Box className="task-card">
                                                <div className="card-glow"></div>
                                                <Box className="task-header">
                                                    <Chip
                                                        label={task.priority}
                                                        className={`priority-chip ${task.priority.toLowerCase()}`}
                                                    />
                                                    <Chip
                                                        label={task.status?.replace('_', ' ')}
                                                        className={`status-chip ${task.status?.toLowerCase()}`}
                                                    />
                                                </Box>
                                                <Typography className="task-title">{task.title}</Typography>
                                                <Typography className="task-description">
                                                    {task.description?.substring(0, 80)}...
                                                </Typography>
                                                <Box className="task-meta">
                                                    {task.organization && (
                                                        <Typography className="meta-item">
                                                            🏢 {task.organization.name}
                                                        </Typography>
                                                    )}
                                                    {task.assignedToUserId && (
                                                        <Typography className="meta-item">
                                                            👤 {task.assignedToUserId.name} {task.assignedToUserId.surname}
                                                        </Typography>
                                                    )}
                                                    {task.dueDate && (
                                                        <Typography className="meta-item">
                                                            📅 {new Date(task.dueDate).toLocaleDateString()}
                                                        </Typography>
                                                    )}
                                                </Box>
                                                <Box className="card-actions">
                                                    <IconButton className="action-btn view"
                                                                onClick={() => handleOpenTaskViewDialog(task)}>
                                                        <Visibility/>
                                                    </IconButton>
                                                    <IconButton className="action-btn edit"
                                                                onClick={() => handleOpenTaskDialog(task)}>
                                                        <Edit/>
                                                    </IconButton>
                                                    <IconButton className="action-btn delete"
                                                                onClick={() => handleOpenTaskDeleteDialog(task)}>
                                                        <Delete/>
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Zoom>
                                    ))
                                )}
                            </Box>
                        </Box>
                    </Fade>

                    <Fade in={true} timeout={2500}>
                        <Box className="cyber-section">
                            <Box className="section-header">
                                <Box className="section-title-wrapper">
                                    <People className="section-icon"/>
                                    <Typography className="section-title">Clients</Typography>
                                    <Chip label={clients.length} className="section-badge"/>
                                </Box>
                                <Button
                                    className="cyber-button secondary"
                                    startIcon={<Add/>}
                                    onClick={() => handleOpenClientDialog()}
                                >
                                    <span className="btn-text">Add Client</span>
                                </Button>
                            </Box>

                            <Box className="data-grid">
                                {clients.length === 0 ? (
                                    <Box className="empty-state">
                                        <People className="empty-icon"/>
                                        <Typography className="empty-text">No clients found</Typography>
                                        <Typography className="empty-subtext">Add your first client to get
                                            started</Typography>
                                    </Box>
                                ) : (
                                    clients.map((client, index) => (
                                        <Zoom key={client.id} in={true} style={{transitionDelay: `${index * 50}ms`}}>
                                            <Box className="data-card">
                                                <div className="card-glow"></div>
                                                <Box className="card-header">
                                                    <Avatar className="client-avatar-small">
                                                        {client.firstName?.charAt(0)}{client.lastName?.charAt(0)}
                                                    </Avatar>
                                                </Box>
                                                <Typography className="card-title">
                                                    {client.firstName} {client.lastName}
                                                </Typography>
                                                <Box className="card-meta">
                                                    {client.email && (
                                                        <Typography className="meta-item">
                                                            📧 {client.email}
                                                        </Typography>
                                                    )}
                                                    {client.phoneNumber && (
                                                        <Typography className="meta-item">
                                                            📞 {client.phoneNumber}
                                                        </Typography>
                                                    )}
                                                    {client.city && client.country && (
                                                        <Typography className="meta-item">
                                                            📍 {client.city}, {client.country}
                                                        </Typography>
                                                    )}
                                                </Box>
                                                <Box className="card-actions">
                                                    <IconButton className="action-btn view"
                                                                onClick={() => handleOpenClientViewDialog(client)}>
                                                        <Visibility/>
                                                    </IconButton>
                                                    <IconButton className="action-btn edit"
                                                                onClick={() => handleOpenClientDialog(client)}>
                                                        <Edit/>
                                                    </IconButton>
                                                    <IconButton className="action-btn delete"
                                                                onClick={() => handleOpenClientDeleteDialog(client)}>
                                                        <Delete/>
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Zoom>
                                    ))
                                )}
                            </Box>
                        </Box>
                    </Fade>

                    {/* Users Section */}
                    <Fade in={true} timeout={2500}>
                        <Box className="cyber-section">
                            <Box className="section-header">
                                <Box className="section-title-wrapper">
                                    <People className="section-icon"/>
                                    <Typography className="section-title">Team Members</Typography>
                                    <Chip label={users.length} className="section-badge"/>
                                </Box>
                                <Button
                                    className="cyber-button primary"
                                    startIcon={<PersonAdd/>}
                                    onClick={() => handleOpenUserDialog()}
                                >
                                    <span className="btn-text">Add User</span>
                                </Button>
                            </Box>

                            <Box className="user-grid">
                                {users.slice(0, 8).map((usr, index) => (
                                    <Zoom key={usr.username} in={true} style={{transitionDelay: `${index * 50}ms`}}>
                                        <Box className="user-card">
                                            <div className="card-glow"></div>
                                            <Avatar className="user-avatar">
                                                {usr.name?.charAt(0)}{usr.surname?.charAt(0)}
                                            </Avatar>
                                            <Typography className="user-name">{usr.name} {usr.surname}</Typography>
                                            <Typography className="user-username">@{usr.username}</Typography>
                                            <Chip
                                                label={usr.role}
                                                className={`role-chip ${usr.role.toLowerCase()}`}
                                            />
                                            <Box className="user-actions">
                                                <IconButton
                                                    className="action-btn view"
                                                    size="small"
                                                    onClick={() => handleOpenUserViewDialog(usr)}
                                                >
                                                    <Visibility fontSize="small"/>
                                                </IconButton>
                                                <IconButton
                                                    className="action-btn edit"
                                                    size="small"
                                                    onClick={() => handleOpenUserDialog(usr)}
                                                >
                                                    <Edit fontSize="small"/>
                                                </IconButton>
                                                <IconButton
                                                    className="action-btn delete"
                                                    size="small"
                                                    onClick={() => handleOpenUserDeleteDialog(usr)}
                                                >
                                                    <Delete fontSize="small"/>
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </Zoom>
                                ))}
                            </Box>
                        </Box>
                    </Fade>

                    {/* Records Section */}
                    <Fade in={true} timeout={3000}>
                        <Box className="cyber-section">
                            <Box className="section-header">
                                <Box className="section-title-wrapper">
                                    <Assignment className="section-icon"/>
                                    <Typography className="section-title">Records</Typography>
                                    <Chip label={records.length} className="section-badge"/>
                                </Box>
                                <Button
                                    className="cyber-button accent"
                                    startIcon={<Add/>}
                                    onClick={() => handleOpenRecordDialog()}
                                >
                                    <span className="btn-text">Create Record</span>
                                </Button>
                            </Box>

                            <Box className="data-grid">
                                {records.length === 0 ? (
                                    <Box className="empty-state">
                                        <Assignment className="empty-icon"/>
                                        <Typography className="empty-text">No records found</Typography>
                                        <Typography className="empty-subtext">Create your first record to get
                                            started</Typography>
                                    </Box>
                                ) : (
                                    records.map((record, index) => (
                                        <Zoom key={record.id} in={true} style={{transitionDelay: `${index * 50}ms`}}>
                                            <Box className="data-card">
                                                <div className="card-glow"></div>
                                                <Box className="card-header">
                                                    <Box className="card-icon">📋</Box>
                                                    {record.status && (
                                                        <Chip
                                                            label={record.status}
                                                            className={`status-chip ${record.status.toLowerCase()}`}
                                                        />
                                                    )}
                                                </Box>
                                                <Typography className="card-title">
                                                    {record.title || `Record #${record.id}`}
                                                </Typography>
                                                {record.description && (
                                                    <Typography className="card-description">
                                                        {record.description.substring(0, 80)}...
                                                    </Typography>
                                                )}
                                                <Box className="card-meta">
                                                    {record.client && (
                                                        <Typography className="meta-item">
                                                            👤 {record.client.firstName} {record.client.lastName}
                                                        </Typography>
                                                    )}
                                                    {record.organization && (
                                                        <Typography className="meta-item">
                                                            🏢 {record.organization.name}
                                                        </Typography>
                                                    )}
                                                    {record.createdAt && (
                                                        <Typography className="meta-item">
                                                            📅 {new Date(record.createdAt).toLocaleDateString()}
                                                        </Typography>
                                                    )}
                                                </Box>
                                                <Box className="card-actions">
                                                    <IconButton className="action-btn view"
                                                                onClick={() => handleOpenRecordViewDialog(record)}>
                                                        <Visibility/>
                                                    </IconButton>
                                                    <IconButton className="action-btn edit"
                                                                onClick={() => handleOpenRecordDialog(record)}>
                                                        <Edit/>
                                                    </IconButton>
                                                    <IconButton className="action-btn delete"
                                                                onClick={() => handleOpenRecordDeleteDialog(record)}>
                                                        <Delete/>
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Zoom>
                                    ))
                                )}
                            </Box>
                        </Box>
                    </Fade>

                </Container>
            </Box>

            {/* Modals */}
            <OrganizationForm
                open={openDialog}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
                organization={editingOrg}
                managers={managers}
            />

            <OrganizationDetailsModal
                open={openDetailsModal}
                onClose={handleCloseDetailsModal}
                organization={viewingOrg}
            />

            <CreateManagerForm
                open={openManagerDialog}
                onClose={handleCloseManagerDialog}
                onSubmit={handleCreateManager}
            />

            <TaskCreate
                open={openTaskDialog}
                onClose={handleCloseTaskDialog}
                onSubmit={handleSubmitTask}
                task={editingTask}
                users={users}
                organizations={organizations}
                clients={clients}
            />

            <TaskView
                open={openTaskViewDialog}
                onClose={handleCloseTaskViewDialog}
                task={viewingTask}
                onEdit={handleOpenTaskDialog}
            />

            <TaskDelete
                open={openTaskDeleteDialog}
                onClose={handleCloseTaskDeleteDialog}
                task={deletingTask}
                onConfirm={handleConfirmDeleteTask}
            />
            <ClientCreate
                open={openClientDialog}
                onClose={handleCloseClientDialog}
                onSubmit={handleSubmitClient}
                client={editingClient}
                organizations={organizations}
            />

            <ClientView
                open={openClientViewDialog}
                onClose={handleCloseClientViewDialog}
                client={viewingClient}
                onEdit={handleOpenClientDialog}
            />

            <ClientDelete
                open={openClientDeleteDialog}
                onClose={handleCloseClientDeleteDialog}
                client={deletingClient}
                onConfirm={handleConfirmDeleteClient}
            />
            <ClientDelete
                open={openClientDeleteDialog}
                onClose={handleCloseClientDeleteDialog}
                client={deletingClient}
                onConfirm={handleConfirmDeleteClient}
            />


            <UserCreate
                open={openUserDialog}
                onClose={handleCloseUserDialog}
                onSubmit={handleSubmitUser}
                user={editingUser}
            />

            <UserView
                open={openUserViewDialog}
                onClose={handleCloseUserViewDialog}
                user={viewingUser}
                onEdit={handleOpenUserDialog}
            />

            <UserDelete
                open={openUserDeleteDialog}
                onClose={handleCloseUserDeleteDialog}
                user={deletingUser}
                onConfirm={handleConfirmDeleteUser}
            />


            <RecordCreate
                open={openRecordDialog}
                onClose={handleCloseRecordDialog}
                onSubmit={handleSubmitRecord}
                record={editingRecord}
                organizations={organizations}
                clients={clients}
                users={users}
            />


            <RecordView
                open={openRecordViewDialog}
                onClose={handleCloseRecordViewDialog}
                record={viewingRecord}
                onEdit={handleOpenRecordDialog}
            />

            <RecordDelete
                open={openRecordDeleteDialog}
                onClose={handleCloseRecordDeleteDialog}
                record={deletingRecord}
                onConfirm={handleConfirmDeleteRecord}
            />


        </>
    );
};

export default AdminDashboard;