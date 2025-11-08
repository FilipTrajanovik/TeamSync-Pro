import React, {useState} from 'react';
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
import {useAuth} from '../../../hooks/useAuth.js'
import {useNavigate} from 'react-router-dom';
import './Navbar.css';
import useNotifications from "../../../hooks/useNotifications.js";
import NotificationDropdown from "../Notifications/NotificationDropdown/NotificationDropdown.jsx";
import NotificationBell from "../Notifications/NotificationBell/NotificationBell.jsx";

const Navbar = () => {
    const {logout, user} = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const {
        notifications,
        unreadCount,
        loading,
        fetchMyNotifications,
        getUnreadNotifications,
        fetchUnreadCount,
        markItAsRead,
        markItAsUnread
    } = useNotifications()

    const [openNotificationView, setOpenNotificationView] = useState(false)


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

    const handleNotificationsOpen= () => {
        fetchMyNotifications()
        setOpenNotificationView(true)
    }

    const handleNotificationsClose = () => {
        setOpenNotificationView(false)
    }

    const getInitials = () => {
        if (user?.name && user?.surname) {
            return `${user.name[0]}${user.surname[0]}`.toUpperCase();
        }
        return user?.username?.[0]?.toUpperCase() || 'U';
    };

    const handleSettings = () => {
        navigate('/settings');
        handleClose();
    }

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'ADMIN':
            case 'OWNER':
                return '#ff4444';
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
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
            }}
        >
            <Toolbar sx={{padding: '12px 24px'}}>
                <Business sx={{mr: 2, fontSize: 32, color: '#ffffff'}}/>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        flexGrow: 1,
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        color: '#ffffff',
                        fontSize: '18px'
                    }}
                >
                    Management System
                </Typography>

                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <IconButton onClick={handleNotificationsOpen} sx={{ p: 0 }}>
                        <NotificationBell unreadCount={unreadCount} />
                    </IconButton>
                    <Box
                        sx={{
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            mr: 1,
                            display: {xs: 'none', sm: 'flex'}
                        }}
                    >
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 600,
                                color: '#ffffff'
                            }}
                        >
                            {user?.name} {user?.surname}
                        </Typography>
                        <Box
                            sx={{
                                backgroundColor: getRoleBadgeColor(user?.role),
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            {user?.role}
                        </Box>
                    </Box>

                    <IconButton onClick={handleClick} sx={{p: 0}}>
                        <Avatar
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.15)',
                                width: 45,
                                height: 45,
                                cursor: 'pointer',
                                fontWeight: 700,
                                color: '#ffffff',
                                border: '2px solid rgba(255, 255, 255, 0.2)',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                                    transform: 'scale(1.05)',
                                    borderColor: 'rgba(255, 255, 255, 0.3)'
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
                            background: 'rgba(18, 18, 18, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 20,
                                width: 10,
                                height: 10,
                                bgcolor: 'rgba(18, 18, 18, 0.95)',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderBottom: 'none',
                                borderRight: 'none'
                            },
                        }
                    }}
                    transformOrigin={{horizontal: 'right', vertical: 'top'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                >
                    <Box sx={{px: 2, py: 2}}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                            <Avatar
                                sx={{
                                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                                    width: 50,
                                    height: 50,
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    border: '2px solid rgba(255, 255, 255, 0.2)'
                                }}
                            >
                                {getInitials()}
                            </Avatar>
                            <Box>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 600,
                                        color: '#ffffff'
                                    }}
                                >
                                    {user?.name} {user?.surname}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.6)'
                                    }}
                                >
                                    {user?.username}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{borderColor: 'rgba(255, 255, 255, 0.1)'}}/>

                    <MenuItem
                        onClick={handleDashboard}
                        sx={{
                            py: 1.5,
                            px: 2,
                            color: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.08)'
                            }
                        }}
                    >
                        <ListItemIcon>
                            <Dashboard fontSize="small" sx={{color: 'rgba(255, 255, 255, 0.9)'}}/>
                        </ListItemIcon>
                        <ListItemText>Dashboard</ListItemText>
                    </MenuItem>

                    <MenuItem
                        sx={{
                            py: 1.5,
                            px: 2,
                            color: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.08)'
                            }
                        }}
                    >
                        <ListItemIcon>
                            <Person fontSize="small" sx={{color: 'rgba(255, 255, 255, 0.9)'}}/>
                        </ListItemIcon>
                        <ListItemText>Profile</ListItemText>
                    </MenuItem>

                    <MenuItem
                        sx={{
                            py: 1.5,
                            px: 2,
                            color: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.08)'
                            }
                        }}
                        onClick={handleSettings}
                    >
                        <ListItemIcon>
                            <Settings fontSize="small" sx={{color: 'rgba(255, 255, 255, 0.9)'}}/>
                        </ListItemIcon>
                        <ListItemText>Settings</ListItemText>
                    </MenuItem>

                    <Divider sx={{borderColor: 'rgba(255, 255, 255, 0.1)'}}/>

                    <MenuItem
                        onClick={handleLogout}
                        sx={{
                            py: 1.5,
                            px: 2,
                            color: '#ff4444',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 68, 68, 0.1)'
                            }
                        }}
                    >
                        <ListItemIcon>
                            <Logout fontSize="small" sx={{color: '#ff4444'}}/>
                        </ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                    </MenuItem>
                </Menu>

                <NotificationDropdown
                    open={openNotificationView}
                    onClose={handleNotificationsClose}
                    notifications={notifications}
                    onMarkAsRead={markItAsRead}
                    onMarkAsUnread={markItAsUnread}
                />
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;