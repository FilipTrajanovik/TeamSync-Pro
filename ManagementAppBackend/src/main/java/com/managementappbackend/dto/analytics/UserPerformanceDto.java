package com.managementappbackend.dto.analytics;

public record UserPerformanceDto(
        String username,
        String firstName,
        String lastName,
        Long totalAssigned,
        Long totalCompleted,
        Double completionRate,
        Double avgCompletionTimeHours
) {
}
