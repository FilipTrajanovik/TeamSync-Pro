import { useCallback, useEffect, useState } from "react";
import taskRepository from "../repository/taskRepository.js";
import { useAuth } from "./useAuth"; // ✅ Import useAuth

const initialState = {
    tasks: [],
    loading: true,
}

const useMyTasks = () => {
    const [state, setState] = useState(initialState);
    const { user } = useAuth(); // ✅ Get user from auth context

    const fetchTasks = useCallback(() => {
        if (!user?.username) return;

        setState(initialState);
        taskRepository.findByAssigned(user.username) // ✅ Use user.username
            .then((response) => {
                setState({
                    tasks: response.data,
                    loading: false,
                });
            })
            .catch((error) => {
                console.log(error);
                setState(prev => ({ ...prev, loading: false }));
            })
    }, [user?.username]);


    const toggleFinish = useCallback((id) => {
        return taskRepository.toggleFinish(id)
            .then(() => {
                console.log(`Successfully toggled finish status for task ${id}.`);
                fetchTasks(); // Refresh the task list
            })
            .catch((error) => {
                console.error(`Error toggling finish status for task ${id}:`, error);
                throw error;
            });
    }, [fetchTasks]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return { ...state, toggleFinish };
};

export default useMyTasks;