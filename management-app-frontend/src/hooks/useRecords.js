import {useCallback, useEffect, useState} from "react";
import recordRepository from "../repository/recordRepository.js";

const initialState = {
    records: [],
    loading: true,
};

const useRecords = () => {
    const [state, setState] = useState(initialState);

    const fetchRecords = useCallback(() => {
        setState(initialState);
        recordRepository
            .findAll()
            .then((response) => {
                setState({
                    records: response.data,
                    loading: false,
                });
            })
            .catch((error) => console.log(error));
    }, []);

    const onAdd = useCallback((data) => {
        recordRepository
            .add(data)
            .then(() => {
                console.log("Successfully added a new record.");
                fetchRecords();
            })
            .catch((error) => console.log(error));
    }, [fetchRecords]);

    const onEdit = useCallback((id, data) => {
        console.log('📝 EDITING RECORD:', id, data);
        recordRepository
            .edit(id, data)
            .then((response) => {
                console.log('✅ EDIT RESPONSE:', response.data);
                console.log('🔄 Now calling fetchRecords...');
                fetchRecords();
            })
            .catch((error) => console.log(error));
    }, [fetchRecords]);

    const onDelete = useCallback((id) => {
        recordRepository
            .delete(id)
            .then(() => {
                console.log(`Successfully deleted the record with ID ${id}.`);
                fetchRecords();
            })
            .catch((error) => console.log(error));
    }, [fetchRecords]);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    return {...state, onAdd, onEdit, onDelete};
};

export default useRecords;