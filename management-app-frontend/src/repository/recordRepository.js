import axiosInstance from "../axios/axios.js";

const recordRepository = {
    findAll: async () => {
        return axiosInstance.get("/records")
    },
    findById: async (id) => {
        return axiosInstance.get(`/records/${id}`)
    },
    add: async (data) => {
        return axiosInstance.post("/records/add", data)
    },
    edit: async (id, data) => {
        return axiosInstance.put(`/records/edit/${id}`, data)
    },
    delete: async (id) => {
        return axiosInstance.delete(`/records/delete/${id}`)
    },
    findByClient: async (clientId) => {
        return axiosInstance.get(`/records/client/${clientId}`)
    }
}
export default recordRepository;