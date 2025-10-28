package com.managementappbackend.web.controllers;

import com.managementappbackend.dto.analytics.*;
import com.managementappbackend.service.application.analytics.TaskAnalyticsApplicationService;
import com.managementappbackend.service.application.analytics.UserAnalyticsApplicationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final TaskAnalyticsApplicationService taskAnalyticsService;
    private final UserAnalyticsApplicationService userAnalyticsService;

    public AnalyticsController(TaskAnalyticsApplicationService taskAnalyticsService,
                               UserAnalyticsApplicationService userAnalyticsService) {
        this.taskAnalyticsService = taskAnalyticsService;
        this.userAnalyticsService = userAnalyticsService;
    }

    // ==================== ADMIN ENDPOINTS ====================

    @GetMapping("/admin/tasks/stats")
    public TaskStatsDto getAdminTaskStats() {
        return taskAnalyticsService.getTaskStats();
    }

    @GetMapping("/admin/tasks/priority-distribution")
    public List<CountByFieldDto> getAdminPriorityDistribution() {
        return taskAnalyticsService.getCountsByField();
    }

    @GetMapping("/admin/tasks/trend")
    public List<TrendDataDto> getAdminTaskTrend(@RequestParam(defaultValue = "7") int days) {
        return taskAnalyticsService.getTaskTrend(days);
    }

    // ==================== MANAGER ENDPOINTS ====================

    @GetMapping("/manager/tasks/stats")
    public TaskStatsDto getManagerTaskStats(@RequestParam Long organizationId) {
        return taskAnalyticsService.getTaskStatsForOrganization(organizationId);
    }

    @GetMapping("/manager/tasks/priority-distribution")
    public List<CountByFieldDto> getManagerPriorityDistribution(@RequestParam Long organizationId) {
        return taskAnalyticsService.getCountsByFieldForOrganization(organizationId);
    }

    @GetMapping("/manager/tasks/trend")
    public List<TrendDataDto> getManagerTaskTrend(@RequestParam Long organizationId,
                                                  @RequestParam(defaultValue = "7") int days) {
        return taskAnalyticsService.getTaskTrendForOrganization(organizationId, days);
    }

    @GetMapping("/manager/clients/task-distribution")
    public List<ClientTaskDistributionDto> getClientTaskDistribution(@RequestParam Long organizationId) {
        return taskAnalyticsService.getClientTaskDistribution(organizationId);
    }

    @GetMapping("/manager/users/performance")
    public UserPerformanceDto getUserPerformance(@RequestParam String username) {
        return userAnalyticsService.getUserPerformance(username);
    }

    // ==================== USER ENDPOINTS ====================

    @GetMapping("/user/tasks/stats")
    public TaskStatsDto getUserTaskStats(@RequestParam String username) {
        return taskAnalyticsService.getTaskStatsForUser(username);
    }

    @GetMapping("/user/tasks/priority-distribution")
    public List<CountByFieldDto> getUserPriorityDistribution(@RequestParam String username) {
        return taskAnalyticsService.getCountsByFieldForUser(username);
    }

    @GetMapping("/user/tasks/trend")
    public List<TrendDataDto> getUserTaskTrend(@RequestParam String username,
                                               @RequestParam(defaultValue = "7") int days) {
        return taskAnalyticsService.getTaskTrendForUser(username, days);
    }

    @GetMapping("/user/personal-metrics")
    public PersonalMetricsDto getPersonalMetrics(@RequestParam String username) {
        return userAnalyticsService.getPersonalMetrics(username);
    }
}