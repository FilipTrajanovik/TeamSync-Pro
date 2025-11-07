import './NotificationDropdown.css'
import { Box, Dialog, Divider, Typography, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import NotificationItem from "../NotificationItem/NotificationItem.jsx";

const NotificationDropdown = ({open, onClose, notifications, onMarkAsRead, onMarkAsUnread}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                className: 'notification-dropdown'
            }}
        >
            <Box className="notification-dropdown-header">
                <Typography className="notification-dropdown-title">
                    Notifications
                </Typography>
                <IconButton onClick={onClose} className="notification-dropdown-close">
                    <Close />
                </IconButton>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            <Box className="notification-dropdown-content">
                {notifications.length === 0 ? (
                    <Box className="notification-dropdown-empty">
                        <Typography>No notifications yet</Typography>
                    </Box>
                ) : (
                    notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onMarkAsRead={onMarkAsRead}
                                onMarkAsUnread={onMarkAsUnread}
                            />
                    ))
                )}
            </Box>
        </Dialog>
    );
}
export default NotificationDropdown