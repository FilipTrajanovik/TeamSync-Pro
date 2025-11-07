package com.managementappbackend.listeners;

import com.managementappbackend.events.CommentAddedEvent;
import com.managementappbackend.events.TaskAssignedEvent;
import com.managementappbackend.model.domain.Notification;
import com.managementappbackend.service.domain.NotificationService;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class NotificationEventListener {

    private final NotificationService notificationService;

    public NotificationEventListener(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @EventListener
    @Async
    public void handleTaskAssignedEvent(TaskAssignedEvent event) {
        Notification notification = new Notification();
        notification.setSender(event.getAssignerUsername());
        notification.setRecipient(event.getAssignedUsername());
        notification.setMessage(event.getAssignerUsername() + " assigned you a new task: " + event.getTaskTitle());
        notification.setEntityId(event.getTaskId());
        notification.setEntityType("TASK");
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        notificationService.save(notification);
    }

    @EventListener
    @Async
    public void handleCommentAddedEvent(CommentAddedEvent event) {
        Notification notification = new Notification();
        notification.setSender(event.getCommenterUsername());
        notification.setRecipient(event.getTaskOwnerUsername());
        notification.setMessage(event.getCommenterUsername() + " commented on your task: " + event.getTaskTitle());
        notification.setEntityId(event.getTaskId());
        notification.setEntityType("TASK");
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        notificationService.save(notification);

    }
}
