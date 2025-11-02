import { useCallback, useState } from "react";
import analyticsRepository from "../repository/analyticsRepository.js";

const useManagerAnalytics = () => {
    const [taskStats, setTaskStats] = useState(null);
    const [priorityDistribution, setPriorityDistribution] = useState([]);
    const [taskTrend, setTaskTrend] = useState([]);
    const [clientTaskDistribution, setClientTaskDistribution] = useState([]);
    const [userPerformance, setUserPerformance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTaskStats = useCallback(async (organizationId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await analyticsRepository.getManagerTaskStats(organizationId);
            setTaskStats(response.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch task stats');
            console.error('Error fetching manager task stats:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPriorityDistribution = useCallback(async (organizationId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await analyticsRepository.getManagerPriorityDistribution(organizationId);
            setPriorityDistribution(response.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch priority distribution');
            console.error('Error fetching manager priority distribution:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTaskTrend = useCallback(async (organizationId, days = 7) => {
        try {
            setLoading(true);
            setError(null);
            const response = await analyticsRepository.getManagerTaskTrend(organizationId, days);
            setTaskTrend(response.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch task trend');
            console.error('Error fetching manager task trend:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchClientTaskDistribution = useCallback(async (organizationId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await analyticsRepository.getClientTaskDistribution(organizationId);
            setClientTaskDistribution(response.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch client task distribution');
            console.error('Error fetching client task distribution:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUserPerformance = useCallback(async (username) => {
        try {
            setLoading(true);
            setError(null);
            const response = await analyticsRepository.getUserPerformance(username);
            setUserPerformance(response.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch user performance');
            console.error('Error fetching user performance:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAllData = useCallback(async (organizationId, days = 7) => {
        try {
            setLoading(true);
            setError(null);

            const [statsRes, priorityRes, trendRes, clientRes] = await Promise.all([
                analyticsRepository.getManagerTaskStats(organizationId),
                analyticsRepository.getManagerPriorityDistribution(organizationId),
                analyticsRepository.getManagerTaskTrend(organizationId, days),
                analyticsRepository.getClientTaskDistribution(organizationId)
            ]);

            setTaskStats(statsRes.data);
            setPriorityDistribution(priorityRes.data);
            setTaskTrend(trendRes.data);
            setClientTaskDistribution(clientRes.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch analytics data');
            console.error('Error fetching all manager analytics:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        taskStats,
        priorityDistribution,
        taskTrend,
        clientTaskDistribution,
        userPerformance,

        loading,
        error,

        fetchTaskStats,
        fetchPriorityDistribution,
        fetchTaskTrend,
        fetchClientTaskDistribution,
        fetchUserPerformance,
        fetchAllData
    };
};

export default useManagerAnalytics;