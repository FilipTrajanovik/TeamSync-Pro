package com.managementappbackend.dto;

import com.managementappbackend.model.domain.Notification;

import java.time.LocalDateTime;
import java.util.List;

public record DisplayNotificationDto(Long id, String sender, String recipient, String message, Long entityId, String entityType, boolean isRead, LocalDateTime createdAt) {

    public static DisplayNotificationDto from(Notification notification) {
        return new DisplayNotificationDto(
                notification.getId(),
                notification.getSender(),
                notification.getRecipient(),
                notification.getMessage(),
                notification.getEntityId(),
                notification.getEntityType(),
                notification.getIsRead(),
                notification.getCreatedAt()
        );
    }

    public static List<DisplayNotificationDto> from(List<Notification> notifications) {
        return notifications.stream().map(DisplayNotificationDto::from).toList();
    }

    public Notification toNotification(){
        return new Notification(
                sender, recipient, message, entityId, entityType, isRead, createdAt
        );
    }
}
