import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import {
    AdminPanelSettings,
    Business,
    Person,
    ArrowForward
} from '@mui/icons-material';
import './PortalSelection.css';

const PortalSelection = () => {
    const navigate = useNavigate();

    const portals = [
        {
            id: 'admin',
            title: 'Admin Portal',
            description: 'Full system access and management',
            icon: <AdminPanelSettings />,
            path: '/admin/login',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#667eea'
        },
        {
            id: 'manager',
            title: 'Manager Portal',
            description: 'Manage organizations and clients',
            icon: <Business />,
            path: '/manager/login',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: '#f093fb'
        },
        {
            id: 'user',
            title: 'User Portal',
            description: 'Access your personal dashboard',
            icon: <Person />,
            path: '/user/login',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: '#4facfe'
        }
    ];

    const handlePortalClick = (path) => {
        navigate(path);
    };

    return (
        <Box className="portal-selection-container">
            {/* Animated Background */}
            <div className="portal-bg">
                <div className="portal-grid"></div>
                <div className="floating-particles">
                    {[...Array(40)].map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${5 + Math.random() * 10}s`
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            <Container maxWidth="lg" className="portal-content">
                {/* Header */}
                <Box className="portal-header">
                    <Typography className="portal-title">
                        Welcome to Management System
                    </Typography>
                    <Typography className="portal-subtitle">
                        Select your portal to continue
                    </Typography>
                </Box>

                {/* Portal Cards */}
                <Grid container spacing={4} className="portal-grid-container">
                    {portals.map((portal, index) => (
                        <Grid item xs={12} md={4} key={portal.id}>
                            <Card
                                className="portal-card"
                                onClick={() => handlePortalClick(portal.path)}
                                style={{
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                <div
                                    className="card-glow"
                                    style={{ background: portal.gradient }}
                                ></div>

                                <CardContent className="portal-card-content">
                                    <Box
                                        className="portal-icon-wrapper"
                                        style={{ background: portal.gradient }}
                                    >
                                        {portal.icon}
                                        <div className="icon-pulse"></div>
                                    </Box>

                                    <Typography className="portal-card-title">
                                        {portal.title}
                                    </Typography>

                                    <Typography className="portal-card-description">
                                        {portal.description}
                                    </Typography>

                                    <Box className="portal-card-footer">
                                        <span className="access-text">Access Portal</span>
                                        <ArrowForward className="arrow-icon" />
                                    </Box>
                                </CardContent>

                                <div className="hover-effect"></div>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Footer */}
                <Box className="portal-footer">
                    <Typography className="footer-text">
                        Need assistance? Contact support@managementsystem.com
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default PortalSelection;