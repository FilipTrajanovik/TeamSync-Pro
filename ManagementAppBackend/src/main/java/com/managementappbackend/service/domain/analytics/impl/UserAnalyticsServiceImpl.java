package com.managementappbackend.service.domain.analytics.impl;

import com.managementappbackend.model.domain.Task;
import com.managementappbackend.model.domain.User;
import com.managementappbackend.model.enumerations.ServiceStatus;
import com.managementappbackend.repository.TaskRepository;
import com.managementappbackend.service.domain.analytics.UserAnalyticsService;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
public class UserAnalyticsServiceImpl implements UserAnalyticsService {

    private final TaskRepository taskRepository;

    public UserAnalyticsServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public Long getCompletedTasksByUser(User user) {
        return (long) taskRepository.findAllByAssignedToUserIdAndStatus(user, ServiceStatus.COMPLETED).size();
    }

    @Override
    public Double getOnTimeRate(User user) {
        List<Task> completedTasks = taskRepository.findAllByAssignedToUserIdAndStatus(user, ServiceStatus.COMPLETED);

        if (completedTasks.isEmpty()) {
            return 0.0;
        }

        long onTimeCount = completedTasks.stream()
                .filter(t -> t.getDueDate() != null && t.getCompletedDate() != null)
                .filter(t -> !t.getCompletedDate().isAfter(t.getDueDate()))
                .count();

        return (onTimeCount * 100.0) / completedTasks.size();
    }

    @Override
    public Double getAvgCompletionRate(User user) {
        List<Task> completedTasks = taskRepository.findAllByAssignedToUserIdAndStatus(user, ServiceStatus.COMPLETED);

        return completedTasks.stream()
                .filter(t -> t.getCompletedDate() != null && t.getCreatedDate() != null)
                .mapToDouble(t -> Duration.between(t.getCreatedDate(), t.getCompletedDate()).toHours())
                .average()
                .orElse(0.0);
    }

    @Override
    public Long getTotalTasksByUser(User user) {
        return taskRepository.countByAssignedToUserId(user);
    }
}
