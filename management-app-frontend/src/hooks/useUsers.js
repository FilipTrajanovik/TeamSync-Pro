import {useCallback, useEffect, useState} from "react";
import userRepository from "../repository/userRepository.js";

const initialState = {
    users: [],
    loading: true,
};

const useUsers = () => {
    const [state, setState] = useState(initialState);

    const fetchUsers = useCallback(() => {
        setState(initialState);
        userRepository
            .findAll()
            .then((response) => {
                setState({
                    users: response.data,
                    loading: false,
                });
            })
            .catch((error) => console.log(error));
    }, []);

    const onAdd = useCallback((data) => {
        userRepository
            .register(data)
            .then(() => {
                console.log("Successfully added a new user.");
                fetchUsers();
            })
            .catch((error) => console.log(error));
    }, [fetchUsers]);

    const onEdit = useCallback((id, data) => {
        userRepository
            .edit(id, data)
            .then(() => {
                console.log(`Successfully edited the user with ID ${id}.`);
                fetchUsers();
            })
            .catch((error) => console.log(error));
    }, [fetchUsers]);

    const onDelete = useCallback((id) => {
        userRepository
            .delete(id)
            .then(() => {
                console.log(`Successfully deleted the user with ID ${id}.`);
                fetchUsers();
            })
            .catch((error) => console.log(error));
    }, [fetchUsers]);

    const fetchUsersByOrganizations = useCallback((organizationId) => {
        setState(prev => ({...prev, loading: true}));
        userRepository.findByOrganization(organizationId)
            .then((response) => {
                setState({
                    users: response.data,
                    loading: false,
                })
            })
            .catch((error) => {
                console.log(error)
                setState({ users: [], loading: false });
            });

    },[])

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {...state, onAdd, onEdit, onDelete, fetchUsersByOrganizations};
};

export default useUsers;