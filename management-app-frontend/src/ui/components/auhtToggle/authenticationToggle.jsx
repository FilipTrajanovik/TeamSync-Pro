import React from 'react';
import { Button, Avatar, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Logout, Person, Dashboard } from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './AuthenticationToggle.css';

const AuthenticationToggle = () => {
    const { logout, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const isLoggedIn = isAuthenticated();

    const handleClick = (event) => {
        if (isLoggedIn) {
            setAnchorEl(event.currentTarget);
        } else {
            navigate("/login");
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDashboard = () => {
        navigate("/dashboard");
        handleClose();
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
        handleClose();
    };

    const getInitials = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
        }
        return user?.username?.[0]?.toUpperCase() || 'U';
    };

    if (!isLoggedIn) {
        return (
            <Button
                variant="contained"
                onClick={handleClick}
                className="login-button"
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '8px 24px',
                    borderRadius: '8px',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #663a91 100%)',
                    }
                }}
            >
                Login
            </Button>
        );
    }

    return (
        <>
            <div className="user-profile-button" onClick={handleClick}>
                <Avatar
                    sx={{
                        bgcolor: '#667eea',
                        width: 40,
                        height: 40,
                        cursor: 'pointer',
                        fontWeight: 600,
                        '&:hover': {
                            bgcolor: '#5568d3',
                        }
                    }}
                >
                    {getInitials()}
                </Avatar>
                <div className="user-info">
                    <span className="user-name">
                        {user?.firstName} {user?.lastName}
                    </span>
                    <span className="user-role">{user?.role}</span>
                </div>
            </div>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        minWidth: 200,
                        mt: 1.5,
                        borderRadius: '10px',
                        '& .MuiMenuItem-root': {
                            padding: '10px 16px',
                        }
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <div className="menu-user-info">
                    <Avatar
                        sx={{
                            bgcolor: '#667eea',
                            width: 50,
                            height: 50,
                            margin: '0 auto 10px',
                            fontWeight: 600
                        }}
                    >
                        {getInitials()}
                    </Avatar>
                    <div className="menu-user-name">
                        {user?.firstName} {user?.lastName}
                    </div>
                    <div className="menu-user-email">{user?.email}</div>
                </div>

                <Divider sx={{ my: 1 }} />

                <MenuItem onClick={handleDashboard}>
                    <ListItemIcon>
                        <Dashboard fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Dashboard</ListItemText>
                </MenuItem>

                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" sx={{ color: '#f44336' }} />
                    </ListItemIcon>
                    <ListItemText sx={{ color: '#f44336' }}>Logout</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};

export default AuthenticationToggle;