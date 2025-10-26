import React, {useState} from 'react';
import {Avatar, Box, Button, Chip, Container, Fade, Grid, IconButton, Typography, Zoom} from '@mui/material';
import {
    Add,
    Assignment,
    Business,
    Delete,
    Edit,
    People,
    PersonAdd,
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
import useSearchFilter  from "../../../hooks/useSearchFilter.js";
import SearchFilter from '../../components/SearchFilter/SearchFilter';

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
        totalRecords: records.length,
        totalTasks: tasks.length,
        totalClients: clients.length
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
    } = useSearchFilter(
       tasks, {
           searchFields: ['title', 'description'],
           filterableFields: ['status', 'priority'],
           defaultSortBy: 'DATE_DESC'
        });


    //ORGANIZATION FILTER


    const {
        filteredData: filteredOrganizations,
        searchTerm: orgSearchTerm,
        filters: orgFilters,
        sortBy: orgSortBy,
        handleSearchChange: handleOrgSearchChange,
        handleFilterChange: handleOrgFilterChange,
        handleSortChange: handleOrgSortChange,
        clearFilters: clearOrgFilters,
        activeFiltersCount: orgActiveFiltersCount,
        resultCount: orgResultCount,
        totalCount: orgTotalCount
    } = useSearchFilter(
        organizations, {
            searchFields: ['name', 'address', 'contactInfo'],
            filterableFields: [],
            defaultSortBy: 'DATE_DESC'
        }
    )


    //CLIENT FILTER

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
        filterableFields: ['organization'],  // Filter by organization
        defaultSortBy: 'DATE_DESC'
    });

    // ORG HANDLERS
    const handleOpenDialog = (org = null) => {
        setEditingOrg(org);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingOrg(null);
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingOrg) {
                editOrganization(editingOrg.id, formData);
                alert('Organization updated successfully!');
            } else {
                addOrganization(formData);
                alert('Organization created successfully!');
            }
        } catch (error) {
            console.error('Error saving organization:', error);
            alert(`Failed to save organization: ${error.message}`);
        }
    };

    const handleDeleteOrg = async (id) => {
        if (window.confirm('Are you sure you want to delete this organization?')) {
            try {
                deleteOrganization(id);
                alert('Organization deleted successfully!');
            } catch (error) {
                console.error('Error deleting organization:', error);
                alert(`Failed to delete organization: ${error.message}`);
            }
        }
    };

    const handleViewOrg = (org) => {
        setViewingOrg(org);
        setOpenDetailsModal(true);
    };

    const handleCloseDetailsModal = () => {
        setOpenDetailsModal(false);
        setViewingOrg(null);
    };

    const handleOpenManagerDialog = () => {
        setOpenManagerDialog(true);
    };

    const handleCloseManagerDialog = () => {
        setOpenManagerDialog(false);
    };

    const handleSubmitManager = async (managerData) => {
        try {
            addUser(managerData);
            alert('Manager created successfully!');
        } catch (error) {
            console.error('Error creating manager:', error);
            alert(`Failed to create manager: ${error.message}`);
        }
    };

    // TASK HANDLERS
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
            if (editingTask) {
                editTask(editingTask.id, taskData);
            } else {
                addTask(taskData);
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

    // USER HANDLERS
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

    // RECORD HANDLERS
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
            if (recordData.id) {
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
            await deleteRecord(recordId)
            alert('Record deleted successfully!');
        } catch (error) {
            console.error('Error deleting record:', error);
            alert(`Failed to delete record: ${error.message}`);
        }
    };

    const StatCard = ({title, value, icon, delay}) => (
        <Zoom in={true} style={{transitionDelay: `${delay}ms`}}>
            <Box className="stat-card">
                <Box className="stat-card-header">
                    <Box className="stat-card-icon">
                        {icon}
                    </Box>
                    <Box className="stat-card-change">
                        <TrendingUp style={{fontSize: 18}}/>
                        <span>+12%</span>
                    </Box>
                </Box>
                <Typography className="stat-card-title">{title}</Typography>
                <Typography className="stat-card-value">{value}</Typography>
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
                        {[...Array(15)].map((_, i) => (
                            <div key={i} className="particle" style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${8 + Math.random() * 12}s`
                            }}></div>
                        ))}
                    </div>
                </div>

                <Container maxWidth="xl" className="dashboard-container">
                    {/* HERO SECTION */}
                    <Fade in={true} timeout={1000}>
                        <Box className="dashboard-hero">
                            <Box className="hero-content">
                                <Typography variant="h1">
                                    Welcome back, {/*{user?.name}*/}Filip
                                </Typography>
                                <Typography className="hero-subtitle">
                                    Your command center for total system oversight and control
                                </Typography>
                            </Box>
                            <Button
                                className="action-button"
                                startIcon={<PersonAdd/>}
                                onClick={handleOpenManagerDialog}
                            >
                                Create Manager
                            </Button>
                        </Box>
                    </Fade>

                    {/* STATS GRID */}
                    <Grid container spacing={3} className="stats-grid">
                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard
                                title="Organizations"
                                value={stats.totalOrganizations}
                                icon={<Business sx={{fontSize: 28}}/>}
                                delay={100}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard
                                title="Managers"
                                value={stats.totalManagers}
                                icon={<People sx={{fontSize: 28}}/>}
                                delay={200}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard
                                title="Users"
                                value={stats.totalUsers}
                                icon={<People sx={{fontSize: 28}}/>}
                                delay={300}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard
                                title="Records"
                                value={stats.totalRecords}
                                icon={<Assignment sx={{fontSize: 28}}/>}
                                delay={400}
                            />
                        </Grid>
                    </Grid>

                    {/* ORGANIZATIONS SECTION */}
                    <Fade in={true} timeout={1500}>
                        <Box className="section-container">
                            <Box className="section-header">
                                <Box>
                                    <Typography className="section-title">Organizations Hub</Typography>
                                    <Typography className="section-subtitle">
                                        {organizations.length} total organizations
                                    </Typography>
                                </Box>
                                <Button
                                    className="action-button"
                                    startIcon={<Add/>}
                                    onClick={() => handleOpenDialog()}
                                >
                                    Add Organization
                                </Button>
                            </Box>

                            <SearchFilter
                                searchTerm={orgSearchTerm}
                                searchPlaceholder="Search organizations by name, address..."
                                onSearchChange={handleOrgSearchChange}
                                filters={orgFilters}
                                filterOptions={{}}  // No filters, just search
                                onFilterChange={handleOrgFilterChange}
                                sortBy={orgSortBy}
                                sortOptions={[
                                    { value: 'DATE_DESC', label: 'Newest First' },
                                    { value: 'DATE_ASC', label: 'Oldest First' },
                                    { value: 'TITLE_ASC', label: 'Name A-Z' },
                                    { value: 'TITLE_DESC', label: 'Name Z-A' }
                                ]}
                                onSortChange={handleOrgSortChange}
                                onClearFilters={clearOrgFilters}
                                activeFiltersCount={orgActiveFiltersCount}
                                resultCount={orgResultCount}
                                totalCount={orgTotalCount}
                                showFilters={false}  // Hide filter dropdowns (only search)
                            />


                            {orgsLoading ? (
                                <Box className="loading-container">
                                    <Typography>Loading...</Typography>
                                </Box>
                            ) : filteredOrganizations.length === 0 ? (
                                <Box className="empty-state">
                                    <Business className="empty-state-icon"/>
                                    <Typography className="empty-state-title">No organizations yet</Typography>
                                    <Typography className="empty-state-description">
                                        Get started by creating your first organization
                                    </Typography>
                                </Box>
                            ) : (
                                <Box className="cards-grid">
                                    {filteredOrganizations.map((org, index) => (
                                        <Fade key={org.id} in={true} timeout={800} style={{transitionDelay: `${index * 100}ms`}}>
                                            <Box className="org-card">
                                                <Box className="org-card-header">
                                                    <Avatar className="org-avatar">
                                                        {org.name[0]}
                                                    </Avatar>
                                                    <Box className="org-info">
                                                        <Typography className="org-name">{org.name}</Typography>
                                                        <Chip
                                                            label={org.organizationType || org.type}
                                                            size="small"
                                                            className="org-type"
                                                        />
                                                    </Box>
                                                </Box>

                                                {org.description && (
                                                    <Typography className="org-description">
                                                        {org.description}
                                                    </Typography>
                                                )}

                                                <Box className="org-details">
                                                    {org.contactEmail && (
                                                        <Box className="org-detail-item">
                                                            <span>📧</span>
                                                            <span>{org.contactEmail}</span>
                                                        </Box>
                                                    )}
                                                    {org.contactPhone && (
                                                        <Box className="org-detail-item">
                                                            <span>📞</span>
                                                            <span>{org.contactPhone}</span>
                                                        </Box>
                                                    )}
                                                    {org.address && (
                                                        <Box className="org-detail-item">
                                                            <span>📍</span>
                                                            <span>{org.address}</span>
                                                        </Box>
                                                    )}
                                                </Box>

                                                <Box className="org-actions">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleViewOrg(org)}
                                                        className="icon-button"
                                                    >
                                                        <Visibility fontSize="small"/>
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenDialog(org)}
                                                        className="icon-button"
                                                    >
                                                        <Edit fontSize="small"/>
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteOrg(org.id)}
                                                        className="icon-button"
                                                    >
                                                        <Delete fontSize="small"/>
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Fade>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Fade>

                    {/* TASKS SECTION */}
                    <Fade in={true} timeout={2000}>
                        <Box className="section-container">
                            <Box className="section-header">
                                <Box>
                                    <Typography className="section-title">Active Tasks</Typography>
                                    <Typography className="section-subtitle">
                                        {tasks.length} total tasks
                                    </Typography>
                                </Box>
                                <Button
                                    className="action-button"
                                    startIcon={<Add/>}
                                    onClick={() => handleOpenTaskDialog()}
                                >
                                    Create Task
                                </Button>
                            </Box>

                            <SearchFilter
                                searchTerm={searchTerm}
                                searchPlaceholder="Search tasks by title or description..."
                                onSearchChange={handleSearchChange}
                                filters={filters}
                                filterOptions={{
                                    status: [
                                        { value: 'ALL', label: 'All Status' },
                                        { value: 'PENDING', label: 'Pending' },
                                        { value: 'IN_PROGRESS', label: 'In Progress' },
                                        { value: 'COMPLETED', label: 'Completed' },
                                        { value: 'CANCELLED', label: 'Cancelled' },
                                        { value: 'ON_HOLD', label: 'On Hold' }
                                    ],
                                    priority: [
                                        { value: 'ALL', label: 'All Priority' },
                                        { value: 'LOW', label: 'Low' },
                                        { value: 'MEDIUM', label: 'Medium' },
                                        { value: 'HIGH', label: 'High' },
                                        { value: 'URGENT', label: 'Urgent' }
                                    ]
                                }}
                                onFilterChange={handleFilterChange}
                                sortBy={sortBy}
                                sortOptions={[
                                    { value: 'DATE_DESC', label: 'Newest First' },
                                    { value: 'DATE_ASC', label: 'Oldest First' },
                                    { value: 'TITLE_ASC', label: 'Title A-Z' },
                                    { value: 'TITLE_DESC', label: 'Title Z-A' },
                                    { value: 'PRIORITY_DESC', label: 'Priority High→Low' }
                                ]}
                                onSortChange={handleSortChange}
                                onClearFilters={clearFilters}
                                activeFiltersCount={activeFiltersCount}
                                resultCount={resultCount}
                                totalCount={totalCount}
                            />

                            {tasksLoading ? (
                                <Box className="loading-container">
                                    <Typography>Loading...</Typography>
                                </Box>
                            ) : tasks.length === 0 ? (
                                <Box className="empty-state">
                                    <Assignment className="empty-state-icon"/>
                                    <Typography className="empty-state-title">No tasks yet</Typography>
                                    <Typography className="empty-state-description">
                                        Create your first task to get started
                                    </Typography>
                                </Box>
                            ) : (
                                <Box className="cards-grid">
                                    {filteredTasks.map((task, index) => (
                                        <Fade key={task.id} in={true} timeout={800} style={{transitionDelay: `${index * 50}ms`}}>
                                            <Box className="org-card">
                                                <Box className="org-card-header">
                                                    <Avatar className="org-avatar">
                                                        📋
                                                    </Avatar>
                                                    <Box className="org-info">
                                                        <Typography className="org-name">{task.title}</Typography>
                                                        <Chip
                                                            label={task.status}
                                                            size="small"
                                                            className="org-type"
                                                        />
                                                    </Box>
                                                </Box>

                                                {task.description && (
                                                    <Typography className="org-description">
                                                        {task.description.substring(0, 100)}...
                                                    </Typography>
                                                )}

                                                <Box className="org-details">
                                                    {task.priority && (
                                                        <Box className="org-detail-item">
                                                            <span>⚡</span>
                                                            <span>{task.priority}</span>
                                                        </Box>
                                                    )}
                                                    {task.dueDate && (
                                                        <Box className="org-detail-item">
                                                            <span>📅</span>
                                                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                                        </Box>
                                                    )}
                                                </Box>

                                                <Box className="org-actions">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenTaskViewDialog(task)}
                                                        className="icon-button"
                                                    >
                                                        <Visibility fontSize="small"/>
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenTaskDialog(task)}
                                                        className="icon-button"
                                                    >
                                                        <Edit fontSize="small"/>
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenTaskDeleteDialog(task)}
                                                        className="icon-button"
                                                    >
                                                        <Delete fontSize="small"/>
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Fade>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Fade>

                    {/* CLIENTS SECTION */}
                    <Fade in={true} timeout={2500}>
                        <Box className="section-container">
                            <Box className="section-header">
                                <Box>
                                    <Typography className="section-title">Clients</Typography>
                                    <Typography className="section-subtitle">
                                        {clients.length} total clients
                                    </Typography>
                                </Box>
                                <Button
                                    className="action-button"
                                    startIcon={<Add/>}
                                    onClick={() => handleOpenClientDialog()}
                                >
                                    Add Client
                                </Button>
                            </Box>


                            <SearchFilter
                                searchTerm={clientSearchTerm}
                                searchPlaceholder="Search clients by name, email, phone..."
                                onSearchChange={handleClientSearchChange}
                                filters={clientFilters}
                                filterOptions={{
                                    organization: [
                                        { value: 'ALL', label: 'All Organizations' },
                                        ...organizations.map(org => ({
                                            value: org.id.toString(),
                                            label: org.name
                                        }))
                                    ]
                                }}
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
                            />

                            {clientsLoading ? (
                                <Box className="loading-container">
                                    <Typography>Loading...</Typography>
                                </Box>
                            ) : filteredClients.length === 0 ? (
                                <Box className="empty-state">
                                    <People className="empty-state-icon"/>
                                    <Typography className="empty-state-title">No clients yet</Typography>
                                    <Typography className="empty-state-description">
                                        Add your first client to get started
                                    </Typography>
                                </Box>
                            ) : (
                                <Box className="cards-grid">
                                    {filteredClients.map((client, index) => (
                                        <Fade key={client.id} in={true} timeout={800} style={{transitionDelay: `${index * 50}ms`}}>
                                            <Box className="org-card">
                                                <Box className="org-card-header">
                                                    <Avatar className="org-avatar">
                                                        {client.firstName[0]}{client.lastName[0]}
                                                    </Avatar>
                                                    <Box className="org-info">
                                                        <Typography className="org-name">
                                                            {client.firstName} {client.lastName}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box className="org-details">
                                                    {client.email && (
                                                        <Box className="org-detail-item">
                                                            <span>📧</span>
                                                            <span>{client.email}</span>
                                                        </Box>
                                                    )}
                                                    {client.phoneNumber && (
                                                        <Box className="org-detail-item">
                                                            <span>📞</span>
                                                            <span>{client.phoneNumber}</span>
                                                        </Box>
                                                    )}
                                                </Box>

                                                <Box className="org-actions">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenClientViewDialog(client)}
                                                        className="icon-button"
                                                    >
                                                        <Visibility fontSize="small"/>
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenClientDialog(client)}
                                                        className="icon-button"
                                                    >
                                                        <Edit fontSize="small"/>
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenClientDeleteDialog(client)}
                                                        className="icon-button"
                                                    >
                                                        <Delete fontSize="small"/>
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Fade>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Fade>

                    {/* USERS SECTION */}
                    <Fade in={true} timeout={3000}>
                        <Box className="section-container">
                            <Box className="section-header">
                                <Box>
                                    <Typography className="section-title">Team Members</Typography>
                                    <Typography className="section-subtitle">
                                        {users.length} total users
                                    </Typography>
                                </Box>
                                <Button
                                    className="action-button"
                                    startIcon={<PersonAdd/>}
                                    onClick={() => handleOpenUserDialog()}
                                >
                                    Add User
                                </Button>
                            </Box>

                            {usersLoading ? (
                                <Box className="loading-container">
                                    <Typography>Loading...</Typography>
                                </Box>
                            ) : users.length === 0 ? (
                                <Box className="empty-state">
                                    <People className="empty-state-icon"/>
                                    <Typography className="empty-state-title">No users yet</Typography>
                                    <Typography className="empty-state-description">
                                        Add your first user to get started
                                    </Typography>
                                </Box>
                            ) : (
                                <Box className="cards-grid">
                                    {users.map((usr, index) => (
                                        <Fade key={usr.username} in={true} timeout={800} style={{transitionDelay: `${index * 50}ms`}}>
                                            <Box className="org-card">
                                                <Box className="org-card-header">
                                                    <Avatar className="org-avatar">
                                                        {usr.name[0]}{usr.surname[0]}
                                                    </Avatar>
                                                    <Box className="org-info">
                                                        <Typography className="org-name">
                                                            {usr.name} {usr.surname}
                                                        </Typography>
                                                        <Chip
                                                            label={usr.role}
                                                            size="small"
                                                            className="org-type"
                                                        />
                                                    </Box>
                                                </Box>

                                                <Box className="org-details">
                                                    <Box className="org-detail-item">
                                                        <span>👤</span>
                                                        <span>@{usr.username}</span>
                                                    </Box>
                                                </Box>

                                                <Box className="org-actions">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenUserViewDialog(usr)}
                                                        className="icon-button"
                                                    >
                                                        <Visibility fontSize="small"/>
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenUserDialog(usr)}
                                                        className="icon-button"
                                                    >
                                                        <Edit fontSize="small"/>
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenUserDeleteDialog(usr)}
                                                        className="icon-button"
                                                    >
                                                        <Delete fontSize="small"/>
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Fade>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Fade>

                    {/* RECORDS SECTION */}
                    <Fade in={true} timeout={3500}>
                        <Box className="section-container">
                            <Box className="section-header">
                                <Box>
                                    <Typography className="section-title">Records</Typography>
                                    <Typography className="section-subtitle">
                                        {records.length} total records
                                    </Typography>
                                </Box>
                                <Button
                                    className="action-button"
                                    startIcon={<Add/>}
                                    onClick={() => handleOpenRecordDialog()}
                                >
                                    Create Record
                                </Button>
                            </Box>

                            {recordsLoading ? (
                                <Box className="loading-container">
                                    <Typography>Loading...</Typography>
                                </Box>
                            ) : records.length === 0 ? (
                                <Box className="empty-state">
                                    <Assignment className="empty-state-icon"/>
                                    <Typography className="empty-state-title">No records yet</Typography>
                                    <Typography className="empty-state-description">
                                        Create your first record to get started
                                    </Typography>
                                </Box>
                            ) : (
                                <Box className="cards-grid">
                                    {records.map((record, index) => (
                                        <Fade key={record.id} in={true} timeout={800} style={{transitionDelay: `${index * 50}ms`}}>
                                            <Box className="org-card">
                                                <Box className="org-card-header">
                                                    <Avatar className="org-avatar">
                                                        📄
                                                    </Avatar>
                                                    <Box className="org-info">
                                                        <Typography className="org-name">
                                                            Record #{record.id}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                {record.description && (
                                                    <Typography className="org-description">
                                                        {record.description.substring(0, 100)}...
                                                    </Typography>
                                                )}

                                                <Box className="org-details">
                                                    {record.createdAt && (
                                                        <Box className="org-detail-item">
                                                            <span>📅</span>
                                                            <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                                                        </Box>
                                                    )}
                                                </Box>

                                                <Box className="org-actions">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenRecordViewDialog(record)}
                                                        className="icon-button"
                                                    >
                                                        <Visibility fontSize="small"/>
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenRecordDialog(record)}
                                                        className="icon-button"
                                                    >
                                                        <Edit fontSize="small"/>
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenRecordDeleteDialog(record)}
                                                        className="icon-button"
                                                    >
                                                        <Delete fontSize="small"/>
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Fade>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Fade>

                </Container>
            </Box>

            {/* ALL MODALS */}
            <OrganizationForm
                open={openDialog}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
                organization={editingOrg}
            />

            <OrganizationDetailsModal
                open={openDetailsModal}
                onClose={handleCloseDetailsModal}
                organization={viewingOrg}
            />

            <CreateManagerForm
                open={openManagerDialog}
                onClose={handleCloseManagerDialog}
                onSubmit={handleSubmitManager}
                organizations={organizations}
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
            />

            <TaskDelete
                open={openTaskDeleteDialog}
                onClose={handleCloseTaskDeleteDialog}
                onConfirm={handleConfirmDeleteTask}
                task={deletingTask}
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
            />

            <ClientDelete
                open={openClientDeleteDialog}
                onClose={handleCloseClientDeleteDialog}
                onConfirm={handleConfirmDeleteClient}
                client={deletingClient}
            />

            <UserCreate
                open={openUserDialog}
                onClose={handleCloseUserDialog}
                onSubmit={handleSubmitUser}
                user={editingUser}
                organizations={organizations}
            />

            <UserView
                open={openUserViewDialog}
                onClose={handleCloseUserViewDialog}
                user={viewingUser}
            />

            <UserDelete
                open={openUserDeleteDialog}
                onClose={handleCloseUserDeleteDialog}
                onConfirm={handleConfirmDeleteUser}
                user={deletingUser}
            />

            <RecordCreate
                open={openRecordDialog}
                onClose={handleCloseRecordDialog}
                onSubmit={handleSubmitRecord}
                record={editingRecord}
                clients={clients}
            />

            <RecordView
                open={openRecordViewDialog}
                onClose={handleCloseRecordViewDialog}
                record={viewingRecord}
            />

            <RecordDelete
                open={openRecordDeleteDialog}
                onClose={handleCloseRecordDeleteDialog}
                onConfirm={handleConfirmDeleteRecord}
                record={deletingRecord}
            />
        </>
    );
};

export default AdminDashboard;