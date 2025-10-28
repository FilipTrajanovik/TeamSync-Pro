package com.managementappbackend.dto.analytics;

public record ClientTaskDistributionDto(
        Long clientId,
        String firstName,
        String lastName,
        Long taskCount,
        Long completedCount,
        Double completionRate
) {
}
