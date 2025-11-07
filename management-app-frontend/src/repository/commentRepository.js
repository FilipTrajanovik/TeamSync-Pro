import axiosInstance from "../axios/axios.js";

const commentRepository = {
    findAll: async () => {
        return axiosInstance.get('/comments')
    },
    findById: async (id) => {
        return axiosInstance.get(`/comments/${id}`)
    },
    add: async (data) => {
        return axiosInstance.post("/comments/add", data)
    },
    edit: async (id, data) => {
        return axiosInstance.put(`/comments/edit/${id}`, data)
    },
    delete: async (id) => {
        return axiosInstance.delete(`/comments/delete/${id}`)
    },
    findByTask: async(taskId) => {
        return axiosInstance.get(`/comments/tasks/${taskId}`)
    },
    findByUser: async () => {
        return axiosInstance.get(`/comments/user`)
    }
}
export default commentRepository