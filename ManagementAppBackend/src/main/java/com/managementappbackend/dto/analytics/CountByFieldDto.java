package com.managementappbackend.dto.analytics;

public record CountByFieldDto(
        String fieldName,
        Long count,
        Double percentage
) {
}
