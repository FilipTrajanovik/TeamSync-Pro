package com.managementappbackend.events;


import org.springframework.context.ApplicationEvent;

public class TaskAssignedEvent extends ApplicationEvent {

    private final String assignerUsername;
    private final String assignedUsername;
    private final Long taskId;
    private final String taskTitle;

    public TaskAssignedEvent(Object source, String assignerUsername, String assignedUsername, Long taskId, String taskTitle) {
        super(source);
        this.assignerUsername = assignerUsername;
        this.assignedUsername = assignedUsername;
        this.taskId = taskId;
        this.taskTitle = taskTitle;
    }

    public String getAssignerUsername() {
        return assignerUsername;
    }

    public String getAssignedUsername() {
        return assignedUsername;
    }

    public Long getTaskId() {
        return taskId;
    }

    public String getTaskTitle() {
        return taskTitle;
    }
}
