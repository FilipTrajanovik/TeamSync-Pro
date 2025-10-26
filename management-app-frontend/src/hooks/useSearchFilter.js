import { useState, useEffect, useMemo } from 'react';
import { combineFilters, countActiveFilters, getResetFilters } from '../utils/filterHelper.js'

/**
 * CUSTOM HOOK: useSearchFilter
 *
 * Manages search, filter, and sort state for any data array
 *
 * Location: src/hooks/useSearchFilter.js
 *
 * @param {Array} data - Your data array (tasks, clients, users, etc.)
 * @param {Object} config - Configuration object
 * @returns {Object} - State and functions for search/filter
 */
const useSearchFilter = (data = [], config = {}) => {
    const {
        searchFields = ['title', 'name'], // Fields to search in
        filterableFields = [],             // Fields that can be filtered
        defaultSortBy = 'DATE_DESC',       // Default sort option
        dateField = 'createdAt'            // Date field for date filtering
    } = config;

    const [searchTerm, setSearchTerm] = useState('');

    const [filters, setFilters] = useState(() => {
        return getResetFilters(filterableFields);
    });

    const [sortBy, setSortBy] = useState(defaultSortBy);

    const [dateRange, setDateRange] = useState('all');

    const [customStartDate, setCustomStartDate] = useState(null);
    const [customEndDate, setCustomEndDate] = useState(null);

    /**
     * COMPUTED: Filtered and sorted data
     * Uses useMemo to only recalculate when dependencies change
     */
    const filteredData = useMemo(() => {
        return combineFilters(data, {
            searchTerm,
            searchFields,
            filters,
            dateRange,
            dateField,
            customStartDate,
            customEndDate,
            sortBy
        });
    }, [data, searchTerm, searchFields, filters, dateRange, dateField, customStartDate, customEndDate, sortBy]);

    /**
     * COMPUTED: Count of active filters
     */
    const activeFiltersCount = useMemo(() => {
        return countActiveFilters(searchTerm, filters, dateRange);
    }, [searchTerm, filters, dateRange]);

    /**
     * HANDLER: Update search term
     */
    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    /**
     * HANDLER: Update a single filter
     * Example: handleFilterChange('status', 'PENDING')
     */
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    /**
     * HANDLER: Update multiple filters at once
     * Example: handleFiltersChange({ status: 'PENDING', priority: 'HIGH' })
     */
    const handleFiltersChange = (newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters
        }));
    };

    /**
     * HANDLER: Update sort
     */
    const handleSortChange = (value) => {
        setSortBy(value);
    };

    /**
     * HANDLER: Update date range
     */
    const handleDateRangeChange = (range) => {
        setDateRange(range);
    };

    /**
     * HANDLER: Update custom date range
     */
    const handleCustomDateChange = (startDate, endDate) => {
        setCustomStartDate(startDate);
        setCustomEndDate(endDate);
        setDateRange('custom');
    };

    /**
     * HANDLER: Clear all filters
     */
    const clearFilters = () => {
        setSearchTerm('');
        setFilters(getResetFilters(filterableFields));
        setDateRange('all');
        setCustomStartDate(null);
        setCustomEndDate(null);
        setSortBy(defaultSortBy);
    };

    /**
     * HANDLER: Clear search only
     */
    const clearSearch = () => {
        setSearchTerm('');
    };

    /**
     * HANDLER: Clear specific filter
     */
    const clearFilter = (field) => {
        setFilters(prev => ({
            ...prev,
            [field]: 'ALL'
        }));
    };

    return {
        // Data
        filteredData,           // The filtered/sorted array
        originalData: data,     // Original unfiltered data

        searchTerm,             // Current search term
        handleSearchChange,     // Function to update search
        clearSearch,            // Function to clear search

        filters,                // Current filters object
        handleFilterChange,     // Function to update one filter
        handleFiltersChange,    // Function to update multiple filters
        clearFilter,            // Function to clear one filter

        sortBy,                 // Current sort option
        handleSortChange,       // Function to update sort

        dateRange,
        handleDateRangeChange,
        customStartDate,
        customEndDate,
        handleCustomDateChange,

        clearFilters,

        activeFiltersCount,
        hasFilters: activeFiltersCount > 0,
        resultCount: filteredData.length,
        totalCount: data.length
    };
};

export default useSearchFilter;