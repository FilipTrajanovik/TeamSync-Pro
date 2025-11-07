import {useState} from "react";
import {Box, TextField, IconButton} from "@mui/material";
import {Send} from "@mui/icons-material";

const CommentForm = ({taskId, onSubmit}) => {

    const [text, setText] = useState('');

    const handleSubmit = () => {
        if(text.trim() === '') {
            alert('Please enter a comment');
            return;
        }

        onSubmit({
            text: text,
            taskId: taskId,
            username: "",
            createdAt: new Date().toISOString().slice(0, -1),
            updatedAt: null,
            isEdited: false
        })

        setText('')
    }

    return (
        <Box className="comment-form">
            <TextField
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a comment..."
                fullWidth
                multiline
                maxRows={4}
                className="comment-form-input"
                onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                    }
                }}
            />
            <IconButton
                onClick={handleSubmit}
                className="comment-form-submit"
                disabled={!text.trim()}
            >
                <Send />
            </IconButton>
        </Box>
    );

}
export default CommentForm