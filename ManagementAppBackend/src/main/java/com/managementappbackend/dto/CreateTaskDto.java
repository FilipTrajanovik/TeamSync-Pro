package com.managementappbackend.dto;

import com.managementappbackend.model.domain.Client;
import com.managementappbackend.model.domain.Organization;
import com.managementappbackend.model.domain.Task;
import com.managementappbackend.model.domain.User;
import com.managementappbackend.model.enumerations.ServicePriority;
import com.managementappbackend.model.enumerations.ServiceStatus;

import java.time.LocalDateTime;
import java.util.List;

public record CreateTaskDto(String title, String description, ServiceStatus status, ServicePriority priority, LocalDateTime dueDate, LocalDateTime completedDate, Long clientId, String assignedToUserId, Long organizationId, boolean finished) {

    public static CreateTaskDto from(Task task){
        return new CreateTaskDto(task.getTitle(), task.getDescription(), task.getStatus(), task.getPriority(), task.getDueDate(), task.getCompletedDate(), task.getClient().getId(), task.getAssignedToUserId().getUsername(),  task.getOrganization().getId(), task.isFinished());

    }
    public static List<CreateTaskDto> from(List<Task> tasks){
        return tasks.stream().map(CreateTaskDto::from).toList();
    }

    public Task toTask(User assignedTo, User createdBy, Organization organization, Client client){
        return new Task(title, description, status, priority, dueDate, completedDate, client, assignedTo, createdBy, organization, LocalDateTime.now(), null, finished);
    }

}
