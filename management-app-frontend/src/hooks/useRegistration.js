// src/hooks/useRegistration.js
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userRepository from "../repository/userRepository.js";

const useRegistration = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const registerOrganization = useCallback(async (formData) => {
        console.log('=== REGISTRATION START ===');
        console.log('Form data received:', formData);


        console.log('=== REGISTRATION START ===');

        // ✅ Clear any old tokens before registration
        localStorage.removeItem('token');
        localStorage.removeItem('jwt');

        setError('');
        setLoading(true);

        try {
            const payload = {
                organizationName: formData.organizationName,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                repeatPassword: formData.confirmPassword,
                name: formData.name,
                surname: formData.surname,
                contactPhone: formData.contactPhone || '',
                address: formData.address || '',
                description: formData.description || ''
            };

            console.log('Payload being sent:', payload);

            const response = await userRepository.registerOrganization(payload);

            console.log('Registration successful!', response.data);

            // Success - redirect to portal
            navigate('/portal', {
                state: {
                    message: 'Organization created successfully! Please log in as Manager.'
                }
            });

            return { success: true, data: response.data };

        } catch (err) {
            console.error('=== REGISTRATION ERROR ===');
            console.error('Full error object:', err);
            console.error('Error response:', err.response);
            console.error('Error status:', err.response?.status);
            console.error('Error data:', err.response?.data);
            console.error('Error message:', err.message);

            const errorMessage = err.response?.data?.message
                || err.response?.data
                || err.message
                || 'Registration failed. Please try again.';

            setError(errorMessage);

            return { success: false, error: errorMessage };

        } finally {
            setLoading(false);
            console.log('=== REGISTRATION END ===');
        }
    }, [navigate]);

    const clearError = useCallback(() => {
        setError('');
    }, []);

    return {
        registerOrganization,
        loading,
        error,
        clearError
    };
};

export default useRegistration;