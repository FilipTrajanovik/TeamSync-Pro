package com.managementappbackend.service.domain;

import com.managementappbackend.model.domain.Notification;
import org.aspectj.weaver.ast.Not;

import java.util.List;
import java.util.Optional;

public interface NotificationService {
    Optional<Notification> findById(Long id);
    Long countByRecipientUnread(String recipient);
    List<Notification> findByRecipientUnread(String recipient);
    List<Notification> findByRecipient(String recipient);
    List<Notification> findByRecipientUnreadAndEntity(String recipient, Long entityId, String entity);

    void markAsRead(Long notificationId);
    void markAsUnread(Long notificationId);
    Optional<Notification> save(Notification notification);

}
