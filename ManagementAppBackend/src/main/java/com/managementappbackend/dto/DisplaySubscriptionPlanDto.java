package com.managementappbackend.dto;

import com.managementappbackend.model.domain.SubscriptionPlan;

import java.util.List;

public record DisplaySubscriptionPlanDto(
        Long id, String name, String displayName, Double pricePerMonth, Integer maxUsers, Integer maxClients, Boolean isActive
) {
    public static DisplaySubscriptionPlanDto from(SubscriptionPlan subscriptionPlan) {
        return new DisplaySubscriptionPlanDto(
                subscriptionPlan.getId(), subscriptionPlan.getName(), subscriptionPlan.getDisplayName(),
                subscriptionPlan.getPricePerMonth(), subscriptionPlan.getMaxUsers(), subscriptionPlan.getMaxClients(),
                subscriptionPlan.getActive()
        );
    }

    public static List<DisplaySubscriptionPlanDto> from(List<SubscriptionPlan> subscriptionPlans) {
        return subscriptionPlans.stream().map(DisplaySubscriptionPlanDto::from).toList();
    }


}
