import axiosInstance from "../axios/axios.js";

const notificationRepository = {
    getUnreadCount: async() => {
        return axiosInstance.get('/notifications/count-my-notifications')
    },
    getMyNotifications: async() => {
        return axiosInstance.get('/notifications/my-notifications')
    },
    getUnread: async () => {
        return axiosInstance.get('/notifications/unread')
    },
    markItAsRead: async (id) => {
        return axiosInstance.put(`/notifications/mark-it-as-read/${id}`)
    },
    markItAsUnread: async (id) => {
        return axiosInstance.put(`/notifications/mark-it-as-unread/${id}`)
    }
}
export default notificationRepository