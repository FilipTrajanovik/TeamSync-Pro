package com.managementappbackend.model.domain;

import com.managementappbackend.model.enumerations.OrganizationType;
import com.managementappbackend.model.enumerations.ServicePriority;
import com.managementappbackend.model.enumerations.ServiceStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private ServiceStatus status;

    @Enumerated(EnumType.STRING)
    private ServicePriority priority;

    private LocalDateTime dueDate;
    private LocalDateTime completedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    private User assignedToUserId;

    @ManyToOne(fetch = FetchType.LAZY)
    private User createdByUserId;

    @ManyToOne(fetch = FetchType.LAZY)
    private Organization organization;


    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    private List<Comment> comments;

    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    private boolean finished;

    public Task() {
    }

    public Task(String title, String description, ServiceStatus status, ServicePriority priority, LocalDateTime dueDate, LocalDateTime completedDate, Client client, User assignedToUserId, User createdByUserId, Organization organization, LocalDateTime createdDate, LocalDateTime updatedDate, boolean finished) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.dueDate = dueDate;
        this.completedDate = completedDate;
        this.client = client;
        this.assignedToUserId = assignedToUserId;
        this.createdByUserId = createdByUserId;
        this.organization = organization;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.finished=finished;
        this.comments = new ArrayList<>();
    }

    public boolean isFinished() {
        return finished;
    }

    public void setFinished(boolean finished) {
        this.finished = finished;
    }

    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        Id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ServiceStatus getStatus() {
        return status;
    }

    public void setStatus(ServiceStatus status) {
        this.status = status;
    }

    public ServicePriority getPriority() {
        return priority;
    }

    public void setPriority(ServicePriority priority) {
        this.priority = priority;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDateTime getCompletedDate() {
        return completedDate;
    }

    public void setCompletedDate(LocalDateTime completedDate) {
        this.completedDate = completedDate;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public User getAssignedToUserId() {
        return assignedToUserId;
    }

    public void setAssignedToUserId(User assignedToUserId) {
        this.assignedToUserId = assignedToUserId;
    }

    public User getCreatedByUserId() {
        return createdByUserId;
    }

    public void setCreatedByUserId(User createdByUserId) {
        this.createdByUserId = createdByUserId;
    }

    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDateTime getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(LocalDateTime updatedDate) {
        this.updatedDate = updatedDate;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }
}
