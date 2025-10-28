package com.managementappbackend.service.application.analytics;

import com.managementappbackend.dto.analytics.ClientTaskDistributionDto;
import com.managementappbackend.dto.analytics.CountByFieldDto;
import com.managementappbackend.dto.analytics.TaskStatsDto;
import com.managementappbackend.dto.analytics.TrendDataDto;

import java.util.List;

public interface TaskAnalyticsApplicationService {
    TaskStatsDto getTaskStats();
    List<CountByFieldDto> getCountsByField();

    TaskStatsDto getTaskStatsForOrganization(Long organizationId);
    List<CountByFieldDto> getCountsByFieldForOrganization(Long organizationId);

    TaskStatsDto getTaskStatsForUser(String username);
    List<CountByFieldDto> getCountsByFieldForUser(String username);

    List<TrendDataDto> getTaskTrend(int days);
    List<TrendDataDto> getTaskTrendForOrganization(Long organizationId, int days);
    List<TrendDataDto> getTaskTrendForUser(String username, int days);
    List<ClientTaskDistributionDto> getClientTaskDistribution(Long organizationId);
}
