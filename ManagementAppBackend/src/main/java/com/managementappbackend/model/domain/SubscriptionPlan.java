package com.managementappbackend.model.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "subscription_plans")
public class SubscriptionPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String displayName;

    @Column(nullable = false)
    private Double pricePerMonth;

    @Column(nullable = false)
    private Integer maxUsers;

    @Column(nullable = false)
    private Integer maxClients;

    @Column(nullable = false)
    private Boolean isActive;

    @Column(name = "stripe_price_id")
    private String stripePriceId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name="updated_at")
    private LocalDateTime updatedAt;

    public SubscriptionPlan() {
    }

    public SubscriptionPlan(String name, String displayName, Double pricePerMonth, Integer maxUsers, Integer maxClients, Boolean isActive, String stripePriceId, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.name = name;
        this.displayName = displayName;
        this.pricePerMonth = pricePerMonth;
        this.maxUsers = maxUsers;
        this.maxClients = maxClients;
        this.isActive = isActive;
        this.stripePriceId = stripePriceId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Double getPricePerMonth() {
        return pricePerMonth;
    }

    public void setPricePerMonth(Double pricePerMonth) {
        this.pricePerMonth = pricePerMonth;
    }

    public Integer getMaxUsers() {
        return maxUsers;
    }

    public void setMaxUsers(Integer maxUsers) {
        this.maxUsers = maxUsers;
    }

    public Integer getMaxClients() {
        return maxClients;
    }

    public void setMaxClients(Integer maxClients) {
        this.maxClients = maxClients;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public String getStripePriceId() {
        return stripePriceId;
    }

    public void setStripePriceId(String stripePriceId) {
        this.stripePriceId = stripePriceId;
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
}
