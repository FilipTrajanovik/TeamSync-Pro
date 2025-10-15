package com.managementappbackend.model.exceptions;

public class NotOwnedTaskException extends RuntimeException {
    public NotOwnedTaskException(String message) {
        super(message);
    }
}
