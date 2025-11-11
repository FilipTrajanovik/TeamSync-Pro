package com.managementappbackend.web.controllers;

import com.managementappbackend.dto.CheckoutRequestDto;
import com.managementappbackend.dto.CheckoutResponseDto;
import com.managementappbackend.dto.DisplaySubscriptionPlanDto;
import com.managementappbackend.dto.DisplayUserDto;
import com.managementappbackend.model.domain.User;
import com.managementappbackend.service.application.SubscriptionPlanApplicationService;
import com.managementappbackend.service.application.UserApplicationService;
import com.managementappbackend.service.domain.UserService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.stripe.exception.StripeException;
import java.security.Principal;
import java.util.List;
import java.util.Optional;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
@RestController
@RequestMapping("/api/billing")
public class StripeController {

    private final SubscriptionPlanApplicationService subscriptionPlanApplicationService;
    private final UserService userService;

    @Value("${stripe.webhook.secret}")  // ✅ Add this
    private String webhookSecret;

    public StripeController(SubscriptionPlanApplicationService subscriptionPlanApplicationService, UserService userService) {
        this.subscriptionPlanApplicationService = subscriptionPlanApplicationService;
        this.userService = userService;
    }

    @GetMapping("/plans")
    public ResponseEntity<List<DisplaySubscriptionPlanDto>> getActivePlans() {
        return ResponseEntity.ok(subscriptionPlanApplicationService.getAllActiveSubscriptionPlan());
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponseDto> createCheckout(
            @RequestBody CheckoutRequestDto request,
            Principal principal
    ) throws StripeException {
        System.out.println("=== CHECKOUT REQUEST ===");
        System.out.println("Request: " + request);

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Username: " + username);

        // ✅ GET THE ACTUAL USER ENTITY, NOT THE DTO
        User user = userService.findByUsername(username);  // Use userService directly!

        if (user == null) {
            System.out.println("❌ User not found");
            return ResponseEntity.notFound().build();
        }

        System.out.println("✅ User found: " + user.getUsername());
        System.out.println("📦 Organizations size: " + user.getOrganizations().size());

        // ✅ CHECK IF USER HAS ORGANIZATIONS
        if (user.getOrganizations().isEmpty()) {
            System.out.println("❌ User has no organizations!");
            return ResponseEntity.badRequest().build();
        }

        Long orgId = user.getOrganizations().get(0).getId();
        System.out.println("✅ Organization ID: " + orgId);

        CheckoutResponseDto responseDto = subscriptionPlanApplicationService.createCheckoutSession(
                orgId,
                request.planId()
        );

        System.out.println("✅ Checkout response: " + responseDto);
        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader
    ) {
        System.out.println("=== STRIPE WEBHOOK RECEIVED ===");

        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            System.out.println("❌ Webhook signature verification failed: " + e.getMessage());
            return ResponseEntity.status(400).body("Invalid signature");
        }

        System.out.println("✅ Webhook verified. Event type: " + event.getType());

        // Handle checkout.session.completed
        if ("checkout.session.completed".equals(event.getType())) {
            try {
                // ✅ USE JACKSON TO PARSE JSON
                String dataJson = event.getData().toJson();
                System.out.println("📋 Raw event data: " + dataJson);

                // Parse using Jackson ObjectMapper
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                com.fasterxml.jackson.databind.JsonNode jsonNode = mapper.readTree(dataJson);
                String sessionId = jsonNode.get("object").get("id").asText();

                System.out.println("🔍 Session ID from event: " + sessionId);

                // Retrieve the full session from Stripe API
                Session session = Session.retrieve(sessionId);

                System.out.println("🎉 Checkout completed!");
                System.out.println("Session ID: " + session.getId());
                System.out.println("Customer: " + session.getCustomer());
                System.out.println("Subscription: " + session.getSubscription());
                System.out.println("Metadata: " + session.getMetadata());

                String organizationIdStr = session.getMetadata().get("organizationId");
                String planName = session.getMetadata().get("planName");

                System.out.println("Organization ID from metadata: " + organizationIdStr);
                System.out.println("Plan Name from metadata: " + planName);

                if (organizationIdStr != null && planName != null) {
                    Long organizationId = Long.parseLong(organizationIdStr);

                    System.out.println("📝 Calling updateOrganizationSubscription...");

                    // Update the organization's subscription
                    subscriptionPlanApplicationService.updateOrganizationSubscription(
                            organizationId,
                            planName,
                            session.getSubscription()
                    );

                    System.out.println("✅ Organization subscription updated!");
                } else {
                    System.out.println("⚠️ WARNING: Missing metadata!");
                    System.out.println("All metadata keys: " + session.getMetadata().keySet());
                }

            } catch (Exception e) {
                System.out.println("❌ Error processing checkout.session.completed:");
                e.printStackTrace();
                return ResponseEntity.status(500).body("Error processing webhook");
            }
        }

        return ResponseEntity.ok().build();
    }
}
