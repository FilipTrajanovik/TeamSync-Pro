/**
 * FILTER HELPERS - Pure Functions for Search, Filter, and Sort
 *
 * These are "pure functions" - they don't change the original data,
 * they just return new filtered/sorted arrays.
 *
 * Location: src/utils/filterHelpers.js
 */

/**
 * 1. SEARCH FUNCTION
 * Searches for a term across multiple fields in your data
 *
 * Example:
 *   const tasks = [
 *     { title: "Fix bug", description: "Login error" },
 *     { title: "Write docs", description: "API documentation" }
 *   ];
 *
 *   filterBySearch(tasks, "fix", ["title", "description"])
 *   // Returns: [{ title: "Fix bug", ... }]
 *
 * @param {Array} data - Your array of objects (tasks, clients, users, etc.)
 * @param {String} searchTerm - What the user typed ("fix bug")
 * @param {Array} searchFields - Which fields to search in (["title", "description"])
 * @returns {Array} - Filtered array
 */
export const filterBySearch = (data, searchTerm, searchFields = []) => {
    // If no search term, return everything
    if (!searchTerm || searchTerm.trim() === '') {
        return data;
    }

    // Convert search term to lowercase for case-insensitive search
    const searchLower = searchTerm.toLowerCase().trim();

    // Filter the data
    return data.filter(item => {
        // Check if ANY of the search fields contain the search term
        return searchFields.some(field => {
            // Get the value from the object (e.g., task.title)
            const value = getNestedValue(item, field);

            // If value exists and is a string, check if it includes search term
            if (value && typeof value === 'string') {
                return value.toLowerCase().includes(searchLower);
            }

            // If value is a number, convert to string and search
            if (typeof value === 'number') {
                return value.toString().includes(searchLower);
            }

            return false;
        });
    });
};


/**
 * 2. FILTER BY FIELD FUNCTION
 * Filters data by a specific field value
 *
 * Example:
 *   filterByField(tasks, "status", "PENDING")
 *   // Returns: Only tasks where status === "PENDING"
 *
 * @param {Array} data - Your data array
 * @param {String} field - Field name to filter by ("status", "priority")
 * @param {String} value - Value to filter for ("PENDING", "HIGH")
 * @returns {Array} - Filtered array
 */
export const filterByField = (data, field, value) => {
    // If value is "ALL" or empty, don't filter
    if (!value || value === 'ALL' || value === '') {
        return data;
    }

    // Filter data where field matches value
    return data.filter(item => {
        const fieldValue = getNestedValue(item, field);
        return fieldValue === value;
    });
};


/**
 * 3. APPLY MULTIPLE FILTERS FUNCTION
 * Applies multiple filters at once
 *
 * Example:
 *   const filters = {
 *     status: "PENDING",
 *     priority: "HIGH"
 *   };
 *   applyMultipleFilters(tasks, filters)
 *   // Returns: Tasks where status="PENDING" AND priority="HIGH"
 *
 * @param {Array} data - Your data array
 * @param {Object} filters - Object with filter key-value pairs
 * @returns {Array} - Filtered array
 */
export const applyMultipleFilters = (data, filters = {}) => {
    let result = [...data]; // Make a copy

    // Apply each filter one by one
    Object.keys(filters).forEach(field => {
        const value = filters[field];
        result = filterByField(result, field, value);
    });

    return result;
};


/**
 * 4. FILTER BY DATE RANGE FUNCTION
 * Filters data by date range
 *
 * Example:
 *   filterByDateRange(tasks, "createdAt", "last7days")
 *   // Returns: Tasks created in last 7 days
 *
 * @param {Array} data - Your data array
 * @param {String} dateField - Field name that contains the date
 * @param {String} range - Range type ("today", "last7days", "last30days", etc.)
 * @param {Date} customStartDate - Optional custom start date
 * @param {Date} customEndDate - Optional custom end date
 * @returns {Array} - Filtered array
 */
export const filterByDateRange = (
    data,
    dateField,
    range = 'all',
    customStartDate = null,
    customEndDate = null
) => {
    if (range === 'all' || !range) {
        return data;
    }

    const now = new Date();
    let startDate, endDate;

    // Calculate date range based on selection
    switch (range) {
        case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
            break;

        case 'last7days':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            endDate = now;
            break;

        case 'last30days':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            endDate = now;
            break;

        case 'thisMonth':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
            break;

        case 'custom':
            startDate = customStartDate;
            endDate = customEndDate;
            break;

        default:
            return data;
    }

    // Filter data by date range
    return data.filter(item => {
        const itemDate = new Date(getNestedValue(item, dateField));
        return itemDate >= startDate && itemDate <= endDate;
    });
};


/**
 * 5. SORT DATA FUNCTION
 * Sorts data by field and direction
 *
 * Example:
 *   sortData(tasks, "createdAt", "desc")
 *   // Returns: Tasks sorted by date, newest first
 *
 * @param {Array} data - Your data array
 * @param {String} sortBy - Field to sort by or predefined sort type
 * @param {String} direction - "asc" or "desc"
 * @returns {Array} - Sorted array (NEW array, doesn't modify original)
 */
export const sortData = (data, sortBy = 'default', direction = 'desc') => {
    if (!sortBy || sortBy === 'default') {
        return data;
    }

    // Make a copy so we don't modify the original array
    const sorted = [...data];

    // Handle predefined sort types
    switch (sortBy) {
        case 'DATE_DESC':
            return sorted.sort((a, b) =>
                new Date(b.createdAt || b.dueDate || 0) - new Date(a.createdAt || a.dueDate || 0)
            );

        case 'DATE_ASC':
            return sorted.sort((a, b) =>
                new Date(a.createdAt || a.dueDate || 0) - new Date(b.createdAt || b.dueDate || 0)
            );

        case 'TITLE_ASC':
            return sorted.sort((a, b) =>
                (a.title || a.name || '').localeCompare(b.title || b.name || '')
            );

        case 'TITLE_DESC':
            return sorted.sort((a, b) =>
                (b.title || b.name || '').localeCompare(a.title || a.name || '')
            );

        case 'PRIORITY_DESC': {
            const priorityOrder = {'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1};
            return sorted.sort((a, b) =>
                (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
            );
        }
        case 'PRIORITY_ASC': {
            const priorityOrderAsc = {'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1};
            return sorted.sort((a, b) =>
                (priorityOrderAsc[a.priority] || 0) - (priorityOrderAsc[b.priority] || 0)
            );
        }

        default:
            // Generic field sorting
            return sorted.sort((a, b) => {
                const aVal = getNestedValue(a, sortBy);
                const bVal = getNestedValue(b, sortBy);

                // Handle strings
                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    return direction === 'asc'
                        ? aVal.localeCompare(bVal)
                        : bVal.localeCompare(aVal);
                }

                // Handle numbers and dates
                if (direction === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });
    }
};


/**
 * 6. HELPER: Get nested object value
 * Gets a value from a nested object path
 *
 * Example:
 *   const task = { user: { name: "Filip" } };
 *   getNestedValue(task, "user.name")  // Returns: "Filip"
 *
 * @param {Object} obj - The object
 * @param {String} path - Dot notation path ("user.name", "organization.id")
 * @returns {*} - The value at that path
 */
const getNestedValue = (obj, path) => {
    if (!path) return obj;

    // Split path by dots: "user.name" -> ["user", "name"]
    const keys = path.split('.');

    // Navigate through the object
    let value = obj;
    for (const key of keys) {
        if (value && typeof value === 'object') {
            value = value[key];
        } else {
            return undefined;
        }
    }

    return value;
};


/**
 * 7. COMBINE ALL FILTERS FUNCTION
 * Master function that applies search, filters, and sort all at once
 *
 * This is the main function you'll use!
 *
 * Example:
 *   const result = combineFilters(tasks, {
 *     searchTerm: "fix",
 *     searchFields: ["title", "description"],
 *     filters: { status: "PENDING", priority: "HIGH" },
 *     dateRange: "last7days",
 *     dateField: "createdAt",
 *     sortBy: "DATE_DESC"
 *   });
 *
 * @param {Array} data - Your data array
 * @param {Object} config - Configuration object
 * @returns {Array} - Filtered and sorted array
 */
export const combineFilters = (data, config = {}) => {
    const {
        searchTerm = '',
        searchFields = [],
        filters = {},
        dateRange = 'all',
        dateField = 'createdAt',
        customStartDate = null,
        customEndDate = null,
        sortBy = 'default',
        sortDirection = 'desc'
    } = config;

    let result = [...data]; // Start with copy of all data

    // 1. Apply search
    if (searchTerm) {
        result = filterBySearch(result, searchTerm, searchFields);
    }

    // 2. Apply field filters
    if (Object.keys(filters).length > 0) {
        result = applyMultipleFilters(result, filters);
    }

    // 3. Apply date range filter
    if (dateRange && dateRange !== 'all') {
        result = filterByDateRange(result, dateField, dateRange, customStartDate, customEndDate);
    }

    // 4. Apply sorting
    if (sortBy) {
        result = sortData(result, sortBy, sortDirection);
    }

    return result;
};


/**
 * 8. COUNT ACTIVE FILTERS
 * Counts how many filters are currently active
 *
 * Example:
 *   countActiveFilters("fix", { status: "PENDING", priority: "HIGH" })
 *   // Returns: 3 (search + status + priority)
 *
 * @param {String} searchTerm - Search term
 * @param {Object} filters - Filter object
 * @param {String} dateRange - Date range selection
 * @returns {Number} - Count of active filters
 */
export const countActiveFilters = (searchTerm = '', filters = {}, dateRange = 'all') => {
    let count = 0;

    // Count search
    if (searchTerm && searchTerm.trim() !== '') {
        count++;
    }

    // Count each filter that's not "ALL" or empty
    Object.values(filters).forEach(value => {
        if (value && value !== 'ALL' && value !== '') {
            count++;
        }
    });

    // Count date range
    if (dateRange && dateRange !== 'all') {
        count++;
    }

    return count;
};


/**
 * 9. RESET FILTERS
 * Returns empty filter state
 *
 * @param {Array} filterFields - Array of filter field names
 * @returns {Object} - Reset filter object
 */
export const getResetFilters = (filterFields = []) => {
    const resetFilters = {};
    filterFields.forEach(field => {
        resetFilters[field] = 'ALL';
    });
    return resetFilters;
};