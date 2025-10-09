import axiosInstance from "../axios/axios.js";

const clientRepository = {
    findAll: async () => {
        return axiosInstance.get("/clients")
    },
    findById: async (id) => {
        return axiosInstance.get(`/clients/${id}`)
    },
    add: async (data) => {
        return axiosInstance.post("/clients/add", data)
    },
    edit: async (id, data) => {
        return axiosInstance.put(`/clients/edit/${id}`, data)
    },
    delete: async (id) => {
        return axiosInstance.delete(`/clients/delete/${id}`)
    },
    findByOrganization: async (organizationId) => {
        return axiosInstance.get(`/clients/organization/${organizationId}`)
    },
    findByFirstName: async(firstName) => {
        return axiosInstance.get("/clients/find-by-first-name", {params: {firstName}})
    },
    findByEmail: async (email) => {
        return axiosInstance.get(`/clients/find-by-email`, {params: {email}})
    }

}
export default clientRepository;