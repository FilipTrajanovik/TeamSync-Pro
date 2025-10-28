package com.managementappbackend.dto.analytics;

public record PersonalMetricsDto(
        Double avgCompletionTimeHours,
        Double onTimeRate,
        Long totalCompleted,
        String comparisonToTeam
) {
}
