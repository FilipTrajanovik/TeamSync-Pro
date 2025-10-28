package com.managementappbackend.service.application.analytics.impl;

import com.managementappbackend.dto.analytics.PersonalMetricsDto;
import com.managementappbackend.dto.analytics.UserPerformanceDto;
import com.managementappbackend.model.domain.User;
import com.managementappbackend.service.application.analytics.UserAnalyticsApplicationService;
import com.managementappbackend.service.domain.UserService;
import com.managementappbackend.service.domain.analytics.UserAnalyticsService;
import org.springframework.stereotype.Service;

@Service
public class UserAnalyticsApplicationServiceImpl implements UserAnalyticsApplicationService {

    private final UserService userService;
    private final UserAnalyticsService userAnalyticsService;

    public UserAnalyticsApplicationServiceImpl(UserService userService, UserAnalyticsService userAnalyticsService) {
        this.userService = userService;
        this.userAnalyticsService = userAnalyticsService;
    }

    @Override
    public PersonalMetricsDto getPersonalMetrics(String username) {
        User user = userService.findByUsername(username);

        return new PersonalMetricsDto(
                userAnalyticsService.getAvgCompletionRate(user),
                userAnalyticsService.getOnTimeRate(user),
                userAnalyticsService.getCompletedTasksByUser(user),
                "N/A"
        );
    }

    @Override
    public UserPerformanceDto getUserPerformance(String username) {
        User user = userService.findByUsername(username);

        Long totalTasks = userAnalyticsService.getTotalTasksByUser(user);
        Long completedTasks = userAnalyticsService.getCompletedTasksByUser(user);
        Double completionRate = totalTasks > 0 ? (completedTasks * 100.0) / totalTasks : 0.0;

        return new UserPerformanceDto(
                user.getUsername(),
                user.getName(),
                user.getSurname(),
                totalTasks,
                completedTasks,
                completionRate,
                userAnalyticsService.getAvgCompletionRate(user)
        );
    }
}
