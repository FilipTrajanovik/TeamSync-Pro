import {useCallback, useEffect, useState} from "react";
import taskRepository from "../repository/taskRepository.js";

const initialState = {
    tasks: [],
    loading: false
}

const useManagerTasks = () => {
    const [state, setState] = useState(initialState);

    const fetchManagerTasks = useCallback(() => {
        setState(initialState);
        taskRepository.findByOrganization()
            .then((response) => {
                setState({
                    tasks: response.data,
                    loading: false
                })
                console.log("Successfully retrieved tasks...");
            }).catch((e) => {
            console.error("❌ Error fetching tasks for the logged in manager: ", e);
            setState(prev => ({...prev, loading: true}));
        })
    }, [])

    useEffect(() => {
        fetchManagerTasks()
    }, [fetchManagerTasks]);
    return {...state, fetchManagerTasks}
}
export default useManagerTasks;