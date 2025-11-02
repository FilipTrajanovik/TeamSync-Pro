import { useCallback, useState } from "react";
import analyticsRepository from "../repository/analyticsRepository.js";

const useAdminAnalytics = () => {
    const [taskStats, setTaskStats] = useState(null);
    const [priorityDistribution, setPriorityDistribution] = useState([]);
    const [taskTrend, setTaskTrend] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTaskStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await analyticsRepository.getAdminTaskStats();
            setTaskStats(response.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch task stats');
            console.error('Error fetching admin task stats:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPriorityDistribution = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await analyticsRepository.getAdminPriorityDistribution();
            setPriorityDistribution(response.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch priority distribution');
            console.error('Error fetching admin priority distribution:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTaskTrend = useCallback(async (days = 7) => {
        try {
            setLoading(true);
            setError(null);
            const response = await analyticsRepository.getAdminTaskTrend(days);
            setTaskTrend(response.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch task trend');
            console.error('Error fetching admin task trend:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAllData = useCallback(async (days = 7) => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all 3 APIs in parallel (faster!)
            const [statsRes, priorityRes, trendRes] = await Promise.all([
                analyticsRepository.getAdminTaskStats(),
                analyticsRepository.getAdminPriorityDistribution(),
                analyticsRepository.getAdminTaskTrend(days)
            ]);

            setTaskStats(statsRes.data);
            setPriorityDistribution(priorityRes.data);
            setTaskTrend(trendRes.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch analytics data');
            console.error('Error fetching all admin analytics:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        taskStats,
        priorityDistribution,
        taskTrend,

        loading,
        error,

        fetchTaskStats,
        fetchPriorityDistribution,
        fetchTaskTrend,
        fetchAllData
    };
};

export default useAdminAnalytics;