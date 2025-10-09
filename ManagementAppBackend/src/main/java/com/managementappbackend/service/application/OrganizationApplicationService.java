package com.managementappbackend.service.application;

import com.managementappbackend.dto.CreateOrganizationDto;
import com.managementappbackend.dto.DisplayOrganizationDto;
import com.managementappbackend.model.domain.Organization;

import java.util.List;
import java.util.Optional;

public interface OrganizationApplicationService {
    List<DisplayOrganizationDto> findAll();
    Optional<DisplayOrganizationDto> findById(Long id);
    Optional<DisplayOrganizationDto> findByName(String name);
    Optional<DisplayOrganizationDto> save(CreateOrganizationDto organization);
    Optional<DisplayOrganizationDto> update(Long id,CreateOrganizationDto organization);
    void delete(Long organizationId);
}
