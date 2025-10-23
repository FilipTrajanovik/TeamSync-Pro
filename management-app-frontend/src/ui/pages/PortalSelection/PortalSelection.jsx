import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Typography, Card, CardContent, Skeleton, Fade } from '@mui/material';
import {
    AdminPanelSettings,
    Business,
    Person,
    ArrowForward
} from '@mui/icons-material';
import './PortalSelection.css';

const PortalSelection = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [hoveredCard, setHoveredCard] = useState(null);

    // Simulate initial load (remove this in production if not needed)
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const portals = [
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
        // Add haptic feedback for mobile
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        navigate(path);
    };

    const handleKeyPress = (event, path) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handlePortalClick(path);
        }
    };

    // Skeleton loader for cards
    const SkeletonCard = () => (
        <Card className="portal-card skeleton-card">
            <CardContent className="portal-card-content">
                <Skeleton
                    variant="circular"
                    width={100}
                    height={100}
                    sx={{
                        margin: '0 auto 2rem',
                        bgcolor: 'rgba(99, 102, 241, 0.1)'
                    }}
                />
                <Skeleton
                    variant="text"
                    height={40}
                    sx={{
                        marginBottom: '0.75rem',
                        bgcolor: 'rgba(99, 102, 241, 0.1)'
                    }}
                />
                <Skeleton
                    variant="text"
                    height={24}
                    sx={{
                        marginBottom: '2rem',
                        bgcolor: 'rgba(99, 102, 241, 0.1)'
                    }}
                />
                <Skeleton
                    variant="text"
                    height={30}
                    width={150}
                    sx={{
                        margin: '0 auto',
                        bgcolor: 'rgba(99, 102, 241, 0.1)'
                    }}
                />
            </CardContent>
        </Card>
    );

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
                <Fade in={!loading} timeout={800}>
                    <Box className="portal-header">
                        <Typography className="portal-title">
                            Welcome to TeamSync Pro
                        </Typography>
                        <Typography className="portal-subtitle">
                            Select your portal to continue
                        </Typography>
                    </Box>
                </Fade>

                {/* Portal Cards */}
                <Grid container spacing={4} className="portal-grid-container" justifyContent="center">
                    {loading ? (
                        // Show skeleton loaders while loading
                        portals.map((portal, index) => (
                            <Grid item xs={12} md={4} key={portal.id}>
                                <Fade in={loading} timeout={300} style={{ transitionDelay: `${index * 100}ms` }}>
                                    <div>
                                        <SkeletonCard />
                                    </div>
                                </Fade>
                            </Grid>
                        ))
                    ) : (
                        // Show actual cards after loading
                        portals.map((portal, index) => (
                            <Grid item xs={12} md={4} key={portal.id}>
                                <Fade
                                    in={!loading}
                                    timeout={600}
                                    style={{ transitionDelay: `${index * 150}ms` }}
                                >
                                    <Card
                                        className={`portal-card ${hoveredCard === portal.id ? 'hovered' : ''}`}
                                        onClick={() => handlePortalClick(portal.path)}
                                        onMouseEnter={() => setHoveredCard(portal.id)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                        onKeyPress={(e) => handleKeyPress(e, portal.path)}
                                        tabIndex={0}
                                        role="button"
                                        aria-label={`Navigate to ${portal.title}`}
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

                                        {/* Ripple effect on click */}
                                        <div className="click-ripple"></div>
                                    </Card>
                                </Fade>
                            </Grid>
                        ))
                    )}
                </Grid>

                {/* Footer */}
                <Fade in={!loading} timeout={1000} style={{ transitionDelay: '500ms' }}>
                    <Box className="portal-footer">
                        <Typography className="footer-text">
                            Need assistance? Contact support@teamsyncpro.com
                        </Typography>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default PortalSelection;