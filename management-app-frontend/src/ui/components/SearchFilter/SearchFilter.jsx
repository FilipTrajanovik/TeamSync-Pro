import React from 'react';
import {
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    IconButton,
    InputAdornment,
    Chip,
    Typography
} from '@mui/material';
import {
    Search,
    Clear,
    FilterList,
    Close
} from '@mui/icons-material';
import './SearchFilter.css';

/**
 * SEARCH FILTER COMPONENT
 *
 * Reusable search and filter UI component
 *
 * Location: src/ui/components/SearchFilter/SearchFilter.jsx
 */
const SearchFilter = ({
                          // Search props
                          searchTerm = '',
                          searchPlaceholder = 'Search...',
                          onSearchChange,

                          // Filter props
                          filters = {},
                          filterOptions = {},
                          onFilterChange,

                          // Sort props
                          sortBy = '',
                          sortOptions = [],
                          onSortChange,

                          // Actions
                          onClearFilters,

                          // Info
                          activeFiltersCount = 0,
                          resultCount = 0,
                          totalCount = 0,

                          // Optional: Show/hide features
                          showSearch = true,
                          showFilters = true,
                          showSort = true,
                          showResultCount = true,
                          showClearButton = true
                      }) => {

    /**
     * Handle search input change
     */
    const handleSearchInput = (e) => {
        onSearchChange(e.target.value);
    };

    /**
     * Clear search
     */
    const handleClearSearch = () => {
        onSearchChange('');
    };

    /**
     * Handle filter dropdown change
     */
    const handleFilterSelect = (field) => (e) => {
        onFilterChange(field, e.target.value);
    };

    /**
     * Handle sort dropdown change
     */
    const handleSortSelect = (e) => {
        onSortChange(e.target.value);
    };

    /**
     * Remove specific filter chip
     */
    const handleRemoveFilter = (field) => {
        onFilterChange(field, 'ALL');
    };

    /**
     * Get active filter chips
     */
    const getActiveFilterChips = () => {
        const chips = [];

        // Add search chip
        if (searchTerm && searchTerm.trim() !== '') {
            chips.push({
                key: 'search',
                label: `"${searchTerm}"`,
                onDelete: handleClearSearch
            });
        }

        // Add filter chips
        Object.keys(filters).forEach(field => {
            const value = filters[field];
            if (value && value !== 'ALL' && value !== '') {
                // Find the label from options
                const fieldOptions = filterOptions[field] || [];
                const option = fieldOptions.find(opt => opt.value === value);
                const label = option ? option.label : value;

                chips.push({
                    key: field,
                    label: `${field}: ${label}`,
                    onDelete: () => handleRemoveFilter(field)
                });
            }
        });

        return chips;
    };

    const activeChips = getActiveFilterChips();

    return (
        <Box className="search-filter-container">
            {/* Top Row: Search + Result Count */}
            <Box className="search-filter-top">
                {/* Search Input */}
                {showSearch && (
                    <Box className="search-input-wrapper">
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={handleSearchInput}
                            className="search-input"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search className="search-icon" />
                                    </InputAdornment>
                                ),
                                endAdornment: searchTerm && (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={handleClearSearch}
                                            className="clear-search-btn"
                                        >
                                            <Clear fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>
                )}

                {/* Result Count */}
                {showResultCount && (
                    <Typography className="result-count">
                        Showing <strong>{resultCount}</strong> of <strong>{totalCount}</strong>
                    </Typography>
                )}
            </Box>

            {/* Middle Row: Filters + Sort + Clear Button */}
            <Box className="search-filter-controls">
                {/* Filter Dropdowns */}
                {showFilters && Object.keys(filterOptions).length > 0 && (
                    <Box className="filter-dropdowns">
                        <FilterList className="filter-icon" />

                        {Object.keys(filterOptions).map(field => (
                            <FormControl key={field} className="filter-select">
                                <InputLabel className="filter-label">
                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                </InputLabel>
                                <Select
                                    value={filters[field] || 'ALL'}
                                    onChange={handleFilterSelect(field)}
                                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                                    className="filter-dropdown"
                                >
                                    {filterOptions[field].map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ))}
                    </Box>
                )}

                {/* Sort Dropdown */}
                {showSort && sortOptions.length > 0 && (
                    <FormControl className="sort-select">
                        <InputLabel className="sort-label">Sort By</InputLabel>
                        <Select
                            value={sortBy}
                            onChange={handleSortSelect}
                            label="Sort By"
                            className="sort-dropdown"
                        >
                            {sortOptions.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                {/* Clear All Button */}
                {showClearButton && activeFiltersCount > 0 && (
                    <Button
                        variant="outlined"
                        onClick={onClearFilters}
                        startIcon={<Clear />}
                        className="clear-all-btn"
                    >
                        Clear All ({activeFiltersCount})
                    </Button>
                )}
            </Box>

            {/* Bottom Row: Active Filter Chips */}
            {activeChips.length > 0 && (
                <Box className="active-filters">
                    <Typography className="active-filters-label">
                        Active Filters:
                    </Typography>
                    <Box className="filter-chips">
                        {activeChips.map(chip => (
                            <Chip
                                key={chip.key}
                                label={chip.label}
                                onDelete={chip.onDelete}
                                deleteIcon={<Close />}
                                className="filter-chip"
                            />
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default SearchFilter;