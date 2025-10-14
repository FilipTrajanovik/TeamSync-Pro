import organizationRepository from "../repository/organizationRepository.js";

const initialState = {
    organizations: [],
    loading: true,
}
import React, {useCallback, useEffect, useState} from 'react';

const UseOrganizations = () => {
   const [state, setState] = useState(initialState);

   const fetchOrganizations = useCallback(() => {
       setState(initialState);
       organizationRepository.findAll()
           .then((response) => {
               setState({
                   organizations: response.data,
                   loading: false,
               })
           })
           .catch((error) => {
               console.log(error);
           })
   }, [])

    const onAdd = useCallback((data) => {
        organizationRepository
            .add(data)
            .then(() => {
                console.log("Successfully added a new organization.");
                fetchOrganizations();
            })
            .catch((error) => console.log(error));
    }, [fetchOrganizations]);

    const onEdit = useCallback((id, data) => {
        organizationRepository
            .edit(id, data)
            .then(() => {
                console.log(`Successfully edited the organization with ID ${id}.`);
                fetchOrganizations();
            })
            .catch((error) => console.log(error));
    }, [fetchOrganizations]);

    const onDelete = useCallback((id) => {
        organizationRepository
            .delete(id)
            .then(() => {
                console.log(`Successfully deleted the organization with ID ${id}.`);
                fetchOrganizations();
            })
            .catch((error) => console.log(error));
    }, [fetchOrganizations]);




    useEffect(() => {
        fetchOrganizations();
    },[fetchOrganizations])

    return {...state, onAdd, onEdit, onDelete};
};

export default UseOrganizations;