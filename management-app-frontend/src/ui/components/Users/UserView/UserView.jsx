// Import React and the useEffect hook for side effects
import React, { useEffect } from 'react';

// Import Material-UI components for the UI
// Dialog: Modal popup window
// Box: Flexible container for layout (like a div with styling)
// Typography: Styled text component
// IconButton: Button with just an icon
// Button: Standard button component
// Avatar: Circular profile image/icon container
// Chip: Small labeled UI element (like a badge)
import {
    Dialog,
    Box,
    Typography,
    IconButton,
    Button,
    Avatar,
    Chip
} from '@mui/material';

// Import Material-UI icons
import {
    Close as CloseIcon,
    Person as PersonIcon,
    AccountCircle as AccountCircleIcon,
    Badge as BadgeIcon,
    Edit as EditIcon,
    Business as BusinessIcon
} from '@mui/icons-material';

// Import the CSS file for styling
import './UserView.css';

/**
 * UserView Component
 *
 * Purpose: Display detailed information about a user in a modal dialog
 *
 * Props:
 * @param {boolean} open - Controls whether the dialog is visible
 * @param {function} onClose - Callback function to close the dialog
 * @param {object} user - The user object containing all user data from backend
 * @param {function} onEdit - Callback function to open the edit dialog with this user
 *
 * Backend mapping (DisplayUserDto):
 * - username: String (primary key, unique identifier)
 * - name: String (first name)
 * - surname: String (last name)
 * - role: Role enum (USER, MANAGER, ADMIN, OWNER)
 */
const UserView = ({ open, onClose, user, onEdit }) => {

    /**
     * useEffect Hook - Debug logging
     *
     * This runs whenever the 'user' prop changes
     * It logs the user data to console for debugging
     *
     * IMPORTANT: Must be called BEFORE any conditional returns
     * to follow React Hooks rules (hooks must be called in the same order every render)
     */
    useEffect(() => {
        if (user) {
            console.log('=== USER VIEW DEBUG ===');
            console.log('User object:', user);
            console.log('Username:', user.username);
            console.log('Role:', user.role);
        }
    }, [user]); // Dependency array: only re-run when 'user' changes

    /**
     * Early return if no user data
     *
     * This prevents the component from trying to render with null/undefined data
     * MUST come AFTER all hooks (useEffect above)
     */
    if (!user) return null;

    /**
     * getRoleConfig Function
     *
     * Maps role values to display properties (icon, color, label)
     * This helps maintain consistent styling for each role type
     *
     * @param {string} role - The role value (USER, MANAGER, ADMIN, OWNER)
     * @returns {object} Configuration object with icon, color, and label
     */
    const getRoleConfig = (role) => {
        const configs = {
            USER: {
                icon: '👤',
                color: '#3b82f6',  // Blue
                bg: '#dbeafe',      // Light blue background
                label: 'User'
            },
            MANAGER: {
                icon: '👨‍💼',
                color: '#f59e0b',  // Orange
                bg: '#fef3c7',      // Light orange background
                label: 'Manager'
            },
            ADMIN: {
                icon: '👑',
                color: '#ef4444',  // Red
                bg: '#fee2e2',      // Light red background
                label: 'Admin'
            },
            OWNER: {
                icon: '💎',
                color: '#8b5cf6',  // Purple
                bg: '#ede9fe',      // Light purple background
                label: 'Owner'
            }
        };
        // Return the config for the role, or default to USER config if role not found
        return configs[role] || configs.USER;
    };

    // Get the configuration for the current user's role
    const roleConfig = getRoleConfig(user.role);

    /**
     * JSX Return - Component UI Structure
     *
     * Dialog: The modal container
     * - open: Controls visibility (true/false)
     * - onClose: Function to call when user clicks outside or presses ESC
     * - maxWidth: Maximum width of dialog ("xs", "sm", "md", "lg", "xl")
     * - fullWidth: Makes dialog take up full maxWidth
     * - PaperProps: Props passed to the Paper component (the white box)
     */
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                className: 'apple-view-dialog' // CSS class for styling
            }}
        >
            {/* ========== HEADER SECTION ========== */}
            {/* Box is like a div with Material-UI styling */}
            <Box className="apple-view-header">
                {/* Close button in top right */}
                <IconButton
                    onClick={onClose}
                    className="close-button"
                >
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* ========== CONTENT SECTION ========== */}
            <Box className="apple-view-content">

                {/* Avatar: Circular profile image with initials */}
                <Avatar className="user-avatar">
                    {/*
                        Display first letter of name and surname
                        ?. is optional chaining - safely access properties that might be undefined
                        charAt(0) gets the first character
                    */}
                    {user.name?.charAt(0)}{user.surname?.charAt(0)}
                </Avatar>

                {/* User's full name */}
                <Typography className="user-name">
                    {user.name} {user.surname}
                </Typography>

                {/* Username displayed below name */}
                <Typography className="user-username">
                    @{user.username}
                </Typography>

                {/* Role badge/chip with icon and label */}
                <Chip
                    // Icon displayed before the label
                    icon={<span style={{ marginLeft: 8 }}>{roleConfig.icon}</span>}
                    label={roleConfig.label}
                    className="user-role-badge"
                    sx={{
                        // sx prop allows inline Material-UI styling
                        background: roleConfig.bg,
                        color: roleConfig.color,
                        border: `1px solid ${roleConfig.color}40` // 40 adds transparency
                    }}
                />

                {/* ========== INFORMATION CARDS ========== */}
                {/* Container for all info cards */}
                <Box className="info-cards">

                    {/* Username Info Card */}
                    <Box className="info-card">
                        {/* Card Header with icon and label */}
                        <Box className="info-card-header">
                            <AccountCircleIcon className="card-icon" />
                            <Typography className="card-label">Username</Typography>
                        </Box>
                        {/* Card Value - the actual data */}
                        <Typography className="card-value">
                            {user.username}
                        </Typography>
                    </Box>

                    {/* Full Name Info Card */}
                    <Box className="info-card">
                        <Box className="info-card-header">
                            <PersonIcon className="card-icon" />
                            <Typography className="card-label">Full Name</Typography>
                        </Box>
                        <Typography className="card-value">
                            {user.name} {user.surname}
                        </Typography>
                    </Box>

                    {/* Role Info Card */}
                    <Box className="info-card">
                        <Box className="info-card-header">
                            <BadgeIcon className="card-icon" />
                            <Typography className="card-label">Role</Typography>
                        </Box>
                        <Typography className="card-value">
                            {/* Display role icon and label together */}
                            <span style={{ marginRight: 8 }}>{roleConfig.icon}</span>
                            {roleConfig.label}
                        </Typography>
                    </Box>

                    {/*
                        Conditional Rendering: Organizations Info Card

                        Only show this card if user has organizations
                        && is the "AND" operator - only renders right side if left side is true

                        In the future, when you implement organization relationships,
                        you can uncomment and modify this section
                    */}
                    {user.organizations && user.organizations.length > 0 && (
                        <Box className="info-card">
                            <Box className="info-card-header">
                                <BusinessIcon className="card-icon" />
                                <Typography className="card-label">Organizations</Typography>
                            </Box>
                            <Typography className="card-value">
                                {/*
                                    .map() creates a new array by transforming each element
                                    .join(', ') combines array elements into a string with commas
                                */}
                                {user.organizations.map(org => org.name).join(', ')}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* ========== FOOTER SECTION ========== */}
            {/* Contains action buttons */}
            <Box className="apple-view-footer">
                {/*
                    Edit Button

                    onClick: When clicked, calls onEdit with the user object,
                    then closes this view dialog
                */}
                <Button
                    onClick={() => {
                        onEdit(user);  // Pass user to parent component's edit handler
                        onClose();      // Close this view dialog
                    }}
                    className="apple-button primary"
                    startIcon={<EditIcon />}  // Icon before button text
                    fullWidth  // Button takes full width of container
                >
                    Edit User
                </Button>
            </Box>
        </Dialog>
    );
};

// Export the component so it can be imported and used elsewhere
export default UserView;