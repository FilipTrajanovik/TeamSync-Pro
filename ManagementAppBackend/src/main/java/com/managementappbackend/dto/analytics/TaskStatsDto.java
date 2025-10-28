package com.managementappbackend.dto.analytics;

public record TaskStatsDto(Long total,
                           Long pending,
                           Long completed,
                           Long cancelled,
                           Long onHold,
                           Double completionRate,
                           Long overDueCount) {
}
