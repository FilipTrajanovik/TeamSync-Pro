package com.managementappbackend.web.controllers;

import com.managementappbackend.dto.DisplayNotificationDto;
import com.managementappbackend.service.application.NotificationApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationApplicationService notificationApplicationService;

    public NotificationController(NotificationApplicationService notificationApplicationService) {
        this.notificationApplicationService = notificationApplicationService;
    }

    @Operation(summary = "Get unread notification count", description = "Returns the number of unread notifications for the logged-in user.")
    @GetMapping("/count-my-notifications")
    public ResponseEntity<Long> countMyNotifications() {
        Long count = notificationApplicationService.countByRecipientUnread();

        if (count == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        return ResponseEntity.status(HttpStatus.OK).body(count);
    }

    @Operation(summary = "Get unread notifications", description = "Returns all unread notifications for the logged-in user.")
    @GetMapping("/unread")
    public List<DisplayNotificationDto> getUnreadNotifications() {
        return notificationApplicationService.findByRecipientUnread();
    }

    @Operation(summary = "Get all my notifications", description = "Returns all notifications for the logged-in user, both read and unread.")
    @GetMapping("/my-notifications")
    public List<DisplayNotificationDto> getMyNotifications() {
        return notificationApplicationService.findByRecipient();
    }

    @Operation(summary = "Get unread notifications by entity", description = "Returns unread notifications for a specific entity and entity ID.")
    @GetMapping("/unread/{entity}/{entityId}")
    public List<DisplayNotificationDto> getUnreadNotifications(@PathVariable("entity") String entity,@PathVariable("entityId") Long entityId) {
        return notificationApplicationService.findByRecipientUnreadAndEntity(entityId, entity);
    }

    @Operation(summary = "Mark notification as read", description = "Marks a specific notification as read.")
    @PutMapping("/mark-it-as-read/{id}")
    public ResponseEntity<Void> markItAsRead(@PathVariable Long id) {
         notificationApplicationService.markAsRead(id);
         return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Mark notification as unread", description = "Marks a specific notification as unread again.")
    @PutMapping("/mark-it-as-unread/{id}")
    public ResponseEntity<Void> markItAsUnread(@PathVariable Long id) {
        notificationApplicationService.markAsUnread(id);
        return ResponseEntity.noContent().build();
    }


}
