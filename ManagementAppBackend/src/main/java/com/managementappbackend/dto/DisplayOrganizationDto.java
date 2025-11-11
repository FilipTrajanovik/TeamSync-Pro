package com.managementappbackend.dto;

import com.managementappbackend.model.domain.Organization;
import com.managementappbackend.model.enumerations.OrganizationType;

import java.time.LocalDateTime;
import java.util.List;

public record DisplayOrganizationDto(
        Long id,
        String name,
        String description,
        OrganizationType organizationType,
        String contactEmail,
        String contactPhone,
        String address,

        String subscriptionPlanName,
        Double subscriptionPlanPrice,
        String stripeSubscriptionId,
        LocalDateTime subscriptionStartDate
) {

    public static DisplayOrganizationDto from(Organization organization) {
        return new DisplayOrganizationDto(
                organization.getId(),
                organization.getName(),
                organization.getDescription(),
                organization.getType(),
                organization.getContactEmail(),
                organization.getContactPhone(),
                organization.getAddress(),


                organization.getSubscriptionPlan() != null ? organization.getSubscriptionPlan().getName() : "FREE",
                organization.getSubscriptionPlan() != null ? organization.getSubscriptionPlan().getPricePerMonth() : 0.0,
                organization.getStripeSubscriptionId(),
                organization.getCreatedAt()
        );
    }

    public static List<DisplayOrganizationDto> from(List<Organization> organizations) {
        return organizations.stream().map(DisplayOrganizationDto::from).toList();
    }

    public Organization toOrganization() {
        return new Organization(name, description, organizationType, contactEmail, contactPhone, address, true, LocalDateTime.now(), null);
    }
}