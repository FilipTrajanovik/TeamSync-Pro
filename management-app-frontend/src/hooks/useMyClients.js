import {useCallback, useState} from "react";
import clientRepository from "../repository/clientRepository.js";

const initialState = {
    clients: [],
    loading: true,
};

const useMyClients = () => {
    const [state, setState] = useState(initialState);
    const [currentOrganizationId, setCurrentOrganizationId] = useState(null);  // ✅ Track current org

    const fetchClientsByOrganization = useCallback((organizationId) => {
        setState(prev => ({...prev, loading: true}));
        setCurrentOrganizationId(organizationId);  // ✅ Remember which org we're viewing

        return clientRepository.findByOrganization(organizationId)
            .then((response) => {
                console.log('✅ Fetched my clients:', response.data);
                setState({
                    clients: response.data,
                    loading: false,
                });
                return response.data;
            })
            .catch((error) => {
                console.error('❌ Error fetching my clients:', error);
                setState({ clients: [], loading: false });
                throw error;
            });
    }, []);

    const onAdd = useCallback((data) => {
        return clientRepository
            .add(data)
            .then((response) => {
                console.log("✅ Successfully added a new client.");
                // ✅ Auto-refresh the current organization's clients
                if (currentOrganizationId) {
                    return fetchClientsByOrganization(currentOrganizationId).then(() => response);
                }
                return response;
            })
            .catch((error) => {
                console.error('❌ Error adding client:', error);
                throw error;
            });
    }, [currentOrganizationId, fetchClientsByOrganization]);

    const onEdit = useCallback((id, data) => {
        return clientRepository
            .edit(id, data)
            .then((response) => {
                console.log(`✅ Successfully edited client ${id}.`);
                // ✅ Auto-refresh the current organization's clients
                if (currentOrganizationId) {
                    return fetchClientsByOrganization(currentOrganizationId).then(() => response);
                }
                return response;
            })
            .catch((error) => {
                console.error('❌ Error editing client:', error);
                throw error;
            });
    }, [currentOrganizationId, fetchClientsByOrganization]);

    const onDelete = useCallback((id) => {
        return clientRepository
            .delete(id)
            .then(() => {
                console.log(`✅ Successfully deleted client ${id}.`);
                // ✅ Auto-refresh the current organization's clients
                if (currentOrganizationId) {
                    return fetchClientsByOrganization(currentOrganizationId);
                }
            })
            .catch((error) => {
                console.error('❌ Error deleting client:', error);
                throw error;
            });
    }, [currentOrganizationId, fetchClientsByOrganization]);

    return {...state, onAdd, onEdit, onDelete, fetchClientsByOrganization};
};

export default useMyClients;