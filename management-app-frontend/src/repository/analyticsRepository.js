import axiosInstance from "../axios/axios.js";

const analyticsRepository = {
    // ADMIN
    getAdminTaskStats: () => {
        return axiosInstance.get('/analytics/admin/tasks/stats')
    },
    getAdminPriorityDistribution: () => {
        return axiosInstance.get('/analytics/admin/tasks/priority-distribution')
    },
    getAdminTaskTrend: (days = 7) => {
        return axiosInstance.get('/analytics/admin/tasks/trend', {
            params: { days }
        })
    },
    // MANAGER
    getManagerTaskStats: (organizationId) => {
        return axiosInstance.get('/analytics/manager/tasks/stats', {
            params: { organizationId }
        })
    },
    getManagerPriorityDistribution: (organizationId) => {
        return axiosInstance.get('/analytics/manager/tasks/priority-distribution', {
            params: { organizationId }
        })
    },
    getManagerTaskTrend: (organizationId, days = 7) => {
        return axiosInstance.get('/analytics/manager/tasks/trend', {
            params: { organizationId, days }
        })
    },
    getClientTaskDistribution: (organizationId) => {
        return axiosInstance.get('/analytics/manager/clients/task-distribution', {
            params: { organizationId }
        })
    },
    getUserPerformance: (username) => {
        return axiosInstance.get('/analytics/manager/users/performance', {
            params: { username }
        })
    },
    // USER
    getUserTaskStats: (username) => {
        return axiosInstance.get('/analytics/user/tasks/stats', {
            params: { username }
        })
    },
    getUserPriorityDistribution: (username) => {
        return axiosInstance.get('/analytics/user/tasks/priority-distribution', {
            params: { username }
        })
    },
    getUserTaskTrend: (username, days = 7) => {
        return axiosInstance.get('/analytics/user/tasks/trend', {
            params: { username, days }
        })
    },
    getPersonalMetrics: (username) => {
        return axiosInstance.get('/analytics/user/personal-metrics', {
            params: { username }
        })
    }
}

export default analyticsRepository