package com.managementappbackend.service.application;

import com.managementappbackend.dto.CheckoutRequestDto;
import com.managementappbackend.dto.CheckoutResponseDto;
import com.managementappbackend.dto.DisplaySubscriptionPlanDto;
import com.stripe.exception.StripeException;

import java.util.List;

public interface SubscriptionPlanApplicationService {
    List<DisplaySubscriptionPlanDto> getAllActiveSubscriptionPlan();
    CheckoutResponseDto createCheckoutSession(Long organizationId, Long planId) throws StripeException;
    void updateOrganizationSubscription(Long organizationId, String planName, String stripeSubscriptionId);
}
