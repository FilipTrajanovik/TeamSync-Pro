package com.managementappbackend.dto;

import com.managementappbackend.model.domain.SubscriptionPlan;

import java.time.LocalDateTime;
import java.util.List;

public record CreateSubscriptionPlanDto(
        String name, String displayName, Double pricePerMonth, Integer maxUsers, Integer maxClients, String stripePriceId
) {
    public static CreateSubscriptionPlanDto from(SubscriptionPlan subscriptionPlan) {
        return new CreateSubscriptionPlanDto(
                subscriptionPlan.getName(), subscriptionPlan.getDisplayName(), subscriptionPlan.getPricePerMonth(),
                subscriptionPlan.getMaxUsers(), subscriptionPlan.getMaxClients(), subscriptionPlan.getStripePriceId()
        );
    }

    public static List<CreateSubscriptionPlanDto> from(List<SubscriptionPlan> subscriptionPlans) {
        return subscriptionPlans.stream().map(CreateSubscriptionPlanDto::from).toList();
    }

    public SubscriptionPlan toSubscriptionPlan() {
        return new SubscriptionPlan(
                name, displayName, pricePerMonth, maxUsers, maxClients, true, stripePriceId, LocalDateTime.now(), LocalDateTime.now()
        );
    }
}
