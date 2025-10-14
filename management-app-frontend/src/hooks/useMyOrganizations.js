import {useCallback, useEffect, useState} from "react";
import organizationRepository from "../repository/organizationRepository.js";

const initialState = {
    organizations: [],
    loading: true,
}

const useMyOrganizations = () => {

    const [state, setState] = useState(initialState);

    const fetchMyOrganizations = useCallback(() => {
        setState(initialState);
        organizationRepository.myOrganizations()
            .then((response) => {
                setState({
                    organizations: response.data,
                    loading: false,
                });
            })
            .catch((err) => {
                console.log(err);
                setState(prev => ({ ...prev, loading: false }));
            })
    }, [])

    // ADD THIS useEffect:
    useEffect(() => {
        fetchMyOrganizations();
    }, [fetchMyOrganizations]);  // ← Automatically fetches on mount

    return {...state, fetchMyOrganizations}
}
export default useMyOrganizations