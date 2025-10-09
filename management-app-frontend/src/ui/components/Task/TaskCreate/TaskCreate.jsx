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
    Close as CloseIcon,
    Assignment as AssignmentIcon,
    CalendarToday as CalendarIcon,
    Business as BusinessIcon,
    Person as PersonIcon,
    Group as GroupIcon
} from '@mui/icons-material';
import './TaskCreate.css';

const TaskCreate = ({ open, onClose, onSubmit, task = null, users = [], organizations = [], clients = [], isManagerView=false }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'PENDING',
        priority: 'MEDIUM',
        dueDate: '',
        clientId: '',
        assignedToUserId: '',
        organizationId: ''
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
                organizationId: task.organizationId || ''
            });
        } else {
            resetForm();
        }
    }, [task, open]);

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            status: 'PENDING',
            priority: 'MEDIUM',
            dueDate: '',
            clientId: '',
            assignedToUserId: '',
            organizationId: ''
        });
        setErrors({});
    };

    const priorities = [
        { value: 'LOW', label: 'Low', icon: '🟢', gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' },
        { value: 'MEDIUM', label: 'Medium', icon: '🟡', gradient: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)' },
        { value: 'HIGH', label: 'High', icon: '🟠', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
        { value: 'URGENT', label: 'Urgent', icon: '🔴', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }
    ];

    const statuses = [
        { value: 'PENDING', label: 'Pending', color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.4)' },
        { value: 'IN_PROGRESS', label: 'In Progress', color: '#60a5fa', glow: 'rgba(96, 165, 250, 0.4)' },
        { value: 'COMPLETED', label: 'Completed', color: '#34d399', glow: 'rgba(52, 211, 153, 0.4)' },
        { value: 'ON_HOLD', label: 'On Hold', color: '#94a3b8', glow: 'rgba(148, 163, 184, 0.4)' },
        { value: 'CANCELLED', label: 'Cancelled', color: '#f87171', glow: 'rgba(248, 113, 113, 0.4)' }
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
        if (!formData.organizationId) newErrors.organizationId = 'Organization is required';

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

    const selectedStatus = statuses.find(s => s.value === formData.status);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                className: 'modern-task-dialog'
            }}
        >
            {/* Animated Background Elements */}
            <div className="task-dialog-bg">
                <div className="floating-orb orb-1"></div>
                <div className="floating-orb orb-2"></div>
                <div className="floating-orb orb-3"></div>
            </div>

            {/* Header */}
            <Box className="modern-task-header">
                <Box className="header-content">
                    <Box className="header-icon-wrapper">
                        <AssignmentIcon className="header-icon" />
                        <div className="icon-pulse"></div>
                    </Box>
                    <Box>
                        <Typography variant="h4" className="header-title">
                            {task ? '✨ Edit Task' : '🚀 Create New Task'}
                        </Typography>
                        <Typography className="header-subtitle">
                            {task ? 'Update your task details below' : 'Fill in the magic and watch it happen'}
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={handleClose} className="modern-close-btn">
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Content */}
            <Box className="modern-task-content">
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Main Info Card */}
                        <Grid item xs={12}>
                            <Box className="info-section">
                                <Typography className="section-label">📝 Task Information</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={isManagerView ? 12 : 6}>
                                        <Box className={`modern-input-wrapper ${focusedField === 'title' ? 'focused' : ''}`}>
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
                                                placeholder="Enter an awesome task title..."
                                                variant="outlined"
                                                className="modern-input"
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={isManagerView ? 12 : 6}>
                                        <Box className={`modern-input-wrapper ${focusedField === 'description' ? 'focused' : ''}`}>
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
                                                className="modern-input"
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>

                        {/* Priority Section */}
                        <Grid item xs={12} md={isManagerView ? 12 : 6}>
                            <Box className="info-section">
                                <Typography className="section-label">⚡ Priority Level</Typography>
                                <Box className="priority-selector">
                                    {priorities.map((priority) => (
                                        <Box
                                            key={priority.value}
                                            className={`priority-pill ${formData.priority === priority.value ? 'selected' : ''}`}
                                            onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                                            sx={{
                                                background: formData.priority === priority.value ? priority.gradient : 'rgba(255,255,255,0.05)',
                                            }}
                                        >
                                            <span className="priority-icon">{priority.icon}</span>
                                            <span className="priority-label">{priority.label}</span>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Grid>

                        {/* Status & Date Section - Only for Admin */}
                        {!isManagerView && (
                            <Grid item xs={12} md={6}>
                                <Box className="info-section">
                                    <Typography className="section-label">📊 Status & Date</Typography>
                                    <Box className="status-date-wrapper">
                                        <Box className="status-chips">
                                            {statuses.map((status) => (
                                                <Chip
                                                    key={status.value}
                                                    label={status.label}
                                                    onClick={() => setFormData(prev => ({ ...prev, status: status.value }))}
                                                    className={`status-chip ${formData.status === status.value ? 'selected' : ''}`}
                                                    sx={{
                                                        background: formData.status === status.value ? status.color : 'rgba(255,255,255,0.05)',
                                                        color: formData.status === status.value ? '#000' : '#fff',
                                                        fontWeight: formData.status === status.value ? 'bold' : 'normal',
                                                        boxShadow: formData.status === status.value ? `0 0 20px ${status.glow}` : 'none',
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                        <Box className={`modern-input-wrapper date-input ${focusedField === 'dueDate' ? 'focused' : ''}`}>
                                            <CalendarIcon className="input-icon" />
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
                                                className="modern-input"
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        )}

                        {/* Assignment Section - Only for Admin */}
                        {!isManagerView && (
                            <Grid item xs={12}>
                                <Box className="info-section">
                                    <Typography className="section-label">👥 Assignment Details</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <Box className={`modern-select-wrapper ${focusedField === 'org' ? 'focused' : ''}`}>
                                                <BusinessIcon className="select-icon" />
                                                <FormControl fullWidth required error={!!errors.organizationId}>
                                                    <InputLabel>Organization</InputLabel>
                                                    <Select
                                                        name="organizationId"
                                                        value={formData.organizationId}
                                                        onChange={handleChange}
                                                        onFocus={() => setFocusedField('org')}
                                                        onBlur={() => setFocusedField('')}
                                                        label="Organization"
                                                        className="modern-select"
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
                                            <Box className={`modern-select-wrapper ${focusedField === 'client' ? 'focused' : ''}`}>
                                                <PersonIcon className="select-icon" />
                                                <FormControl fullWidth>
                                                    <InputLabel>Client (Optional)</InputLabel>
                                                    <Select
                                                        name="clientId"
                                                        value={formData.clientId}
                                                        onChange={handleChange}
                                                        onFocus={() => setFocusedField('client')}
                                                        onBlur={() => setFocusedField('')}
                                                        label="Client (Optional)"
                                                        className="modern-select"
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
                                            <Box className={`modern-select-wrapper ${focusedField === 'user' ? 'focused' : ''}`}>
                                                <GroupIcon className="select-icon" />
                                                <FormControl fullWidth>
                                                    <InputLabel>Assigned To (Optional)</InputLabel>
                                                    <Select
                                                        name="assignedToUserId"
                                                        value={formData.assignedToUserId}
                                                        onChange={handleChange}
                                                        onFocus={() => setFocusedField('user')}
                                                        onBlur={() => setFocusedField('')}
                                                        label="Assigned To (Optional)"
                                                        className="modern-select"
                                                    >
                                                        <MenuItem value="">
                                                            <em>Unassigned</em>
                                                        </MenuItem>
                                                        {users.map((user) => (
                                                            <MenuItem key={user.id} value={user.username}>
                                                                {user.name} {user.surname} ({user.username})
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

                        {/* Read-only info for managers when editing */}
                        {isManagerView && task && (
                            <Grid item xs={12}>
                                <Box className="info-section" sx={{ opacity: 0.8, bgcolor: 'action.hover', p: 2, borderRadius: 2 }}>
                                    <Typography className="section-label" sx={{ mb: 2 }}>ℹ️ Task Details (Read-only)</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="caption" color="text.secondary" display="block">Status</Typography>
                                            <Chip
                                                label={task.status?.replace('_', ' ')}
                                                size="small"
                                                sx={{ mt: 0.5 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="caption" color="text.secondary" display="block">Assigned To</Typography>
                                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                {task.assignedToUserName || 'Unassigned'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="caption" color="text.secondary" display="block">Due Date</Typography>
                                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </form>
            </Box>

            {/* Footer Actions */}
            <Box className="modern-task-footer">
                <Button
                    onClick={handleClose}
                    className="cancel-btn"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    className="submit-btn"
                >
                    <span className="btn-icon">{task ? '💾' : '✨'}</span>
                    <span className="btn-text">{task ? 'Update Task' : 'Create Task'}</span>
                    <div className="btn-glow"></div>
                </Button>
            </Box>
        </Dialog>
    );
};

export default TaskCreate;