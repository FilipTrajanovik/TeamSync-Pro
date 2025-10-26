import React, { useState, useEffect } from 'react';
import {
    Dialog,
    TextField,
    Grid,
    Box,
    Typography,
    IconButton,
    Button,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import {
    Close,
    Assignment,
    CalendarToday,
    Business,
    Person,
    Group
} from '@mui/icons-material';
import './TaskCreate.css';

const TaskCreate = ({ open, onClose, onSubmit, task = null, users = [], organizations = [], clients = [], isManagerView = false }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'PENDING',
        priority: 'MEDIUM',
        dueDate: '',
        clientId: '',
        assignedToUserId: '',
        organizationId: '',
        finished: false
    });

    const [errors, setErrors] = useState({});
    const [focusedField, setFocusedField] = useState('');

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                status: task.status || 'PENDING',
                priority: task.priority || 'MEDIUM',
                dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
                clientId: task.clientId || '',
                assignedToUserId: task.assignedToUserId || '',
                organizationId: task.organizationId || '',
                finished: task.finished || false
            });
        } else {
            if (isManagerView && organizations.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    organizationId: organizations[0].id
                }));
            } else {
                resetForm();
            }
        }
    }, [task, open, isManagerView, organizations]);

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            status: 'PENDING',
            priority: 'MEDIUM',
            dueDate: '',
            clientId: '',
            assignedToUserId: '',
            organizationId: isManagerView && organizations.length > 0 ? organizations[0].id : '',
            finished: false
        });
        setErrors({});
        setFocusedField('');
    };

    const priorities = [
        { value: 'LOW', label: 'Low', icon: '🟢' },
        { value: 'MEDIUM', label: 'Medium', icon: '🟡' },
        { value: 'HIGH', label: 'High', icon: '🟠' },
        { value: 'URGENT', label: 'Urgent', icon: '🔴' }
    ];

    const statuses = [
        { value: 'PENDING', label: 'Pending' },
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'ON_HOLD', label: 'On Hold' },
        { value: 'CANCELLED', label: 'Cancelled' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';

        if (isManagerView) {
            if (!formData.clientId) newErrors.clientId = 'Client is required';
            if (!formData.assignedToUserId) newErrors.assignedToUserId = 'User assignment is required';
        } else {
            if (!formData.organizationId) newErrors.organizationId = 'Organization is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
            handleClose();
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                className: 'task-create-dialog'
            }}
        >
            {/* Header */}
            <Box className="task-create-header">
                <Box className="task-create-header-content">
                    <Box className="task-create-header-icon-wrapper">
                        <Assignment className="task-create-header-icon" />
                    </Box>
                    <Box className="task-create-header-text">
                        <Typography className="task-create-header-title">
                            {task ? 'Edit Task' : 'Create New Task'}
                        </Typography>
                        <Typography className="task-create-header-subtitle">
                            {task ? 'Update your task details below' : 'Fill in the details to create a new task'}
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={handleClose} className="task-create-close-btn">
                    <Close />
                </IconButton>
            </Box>

            {/* Content */}
            <Box className="task-create-content">
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Main Info Card */}
                        <Grid item xs={12}>
                            <Box className="task-create-info-section">
                                <Typography className="task-create-section-label">Task Information</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={isManagerView ? 12 : 6}>
                                        <Box className={`task-create-input-wrapper ${focusedField === 'title' ? 'focused' : ''}`}>
                                            <TextField
                                                name="title"
                                                label="Task Title"
                                                fullWidth
                                                required
                                                value={formData.title}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('title')}
                                                onBlur={() => setFocusedField('')}
                                                error={!!errors.title}
                                                helperText={errors.title}
                                                placeholder="Enter task title..."
                                                variant="outlined"
                                                className="task-create-input"
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={isManagerView ? 12 : 6}>
                                        <Box className={`task-create-input-wrapper ${focusedField === 'description' ? 'focused' : ''}`}>
                                            <TextField
                                                name="description"
                                                label="Description"
                                                fullWidth
                                                required
                                                multiline
                                                rows={isManagerView ? 4 : 3}
                                                value={formData.description}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('description')}
                                                onBlur={() => setFocusedField('')}
                                                error={!!errors.description}
                                                helperText={errors.description}
                                                placeholder="What needs to be done?"
                                                variant="outlined"
                                                className="task-create-input"
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>

                        {/* Priority Section */}
                        <Grid item xs={12} md={isManagerView ? 12 : 6}>
                            <Box className="task-create-info-section">
                                <Typography className="task-create-section-label">Priority Level</Typography>
                                <Box className="task-create-priority-selector">
                                    {priorities.map((priority) => (
                                        <Box
                                            key={priority.value}
                                            className={`task-create-priority-pill ${formData.priority === priority.value ? 'selected' : ''}`}
                                            onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                                        >
                                            <span className="task-create-priority-icon">{priority.icon}</span>
                                            <span className="task-create-priority-label">{priority.label}</span>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Grid>

                        {/* Client, User & Due Date Selection - For Managers */}
                        {isManagerView && (
                            <Grid item xs={12}>
                                <Box className="task-create-info-section">
                                    <Typography className="task-create-section-label">Assignment Details</Typography>
                                    <Grid container spacing={2}>
                                        {/* Client Selection */}
                                        <Grid item xs={12} md={4}>
                                            <Box className={`task-create-select-wrapper ${focusedField === 'client' ? 'focused' : ''}`}>
                                                <Person className="task-create-select-icon" />
                                                <FormControl fullWidth required error={!!errors.clientId}>
                                                    <InputLabel>Select Client</InputLabel>
                                                    <Select
                                                        name="clientId"
                                                        value={formData.clientId}
                                                        onChange={handleChange}
                                                        onFocus={() => setFocusedField('client')}
                                                        onBlur={() => setFocusedField('')}
                                                        label="Select Client"
                                                        className="task-create-select"
                                                    >
                                                        <MenuItem value="">
                                                            <em>Select a client</em>
                                                        </MenuItem>
                                                        {clients.map((client) => (
                                                            <MenuItem key={client.id} value={client.id}>
                                                                {client.firstName} {client.lastName}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </Grid>

                                        {/* User Assignment */}
                                        <Grid item xs={12} md={4}>
                                            <Box className={`task-create-select-wrapper ${focusedField === 'user' ? 'focused' : ''}`}>
                                                <Group className="task-create-select-icon" />
                                                <FormControl fullWidth required error={!!errors.assignedToUserId}>
                                                    <InputLabel>Assign To User</InputLabel>
                                                    <Select
                                                        name="assignedToUserId"
                                                        value={formData.assignedToUserId}
                                                        onChange={handleChange}
                                                        onFocus={() => setFocusedField('user')}
                                                        onBlur={() => setFocusedField('')}
                                                        label="Assign To User"
                                                        className="task-create-select"
                                                    >
                                                        <MenuItem value="">
                                                            <em>Select a team member</em>
                                                        </MenuItem>
                                                        {users.map((user) => (
                                                            <MenuItem key={user.username} value={user.username}>
                                                                {user.name} {user.surname} (@{user.username})
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </Grid>

                                        {/* Due Date */}
                                        <Grid item xs={12} md={4}>
                                            <Box className={`task-create-input-wrapper task-create-date-input ${focusedField === 'dueDate' ? 'focused' : ''}`}>
                                                <CalendarToday className="task-create-input-icon" />
                                                <TextField
                                                    name="dueDate"
                                                    label="Due Date"
                                                    type="date"
                                                    fullWidth
                                                    value={formData.dueDate}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('dueDate')}
                                                    onBlur={() => setFocusedField('')}
                                                    InputLabelProps={{ shrink: true }}
                                                    className="task-create-input"
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        )}

                        {/* Status & Date Section - Only for Admin */}
                        {!isManagerView && (
                            <Grid item xs={12} md={6}>
                                <Box className="task-create-info-section">
                                    <Typography className="task-create-section-label">Status & Date</Typography>
                                    <Box className="task-create-status-date-wrapper">
                                        <Box className="task-create-status-chips">
                                            {statuses.map((status) => (
                                                <Chip
                                                    key={status.value}
                                                    label={status.label}
                                                    onClick={() => setFormData(prev => ({ ...prev, status: status.value }))}
                                                    className={`task-create-status-chip ${formData.status === status.value ? 'selected' : ''}`}
                                                />
                                            ))}
                                        </Box>
                                        <Box className={`task-create-input-wrapper task-create-date-input ${focusedField === 'dueDate' ? 'focused' : ''}`}>
                                            <CalendarToday className="task-create-input-icon" />
                                            <TextField
                                                name="dueDate"
                                                label="Due Date"
                                                type="date"
                                                fullWidth
                                                value={formData.dueDate}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('dueDate')}
                                                onBlur={() => setFocusedField('')}
                                                InputLabelProps={{ shrink: true }}
                                                className="task-create-input"
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        )}

                        {/* Assignment Section - Only for Admin */}
                        {!isManagerView && (
                            <Grid item xs={12}>
                                <Box className="task-create-info-section">
                                    <Typography className="task-create-section-label">Assignment Details</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <Box className={`task-create-select-wrapper ${focusedField === 'org' ? 'focused' : ''}`}>
                                                <Business className="task-create-select-icon" />
                                                <FormControl fullWidth required error={!!errors.organizationId}>
                                                    <InputLabel>Organization</InputLabel>
                                                    <Select
                                                        name="organizationId"
                                                        value={formData.organizationId}
                                                        onChange={handleChange}
                                                        onFocus={() => setFocusedField('org')}
                                                        onBlur={() => setFocusedField('')}
                                                        label="Organization"
                                                        className="task-create-select"
                                                    >
                                                        <MenuItem value="">
                                                            <em>Select Organization</em>
                                                        </MenuItem>
                                                        {organizations.map((org) => (
                                                            <MenuItem key={org.id} value={org.id}>
                                                                {org.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <Box className={`task-create-select-wrapper ${focusedField === 'client' ? 'focused' : ''}`}>
                                                <Person className="task-create-select-icon" />
                                                <FormControl fullWidth>
                                                    <InputLabel>Client (Optional)</InputLabel>
                                                    <Select
                                                        name="clientId"
                                                        value={formData.clientId}
                                                        onChange={handleChange}
                                                        onFocus={() => setFocusedField('client')}
                                                        onBlur={() => setFocusedField('')}
                                                        label="Client (Optional)"
                                                        className="task-create-select"
                                                    >
                                                        <MenuItem value="">
                                                            <em>No Client</em>
                                                        </MenuItem>
                                                        {clients.map((client) => (
                                                            <MenuItem key={client.id} value={client.id}>
                                                                {client.firstName} {client.lastName}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <Box className={`task-create-select-wrapper ${focusedField === 'user' ? 'focused' : ''}`}>
                                                <Group className="task-create-select-icon" />
                                                <FormControl fullWidth>
                                                    <InputLabel>Assigned To (Optional)</InputLabel>
                                                    <Select
                                                        name="assignedToUserId"
                                                        value={formData.assignedToUserId}
                                                        onChange={handleChange}
                                                        onFocus={() => setFocusedField('user')}
                                                        onBlur={() => setFocusedField('')}
                                                        label="Assigned To (Optional)"
                                                        className="task-create-select"
                                                    >
                                                        <MenuItem value="">
                                                            <em>Unassigned</em>
                                                        </MenuItem>
                                                        {users.map((user) => (
                                                            <MenuItem key={user.username} value={user.username}>
                                                                {user.name} {user.surname} (@{user.username})
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        )}
                    </Grid>

                    {/* Footer - INSIDE FORM */}
                    <Box className="task-create-footer">
                        <Button
                            type="button"
                            onClick={handleClose}
                            className="task-create-cancel-btn"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="task-create-submit-btn"
                        >
                            <span className="task-create-btn-icon">{task ? '💾' : '✨'}</span>
                            {task ? 'Update Task' : 'Create Task'}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Dialog>
    );
};

export default TaskCreate;