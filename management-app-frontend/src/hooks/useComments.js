import {useCallback, useEffect, useState} from "react";
import commentRepository from "../repository/commentRepository.js";

const initialState = {
    comments: [],
    loading: true
}

const useComments = () => {
    const [state, setState] = useState(initialState)

    const fetchComments = useCallback(() => {
        setState(initialState)
        commentRepository.findAll()
            .then((result) => {
                console.log("Successfully retrieved comments...");
                setState({
                    comments: result.data,
                    loading: false
                })
            }).catch((error) => {
            console.log(error);
        })
    }, [])

    const onAdd = useCallback((data) => {
        commentRepository.add(data)
            .then(() => {
                console.log("Successfully added a new comment.");
                fetchComments();
            }).catch((error) => {
            console.log(error);
        })
    }, [fetchComments])

    const onEdit = useCallback((id, data) => {
        commentRepository.edit(id, data)
            .then(() => {
                console.log("Successfully edited the comment.");
                fetchComments();
            })
            .catch((error) => {
                console.log(error);
            })
    }, [fetchComments])

    const onDelete = useCallback((id) => {
        commentRepository.delete(id)
            .then(() => {
                console.log(`Successfully deleted the comment with ID ${id}.`);
                fetchComments()
            })
            .catch((error) => {
                console.log(error);
            })
    }, [fetchComments])


    const fetchCommentsByTask = useCallback((taskId) => {
        return commentRepository.findByTask(taskId)
            .then((result) => {
                console.log(`Successfully retrieved comments for task ${taskId}.`);
                setState({
                    comments: result.data,
                    loading: false
                })
            }).catch((error) => {
            console.log(error);
        })
    }, [])

    const fetchCommentsByUser = useCallback(() => {
        return commentRepository.findByUser()
            .then((result) => {
                console.log(`Successfully retrieved comments for authenticated user.`);
                setState({
                    comments: result.data,
                    loading: false
                })
            }).catch((error) => {
            console.log(error);
        })
    }, [])

    // for tasks and users we will need fetch comments by user and task so it is better commented
    // useEffect(() => {
    //     fetchComments()
    // }, [fetchComments])

    return {
        ...state, onAdd, onEdit, onDelete, fetchCommentsByTask, fetchCommentsByUser
    };
}

export default useComments;