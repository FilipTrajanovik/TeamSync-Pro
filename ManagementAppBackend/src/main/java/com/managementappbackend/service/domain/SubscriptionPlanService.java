package com.managementappbackend.service.domain;

import com.managementappbackend.model.domain.SubscriptionPlan;

import java.util.List;
import java.util.Optional;

public interface SubscriptionPlanService {
    Optional<SubscriptionPlan> findById(Long id);
    Optional<SubscriptionPlan> findByName(String name);
    List<SubscriptionPlan> findAllActivePlans();
    Optional<SubscriptionPlan> createSubscriptionPlan(SubscriptionPlan subscriptionPlan);
    Optional<SubscriptionPlan> updateSubscriptionPlan(Long id, SubscriptionPlan subscriptionPlan);
    void deleteSubscriptionPlan(SubscriptionPlan subscriptionPlan);
}
