package com.managementappbackend.events;

import org.springframework.context.ApplicationEvent;

public class CommentAddedEvent extends ApplicationEvent {
    private final String commenterUsername;
    private final String taskOwnerUsername;
    private final Long taskId;
    private final String taskTitle;

    public CommentAddedEvent(Object source, String commenterUsername, String taskOwnerUsername, Long taskId, String taskTitle) {
        super(source);
        this.commenterUsername = commenterUsername;
        this.taskOwnerUsername = taskOwnerUsername;
        this.taskId = taskId;
        this.taskTitle = taskTitle;
    }

    public String getCommenterUsername() {
        return commenterUsername;
    }

    public String getTaskOwnerUsername() {
        return taskOwnerUsername;
    }

    public Long getTaskId() {
        return taskId;
    }

    public String getTaskTitle() {
        return taskTitle;
    }
}
