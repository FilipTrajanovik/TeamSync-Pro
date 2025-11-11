package com.managementappbackend.service.application.impl;

import com.managementappbackend.dto.CheckoutResponseDto;
import com.managementappbackend.dto.DisplaySubscriptionPlanDto;
import com.managementappbackend.model.domain.Organization;
import com.managementappbackend.model.domain.SubscriptionPlan;
import com.managementappbackend.model.exceptions.OrganizationNotFoundException;
import com.managementappbackend.model.exceptions.SubscriptionPlanNotFound;
import com.managementappbackend.service.application.SubscriptionPlanApplicationService;
import com.managementappbackend.service.domain.OrganizationService;
import com.managementappbackend.service.domain.SubscriptionPlanService;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.stripe.model.checkout.Session;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubscriptionPlanApplicationServiceImpl implements SubscriptionPlanApplicationService {

    private final SubscriptionPlanService subscriptionPlanService;
    private final OrganizationService organizationService;


    @Value("${app.frontend.url}")
    private String frontendUrl;

    public SubscriptionPlanApplicationServiceImpl(SubscriptionPlanService subscriptionPlanService, OrganizationService organizationService) {
        this.subscriptionPlanService = subscriptionPlanService;
        this.organizationService = organizationService;
    }

    @Override
    public List<DisplaySubscriptionPlanDto> getAllActiveSubscriptionPlan() {
        return subscriptionPlanService.findAllActivePlans().stream().map(DisplaySubscriptionPlanDto::from).toList();
    }


    @Transactional
    @Override
    public CheckoutResponseDto createCheckoutSession(Long organizationId, Long planId) throws StripeException {
        Organization organization = organizationService.findById(organizationId)
                .orElseThrow(() -> new OrganizationNotFoundException("Organization not found with ID: " + organizationId));

        SubscriptionPlan plan = subscriptionPlanService.findById(planId)
                .orElseThrow(() -> new SubscriptionPlanNotFound("SubscriptionPlan not found with ID: " + planId));

        System.out.println("=== CREATE CHECKOUT SESSION ===");
        System.out.println("Organization: " + organization.getName() + " (ID: " + organizationId + ")");
        System.out.println("Plan: " + plan.getName() + " (ID: " + planId + ")");

        String customerId = organization.getStripeCustomerId();
        if (customerId == null) {
            Customer customer = Customer.create(
                    CustomerCreateParams.builder()
                            .setEmail(organization.getContactEmail())
                            .setName(organization.getName())
                            .putMetadata("organizationId", organizationId.toString())
                            .build()
            );
            customerId = customer.getId();
            organization.setStripeCustomerId(customerId);
            organizationService.update(organizationId, organization);
            System.out.println("✅ Created Stripe customer: " + customerId);
        }

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setCustomer(customerId)
                .setSuccessUrl(frontendUrl + "/manager/dashboard?session_id={CHECKOUT_SESSION_ID}")  // ✅ Changed to manager/dashboard
                .setCancelUrl(frontendUrl + "/manager/dashboard?canceled=true")  // ✅ Changed to manager/dashboard
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPrice(plan.getStripePriceId())
                                .setQuantity(1L)
                                .build()
                )
                .putMetadata("organizationId", organizationId.toString())
                .putMetadata("planName", plan.getName())  // ✅ CHANGED: Store planName instead of planId!
                .build();

        Session session = Session.create(params);

        System.out.println("✅ Checkout session created: " + session.getId());
        System.out.println("✅ Checkout URL: " + session.getUrl());

        return new CheckoutResponseDto(session.getUrl());
    }

    @Override
    public void updateOrganizationSubscription(Long organizationId, String planName, String stripeSubscriptionId) {
        System.out.println("=== UPDATING ORGANIZATION SUBSCRIPTION ===");
        System.out.println("Org ID: " + organizationId);
        System.out.println("Plan: " + planName);
        System.out.println("Stripe Subscription ID: " + stripeSubscriptionId);

        // Find the organization
        Organization organization = organizationService.findById(organizationId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        // Find the subscription plan
        SubscriptionPlan subscriptionPlan = subscriptionPlanService.findByName(planName)
                .orElseThrow(() -> new RuntimeException("Subscription plan not found: " + planName));

        // Update organization
        organization.setSubscriptionPlan(subscriptionPlan);
        organization.setStripeSubscriptionId(stripeSubscriptionId);
        organization.setUpdatedAt(LocalDateTime.now());

        // Save
        organizationService.save(organization);

        System.out.println("✅ Organization updated successfully!");
    }
}
