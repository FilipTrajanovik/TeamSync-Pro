package com.managementappbackend.service.application;

import com.managementappbackend.dto.DisplayNotificationDto;
import com.managementappbackend.model.domain.Notification;

import java.util.List;
import java.util.Optional;

public interface NotificationApplicationService {

    Optional<DisplayNotificationDto> findById(Long id);
    Long countByRecipientUnread();
    List<DisplayNotificationDto> findByRecipientUnread();
    List<DisplayNotificationDto> findByRecipient();
    List<DisplayNotificationDto> findByRecipientUnreadAndEntity(Long entityId, String entity);

    void markAsRead(Long notificationId);
    void markAsUnread(Long notificationId);
}
