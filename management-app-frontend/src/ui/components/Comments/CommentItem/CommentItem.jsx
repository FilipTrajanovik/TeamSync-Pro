import {useState} from "react";
import {useAuth} from "../../../../hooks/useAuth.js";
import {
    Avatar,
    Box,
    IconButton,
    Typography,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import {Delete, Edit, Check, Close} from "@mui/icons-material";


const CommentItem = ({comment ,onEdit, onDelete}) => {


    const {user} = useAuth()

    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(comment.text);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const canEdit = comment.username === user?.username;
    const canDelete = comment.username === user?.username || user?.role === 'ADMIN' || user?.role === 'MANAGER';
    if (!comment) {
        return null
    }
    const handleEditClick = () => {
        setIsEditing(true);
        setEditedText(comment.text);
    }

    const handelSaveEdit = () => {
        if(editedText.trim() === '') {
            alert("Comment cannot be empty!")
            return;
        }

        if(editedText === comment.text) {
            setIsEditing(false);
            return;
        }

        onEdit(comment.id, {
            text: editedText,
            taskId: comment.taskId,
            username: comment.username,
            createdAt: comment.createdAt,
            updatedAt: new Date().toISOString().slice(0, -1),
            isEdited: true
        })
    }

    const handelCancelEdit = () => {
        setIsEditing(false);
        setEditedText(comment.text);
    }

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = () => {
        onDelete(comment.id)
        setDeleteDialogOpen(false)
    }

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false)
    }

    return (
        <>
            <Box className="comment-item">
                {/* Header: Avatar + Username + Timestamp */}
                <Box className="comment-header">
                    <Avatar className="comment-avatar">
                        {comment.username[0].toUpperCase()}
                    </Avatar>
                    <Box className="comment-meta">
                        <Typography className="comment-username">
                            {comment.username}
                        </Typography>
                        <Box className="comment-timestamp">
                            <Typography className="comment-time">
                                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Typography>
                            {comment.isEdited && (
                                <Typography className="comment-edited-badge">
                                    (edited)
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* Body: Text or Edit Mode */}
                <Box className="comment-body">
                    {isEditing ? (
                        <>
                            <TextField
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value)}
                                fullWidth
                                multiline
                                rows={3}
                                className="comment-edit-input"
                                autoFocus
                            />
                            <Box className="comment-edit-actions">
                                <Button
                                    onClick={handelSaveEdit}
                                    startIcon={<Check />}
                                    className="comment-save-btn"
                                    variant="contained"
                                    size="small"
                                >
                                    Save
                                </Button>
                                <Button
                                    onClick={handelCancelEdit}
                                    startIcon={<Close />}
                                    className="comment-cancel-btn"
                                    size="small"
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <Typography className="comment-text">
                            {comment.text}
                        </Typography>
                    )}
                </Box>

                {/* Actions: Edit & Delete Buttons */}
                {!isEditing && (
                    <Box className="comment-actions">
                        {canEdit && (
                            <IconButton
                                onClick={handleEditClick}
                                className="comment-action-btn edit"
                                size="small"
                            >
                                <Edit fontSize="small" />
                            </IconButton>
                        )}
                        {canDelete && (
                            <IconButton
                                onClick={handleDeleteClick}
                                className="comment-action-btn delete"
                                size="small"
                            >
                                <Delete fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                )}
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCancelDelete}
                PaperProps={{
                    className: 'delete-dialog'
                }}
            >
                <DialogTitle className="delete-dialog-title">
                    Delete Comment?
                </DialogTitle>
                <DialogContent className="delete-dialog-content">
                    <Typography>
                        Are you sure you want to delete this comment? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions className="delete-dialog-actions">
                    <Button
                        onClick={handleCancelDelete}
                        className="delete-dialog-cancel"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        className="delete-dialog-confirm"
                        variant="contained"
                        color="error"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );


}
export default CommentItem