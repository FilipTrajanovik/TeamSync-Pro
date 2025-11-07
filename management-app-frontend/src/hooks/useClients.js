import {useCallback, useEffect, useState} from "react";
import clientRepository from "../repository/clientRepository.js";

const initialState = {
    clients: [],
    loading: true,
};

const useClients = () => {
    const [state, setState] = useState(initialState);

    const fetchClients = useCallback(() => {
        setState(initialState);
        clientRepository
            .findAll()
            .then((response) => {
                setState({
                    clients: response.data,
                    loading: false,
                });
            })
            .catch((error) => console.log(error));
    }, []);

    const onAdd = useCallback((data) => {
        clientRepository
            .add(data)
            .then(() => {
                console.log("Successfully added a new client.");
                fetchClients();
            })
            .catch((error) => console.log(error));
    }, [fetchClients]);

    const onEdit = useCallback((id, data) => {
        clientRepository
            .edit(id, data)
            .then(() => {
                console.log(`Successfully edited the client with ID ${id}.`);
                fetchClients();
            })
            .catch((error) => console.log(error));
    }, [fetchClients]);

    const onDelete = useCallback((id) => {
        clientRepository
            .delete(id)
            .then(() => {
                console.log(`Successfully deleted the client with ID ${id}.`);
                fetchClients();
            })
            .catch((error) => console.log(error));
    }, [fetchClients]);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const fetchClientsByOrganization = useCallback((organizationId) => {
        clientRepository.findByOrganization(organizationId)
            .then((response) => {
                setState({
                    clients: response.data,
                    loading: false,
                })
            })
            .catch((err) => {
                console.log(err);
                setState({clients: [], loading: false});
            })
    }, [])
    return {...state, onAdd, onEdit, onDelete, fetchClientsByOrganization};
}
export default useClients;