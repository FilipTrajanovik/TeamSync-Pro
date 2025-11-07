package com.managementappbackend.service.application.impl;

import com.managementappbackend.dto.DisplayNotificationDto;
import com.managementappbackend.model.domain.Notification;
import com.managementappbackend.model.domain.User;
import com.managementappbackend.model.exceptions.NotificationNoPermissionException;
import com.managementappbackend.model.exceptions.NotificationNotFoundException;
import com.managementappbackend.service.application.NotificationApplicationService;
import com.managementappbackend.service.domain.NotificationService;
import com.managementappbackend.service.domain.UserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationApplicationServiceImpl implements NotificationApplicationService {

    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationApplicationServiceImpl(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @Override
    public Optional<DisplayNotificationDto> findById(Long id) {
        return notificationService.findById(id).map(DisplayNotificationDto::from);
    }

    @Override
    public Long countByRecipientUnread() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByUsername(username);
        return notificationService.countByRecipientUnread(username);
    }

    @Override
    public List<DisplayNotificationDto> findByRecipientUnread() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return notificationService.findByRecipientUnread(username).stream().map(DisplayNotificationDto::from).toList();
    }

    @Override
    public List<DisplayNotificationDto> findByRecipient() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return notificationService.findByRecipient(username).stream().map(DisplayNotificationDto::from).toList();
    }

    @Override
    public List<DisplayNotificationDto> findByRecipientUnreadAndEntity(Long entityId, String entity) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return notificationService.findByRecipientUnreadAndEntity(username, entityId, entity).stream().map(DisplayNotificationDto::from).toList();
    }

    @Override
    public void markAsRead(Long notificationId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Notification notification = notificationService.findById(notificationId).orElseThrow(() -> new NotificationNotFoundException("Notification with " + notificationId + " has not been found"));
        boolean hasPermissionToChange = notification.getRecipient().equals(username);
        if (hasPermissionToChange) {
            notificationService.markAsRead(notificationId);
        }else{
            throw new NotificationNoPermissionException("You don't have permissions for this notification");
        }
    }

    @Override
    public void markAsUnread(Long notificationId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Notification notification = notificationService.findById(notificationId).orElseThrow(() -> new NotificationNotFoundException("Notification with " + notificationId + " has not been found"));
        boolean hasPermissionToChange = notification.getRecipient().equals(username);
        if (hasPermissionToChange) {
            notificationService.markAsUnread(notificationId);
        }else{
            throw new NotificationNoPermissionException("You don't have permissions for this notification");
        }
    }
}
