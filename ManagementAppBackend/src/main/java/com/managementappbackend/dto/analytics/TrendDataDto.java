package com.managementappbackend.dto.analytics;

import java.time.LocalDate;

public record TrendDataDto(
        LocalDate date,
        Long count,
        String label
) {
}
