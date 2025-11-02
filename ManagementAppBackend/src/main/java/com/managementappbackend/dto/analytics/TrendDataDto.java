package com.managementappbackend.dto.analytics;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TrendDataDto(
        Date date,
        Long count,
        String label
) {
}
