import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    IconButton
} from '@mui/material';
import {
    Logout,
    Person,
    Dashboard,
    Settings,
    Business
} from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth.js'
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDashboard = () => {
        navigate('/dashboard');
        handleClose();
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        handleClose();
    };

    const getInitials = () => {
        if (user?.name && user?.surname) {
            return `${user.name[0]}${user.surname[0]}`.toUpperCase();
        }
        return user?.username?.[0]?.toUpperCase() || 'U';
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'ADMIN':
            case 'OWNER':
                return '#f44336';
            case 'MANAGER':
                return '#ff9800';
            case 'USER':
                return '#4caf50';
            default:
                return '#9e9e9e';
        }
    };

    return (
        <AppBar
            position="sticky"
            sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}
        >
            <Toolbar>
                <Business sx={{ mr: 2, fontSize: 32 }} />
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        flexGrow: 1,
                        fontWeight: 700,
                        letterSpacing: '0.5px'
                    }}
                >
                    Management System
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                        sx={{
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            mr: 1,
                            display: { xs: 'none', sm: 'flex' }
                        }}
                    >
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {user?.name} {user?.surname}
                        </Typography>
                        <Box
                            sx={{
                                backgroundColor: getRoleBadgeColor(user?.role),
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: 600
                            }}
                        >
                            {user?.role}
                        </Box>
                    </Box>

                    <IconButton onClick={handleClick} sx={{ p: 0 }}>
                        <Avatar
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.3)',
                                width: 45,
                                height: 45,
                                cursor: 'pointer',
                                fontWeight: 700,
                                border: '2px solid white',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.4)',
                                    transform: 'scale(1.05)'
                                }
                            }}
                        >
                            {getInitials()}
                        </Avatar>
                    </IconButton>
                </Box>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 8,
                        sx: {
                            minWidth: 250,
                            mt: 1.5,
                            borderRadius: '12px',
                            overflow: 'visible',
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 20,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        }
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <Box sx={{ px: 2, py: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                                sx={{
                                    bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    width: 50,
                                    height: 50,
                                    fontWeight: 700
                                }}
                            >
                                {getInitials()}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {user?.name} {user?.surname}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {user?.username}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Divider />

                    <MenuItem onClick={handleDashboard} sx={{ py: 1.5, px: 2 }}>
                        <ListItemIcon>
                            <Dashboard fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Dashboard</ListItemText>
                    </MenuItem>

                    <MenuItem sx={{ py: 1.5, px: 2 }}>
                        <ListItemIcon>
                            <Person fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Profile</ListItemText>
                    </MenuItem>

                    <MenuItem sx={{ py: 1.5, px: 2 }}>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Settings</ListItemText>
                    </MenuItem>

                    <Divider />

                    <MenuItem onClick={handleLogout} sx={{ py: 1.5, px: 2, color: '#f44336' }}>
                        <ListItemIcon>
                            <Logout fontSize="small" sx={{ color: '#f44336' }} />
                        </ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;