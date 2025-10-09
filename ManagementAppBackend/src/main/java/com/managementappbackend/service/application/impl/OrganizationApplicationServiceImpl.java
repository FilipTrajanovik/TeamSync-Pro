package com.managementappbackend.service.application.impl;

import com.managementappbackend.dto.CreateOrganizationDto;
import com.managementappbackend.dto.DisplayOrganizationDto;
import com.managementappbackend.service.application.OrganizationApplicationService;
import com.managementappbackend.service.domain.OrganizationService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrganizationApplicationServiceImpl implements OrganizationApplicationService {

    private final OrganizationService organizationService;

    public OrganizationApplicationServiceImpl(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @Override
    public List<DisplayOrganizationDto> findAll() {
        return DisplayOrganizationDto.from(organizationService.findAll());
    }

    @Override
    public Optional<DisplayOrganizationDto> findById(Long id) {
        return organizationService.findById(id).map(DisplayOrganizationDto::from);
    }

    @Override
    public Optional<DisplayOrganizationDto> findByName(String name) {
        return organizationService.findByName(name).map(DisplayOrganizationDto::from);
    }

    @Override
    public Optional<DisplayOrganizationDto> save(CreateOrganizationDto organization) {
        return organizationService.save(organization.toOrganization()).map(DisplayOrganizationDto::from);
    }

    @Override
    public Optional<DisplayOrganizationDto> update(Long id, CreateOrganizationDto organization) {
        return organizationService.update(id, organization.toOrganization()).map(DisplayOrganizationDto::from);
    }

    @Override
    public void delete(Long organizationId) {
        organizationService.delete(organizationId);
    }
}
