package com.managementappbackend.service.domain.impl;

import com.managementappbackend.model.domain.Notification;
import com.managementappbackend.repository.NotificationRepository;
import com.managementappbackend.service.domain.NotificationService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public Optional<Notification> findById(Long id) {
        return notificationRepository.findById(id);
    }

    @Override
    public Long countByRecipientUnread(String recipient) {
        return this.notificationRepository.countByRecipientAndIsReadFalse(recipient);
    }

    @Override
    public List<Notification> findByRecipientUnread(String recipient) {
        return notificationRepository.findByRecipientAndIsReadFalseOrderByCreatedAtDesc(recipient);
    }

    @Override
    public List<Notification> findByRecipient(String recipient) {
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(recipient);
    }

    @Override
    public List<Notification> findByRecipientUnreadAndEntity(String recipient, Long entityId, String entity) {
        return notificationRepository.findByRecipientAndEntityIdAndEntityTypeAndIsReadFalse(recipient, entityId, entity);
    }

    @Override
    public void markAsRead(Long notificationId) {
        if(findById(notificationId).isPresent()){
            Notification notification = findById(notificationId).get();
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }



    @Override
    public void markAsUnread(Long notificationId) {
        if(findById(notificationId).isPresent()){
            Notification notification = findById(notificationId).get();
            notification.setRead(false);
            notificationRepository.save(notification);
        }
    }

    @Override
    public Optional<Notification> save(Notification notification) {
        return Optional.of(notificationRepository.save(notification));
    }
}
