package com.managementappbackend.service.domain.analytics;

import com.managementappbackend.model.domain.Task;
import com.managementappbackend.model.domain.User;

import java.util.List;

public interface UserAnalyticsService {

    Long getCompletedTasksByUser(User user);
    Double getOnTimeRate(User user);
    Double getAvgCompletionRate(User user);
    Long getTotalTasksByUser(User user);
}
