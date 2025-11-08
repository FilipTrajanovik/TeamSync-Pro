import {useCallback, useState} from "react";
import userRepository from "../repository/userRepository.js";

const useUserSettings = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const updateProfile = useCallback((data) => {
        setLoading(true);
        setError(null);
        return userRepository
            .updateProfile(data)
            .then((response) => {
                console.log("Successfully updated profile.");
                setLoading(false);
                return response;
            })
            .catch((error) => {
                console.log(error);
                setError(error);
                setLoading(false);
                throw error;
            });
    }, []);

    const changePassword = useCallback((data) => {
        setLoading(true);
        setError(null);
        return userRepository
            .changePassword(data)
            .then((response) => {
                console.log("Successfully changed password.");
                setLoading(false);
                return response;
            })
            .catch((error) => {
                console.log(error);
                setError(error);
                setLoading(false);
                throw error;
            });
    }, []);

    return {updateProfile, changePassword, loading, error};

}
export default useUserSettings;