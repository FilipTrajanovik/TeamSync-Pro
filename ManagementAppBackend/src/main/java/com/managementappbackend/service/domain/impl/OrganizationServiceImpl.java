package com.managementappbackend.service.domain.impl;

import com.managementappbackend.model.domain.Organization;
import com.managementappbackend.repository.OrganizationRepository;
import com.managementappbackend.service.domain.OrganizationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrganizationServiceImpl implements OrganizationService {

    private final OrganizationRepository organizationRepository;

    public OrganizationServiceImpl(OrganizationRepository organizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    @Override
    public List<Organization> findAll() {
        return organizationRepository.findAll();
    }

    @Override
    public Optional<Organization> findById(Long id) {
        return organizationRepository.findById(id);
    }

    @Override
    public Optional<Organization> findByName(String name) {
        return organizationRepository.findByName(name);
    }

    @Override
    public Optional<Organization> save(Organization organization) {
        return Optional.of(organizationRepository.save(organization));
    }

    @Override
    public Optional<Organization> update(Long id, Organization organization) {
        return organizationRepository.findById(id)
                .map(existingOrganization -> {
                    existingOrganization.setName(organization.getName());
                    existingOrganization.setDescription(organization.getDescription());
                    existingOrganization.setAddress(organization.getAddress());
                    existingOrganization.setContactEmail(organization.getContactEmail());
                    existingOrganization.setUpdatedAt(LocalDateTime.now());
                    return organizationRepository.save(existingOrganization);
                });
    }

    @Override
    public void delete(Long organizationId) {
        organizationRepository.deleteById(organizationId);
    }
}
