package com.managementappbackend.model.exceptions;

public class NotificationNoPermissionException extends RuntimeException {
    public NotificationNoPermissionException(String message) {
        super(message);
    }
}
