import {useEffect, useState} from "react";
import useComments from "../../../../hooks/useComments.js";
import {Box, CircularProgress, Dialog, IconButton, Typography} from "@mui/material";
import {Close} from "@mui/icons-material";
import CommentItem from "../CommentItem/CommentItem.jsx";
import CommentForm from "../CommentForm/CommentForm.jsx";
import './CommentList.css'


const CommentList = ({open, onClose, taskId, taskTitle}) => {



    const {
        comments,
        loading,
        fetchCommentsByTask,
        onAdd,
        onEdit,
        onDelete
    } = useComments();


    useEffect(() => {
        if(open && taskId){
            fetchCommentsByTask(taskId)
        }
    }, [open, taskId, fetchCommentsByTask]);

    if(!taskId){
        return null
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                className: 'comment-list-dialog'
            }}
        >
            <Box className="comment-list-header">
                <Typography className="comment-list-title">
                    Comments for "{taskTitle}"
                </Typography>
                <IconButton onClick={onClose} className="comment-list-close">
                    <Close />
                </IconButton>
            </Box>

            <Box className="comment-list-content">
                {loading ? (
                    <Box className="comment-list-loading">
                        <CircularProgress sx={{ color: '#fff' }} />
                    </Box>
                ) : comments.length === 0 ? (
                    <Box className="comment-list-empty">
                        <Typography>
                            No comments yet. Be the first to comment!
                        </Typography>
                    </Box>
                ) : (
                    <Box className="comment-list-items">
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </Box>
                )}
            </Box>

            <Box className="comment-list-footer">
                <CommentForm
                    taskId={taskId}
                    onSubmit={onAdd}
                />
            </Box>
        </Dialog>
    );
}
export default CommentList;