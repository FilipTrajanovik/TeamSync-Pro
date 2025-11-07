import {useCallback, useEffect, useState} from "react";
import taskRepository from "../repository/taskRepository.js";

const initialState = {
    tasks: [],
    loading: true,
};

const useTasks = () => {
    const [state, setState] = useState(initialState);

    const fetchTasks = useCallback(() => {
        setState(initialState);
        taskRepository
            .findAll()
            .then((response) => {
                setState({
                    tasks: response.data,
                    loading: false,
                });
            })
            .catch((error) => console.log(error));
    }, []);

    const onAdd = useCallback((data) => {
        taskRepository
            .add(data)
            .then(() => {
                console.log("Successfully added a new task.");
            })
            .catch((error) => console.log(error));
    }, []);

    const onEdit = useCallback((id, data) => {
        taskRepository
            .edit(id, data)
            .then(() => {
                console.log(`Successfully edited the task with ID ${id}.`);
            })
            .catch((error) => console.log(error));
    }, []);

    const onDelete = useCallback((id) => {
        taskRepository
            .delete(id)
            .then(() => {
                console.log(`Successfully deleted the task with ID ${id}.`);
            })
            .catch((error) => console.log(error));
    }, []);

    const toggleFinish = useCallback((id) => {
        taskRepository.toggleFinish(id)
        .then(() => {
            console.log(`Successfully toggled the task with ID ${id}.`);
        })
        .catch((error) => console.log(error));
    }, []);



    return {...state,onAdd, onEdit, onDelete, toggleFinish, fetchTasks};
};

export default useTasks;