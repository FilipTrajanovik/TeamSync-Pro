package com.managementappbackend.dto;

import com.managementappbackend.model.domain.Client;
import com.managementappbackend.model.domain.Organization;
import com.managementappbackend.model.domain.Task;
import com.managementappbackend.model.domain.User;
import com.managementappbackend.model.enumerations.ServicePriority;
import com.managementappbackend.model.enumerations.ServiceStatus;

import java.time.LocalDateTime;
import java.util.List;

public record DisplayTaskDto(Long id, String title, String description, ServiceStatus status, ServicePriority priority,
                             LocalDateTime dueDate, LocalDateTime completedDate, Long clientId, String assignedToUserId,
                             String createdByUserId, Long organizationId) {

    public static DisplayTaskDto from(Task task) {
        return new DisplayTaskDto(task.getId(), task.getTitle(), task.getDescription(), task.getStatus(), task.getPriority(), task.getDueDate(), task.getCompletedDate(), task.getClient().getId(), task.getAssignedToUserId().getUsername(), task.getCreatedByUserId().getUsername(), task.getOrganization().getId());
    }

    public static List<DisplayTaskDto> from(List<Task> tasks) {
        return tasks.stream().map(DisplayTaskDto::from).toList();
    }

    public Task toTask(User assignedTo, User createdBy, Organization organization, Client client) {
        return new Task(title, description, status, priority, dueDate, completedDate, client, assignedTo, createdBy, organization, LocalDateTime.now(), null);
    }

}
