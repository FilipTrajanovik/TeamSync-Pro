// NotificationBell.jsx
import './NotificationBell.css';
import { Badge, IconButton } from '@mui/material';
import { Notifications } from '@mui/icons-material';

const NotificationBell = ({ unreadCount, onClick }) => {
    return (
        <IconButton className="notification-bell" onClick={onClick}>
            <Badge badgeContent={unreadCount} color="error" className="notification-badge">
                <Notifications className="bell-icon" />
            </Badge>
        </IconButton>
    );
};

export default NotificationBell;