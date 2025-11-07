package com.managementappbackend.repository;

import com.managementappbackend.model.domain.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Long countByRecipientAndIsReadFalse(String recipient);
    //findByRecipientUnread
    List<Notification> findByRecipientAndIsReadFalseOrderByCreatedAtDesc(String recipient);
    List<Notification> findByRecipientOrderByCreatedAtDesc(String recipient);
    //findByRecipientUnreadAndEntity
    List<Notification> findByRecipientAndEntityIdAndEntityTypeAndIsReadFalse(String recipient, Long entityId, String entityType);
}
