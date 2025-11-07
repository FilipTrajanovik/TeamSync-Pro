// NotificationItem.jsx
import './NotificationItem.css';
import { Box, Typography, Avatar } from '@mui/material';

const NotificationItem = ({ notification, onMarkAsRead, onMarkAsUnread }) => {

    const handleClick = () => {
        if (notification.isRead) {
            onMarkAsUnread(notification.id);
        } else {
            onMarkAsRead(notification.id);
        }
    };

    return (
        <Box
            className={`notification-item ${notification.isRead ? 'notification-item-read' : 'notification-item-unread'}`}
            onClick={handleClick}
        >
            <Avatar className="notification-avatar">
                {notification.sender[0].toUpperCase()}
            </Avatar>

            <Box className="notification-content">
                <Typography className="notification-message">
                    {notification.message}
                </Typography>
                <Typography className="notification-time">
                    {new Date(notification.createdAt).toLocaleString()}
                </Typography>
            </Box>

            {!notification.isRead && (
                <span className="notification-unread-dot"></span>
            )}
        </Box>
    );
};

export default NotificationItem;