package com.managementappbackend.model.exceptions;

public class CommentNotFoundExceiption extends RuntimeException {
    public CommentNotFoundExceiption(String message) {
        super(message);
    }
}
