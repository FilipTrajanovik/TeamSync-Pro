package com.managementappbackend.dto;

import com.managementappbackend.model.domain.Organization;
import com.managementappbackend.model.enumerations.OrganizationType;

import java.time.LocalDateTime;
import java.util.List;

public record CreateOrganizationDto(String name, String description, OrganizationType organizationType, String contactEmail, String contactPhone, String address) {

    public static CreateOrganizationDto from(Organization organization) {
        return new CreateOrganizationDto(organization.getName(), organization.getDescription(), organization.getType(), organization.getContactEmail(), organization.getContactPhone(), organization.getAddress());
    }

    public static List<CreateOrganizationDto> from(List<Organization> organizations) {
        return organizations.stream().map(CreateOrganizationDto::from).toList();
    }

    public Organization toOrganization() {
        return new Organization(name, description, organizationType, contactEmail, contactPhone, address, true, LocalDateTime.now(), null);
    }
}
