package com.managementappbackend.model.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.Data;


import jakarta.persistence.*;

import java.time.LocalDateTime;

@Data
@Entity
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long Id;

    private String text;

    @ManyToOne
    private User user;

    @ManyToOne
    private Task task;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isEdited;

    public Comment() {
        createdAt = LocalDateTime.now();
    }

    public Comment(String text, User user, Task task, LocalDateTime createdAt, LocalDateTime updatedAt, boolean isEdited) {
        this.text = text;
        this.user = user;
        this.task = task;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isEdited = isEdited;
    }

    public long getId() {
        return Id;
    }

    public void setId(long id) {
        Id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isEdited() {
        return isEdited;
    }

    public void setEdited(boolean edited) {
        isEdited = edited;
    }
}
