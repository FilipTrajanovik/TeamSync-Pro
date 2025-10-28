package com.managementappbackend.service.application.analytics;

import com.managementappbackend.dto.analytics.PersonalMetricsDto;
import com.managementappbackend.dto.analytics.UserPerformanceDto;

public interface UserAnalyticsApplicationService {
    PersonalMetricsDto getPersonalMetrics(String username);
    UserPerformanceDto getUserPerformance(String username);
}
