package com.managementappbackend.model.exceptions;

public class SubscriptionPlanNotFound extends RuntimeException {
    public SubscriptionPlanNotFound(String message) {
        super(message);
    }
}
