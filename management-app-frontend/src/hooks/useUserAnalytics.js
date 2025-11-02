import { useCallback, useState } from "react";
import analyticsRepository from "../repository/analyticsRepository.js";

const useUserAnalytics = () => {
    const [taskStats, setTaskStats] = useState(null);
    const [priorityDistribution, setPriorityDistribution] = useState([]);
    const [taskTrend, setTaskTrend] = useState([]);
    const [personalMetrics, setPersonalMetrics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTaskStats = useCallback(async (username) => {
        try {
            setLoading(true);
            setError(null);
            const response = await analyticsRepository.getUserTaskStats(username);
            setTaskStats(response.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch task stats');
            console.error('Error fetching user task stats:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPriorityDistribution = useCallback(async (username) => {
        try {
            setLoading(true);
            setError(null);
            const response = await analyticsRepository.getUserPriorityDistribution(username);
            setPriorityDistribution(response.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch priority distribution');
            console.error('Error fetching user priority distribution:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTaskTrend = useCallback(async (username, days = 7) => {
        try {
            setLoading(true);
            setError(null);
            const response = await analyticsRepository.getUserTaskTrend(username, days);
            setTaskTrend(response.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch task trend');
            console.error('Error fetching user task trend:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPersonalMetrics = useCallback(async (username) => {
        try {
            setLoading(true);
            setError(null);
            const response = await analyticsRepository.getPersonalMetrics(username);
            setPersonalMetrics(response.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch personal metrics');
            console.error('Error fetching personal metrics:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAllData = useCallback(async (username, days = 7) => {
        try {
            setLoading(true);
            setError(null);

            const [statsRes, priorityRes, trendRes, metricsRes] = await Promise.all([
                analyticsRepository.getUserTaskStats(username),
                analyticsRepository.getUserPriorityDistribution(username),
                analyticsRepository.getUserTaskTrend(username, days),
                analyticsRepository.getPersonalMetrics(username)
            ]);

            setTaskStats(statsRes.data);
            setPriorityDistribution(priorityRes.data);
            setTaskTrend(trendRes.data);
            setPersonalMetrics(metricsRes.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch analytics data');
            console.error('Error fetching all user analytics:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        taskStats,
        priorityDistribution,
        taskTrend,
        personalMetrics,

        loading,
        error,

        fetchTaskStats,
        fetchPriorityDistribution,
        fetchTaskTrend,
        fetchPersonalMetrics,
        fetchAllData
    };
};

export default useUserAnalytics;