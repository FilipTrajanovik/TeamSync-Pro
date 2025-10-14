package com.managementappbackend.service.domain;

import com.managementappbackend.model.domain.Organization;

import java.util.List;
import java.util.Optional;

public interface OrganizationService {
    List<Organization> findAll();
    Optional<Organization> findById(Long id);
    Optional<Organization> findByName(String name);
    Optional<Organization> save(Organization organization);
    Optional<Organization> update(Long id,Organization organization);
    void delete(Long organizationId);
    List<Organization> findByUsername(String username);

}
