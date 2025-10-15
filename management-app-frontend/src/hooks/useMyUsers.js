import {useCallback, useEffect, useState} from "react";
import userRepository from "../repository/userRepository.js";

const initialState = {
    users: [],
    loading: true,
}

const useMyUsers = () => {

    const [state, setState] = useState(initialState);

    const fetchMyUsers = useCallback((organizationId) => {
        setState(initialState);
        userRepository.findByOrganizationAndRole(organizationId)
            .then((response) => {
                setState({
                    users: response.data,
                    loading: false,
                });
            })
            .catch((err) => {
                console.log(err);
                setState(prev => ({ ...prev, loading: false }));
            })
    }, [])



    return {...state, fetchMyUsers}
}
export default useMyUsers