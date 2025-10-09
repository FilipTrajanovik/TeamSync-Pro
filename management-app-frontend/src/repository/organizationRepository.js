import axiosInstance from "../axios/axios.js";

const organizationRepository = {
    findAll: async () => {
        return await axiosInstance.get("/organizations");
    },
    findById: async (id) => {
        return await axiosInstance.get(`/organizations/${id}`);
    },
    add: async (data) => {
        return axiosInstance.post("/organizations/add", data);
    },
    edit: async (id,data) => {
        return axiosInstance.put(`/organizations/edit/${id}`, data);
    },
    delete: async (id) => {
        return axiosInstance.delete(`/organizations/delete/${id}`);
    }
};

export default organizationRepository;