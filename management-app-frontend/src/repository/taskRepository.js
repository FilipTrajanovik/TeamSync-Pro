import axiosInstance from "../axios/axios.js";

const taskRepository = {
    findAll: async ()=> {
        return axiosInstance.get("/tasks")
    },
    findById: async id => {
        return axiosInstance.get(`/tasks/${id}`)
    },
    add: async (data) => {
        return axiosInstance.post("/tasks/add", data)
    },
    edit: async (id,data) => {
        return axiosInstance.put(`/tasks/edit/${id}`, data)
    },
    delete: async (id) => {
        return axiosInstance.delete(`/tasks/delete/${id}`)
    },
    findByTitle: async (title) => {
        return axiosInstance.get("/tasks/find-by-title", {params: {title}})
    },
    findByClient: async (clientId) => {
        return axiosInstance.get(`/tasks/client/${clientId}`)
    },
    findByAssigned: async (username) => {
        return axiosInstance.get(`/tasks/assigned/${username}`)
    },
    toggleFinish: async (id) => {
        return axiosInstance.put(`/tasks/toggle-finish?id=${id}`)
    }


}
export default taskRepository;