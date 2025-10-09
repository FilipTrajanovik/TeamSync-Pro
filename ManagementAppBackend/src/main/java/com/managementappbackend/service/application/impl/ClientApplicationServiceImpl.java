package com.managementappbackend.service.application.impl;

import com.managementappbackend.dto.CreateClientDto;
import com.managementappbackend.dto.DisplayClientDto;
import com.managementappbackend.model.domain.Organization;
import com.managementappbackend.model.exceptions.OrganizationNotFoundException;
import com.managementappbackend.service.application.ClientApplicationService;
import com.managementappbackend.service.domain.ClientService;
import com.managementappbackend.service.domain.OrganizationService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientApplicationServiceImpl implements ClientApplicationService {

    private final ClientService clientService;
    private final OrganizationService organizationService;

    public ClientApplicationServiceImpl(ClientService clientService, OrganizationService organizationService) {
        this.clientService = clientService;
        this.organizationService = organizationService;
    }

    @Override
    public List<DisplayClientDto> findAll() {
        return DisplayClientDto.from(clientService.findAll());
    }

    @Override
    public Optional<DisplayClientDto> findById(Long id) {
        return clientService.findById(id).map(DisplayClientDto::from);
    }

    @Override
    public Optional<DisplayClientDto> findByName(String name) {
        return clientService.findByName(name).map(DisplayClientDto::from);
    }

    @Override
    public Optional<DisplayClientDto> findByEmail(String email) {
        return clientService.findByEmail(email).map(DisplayClientDto::from);
    }

    @Override
    public Optional<DisplayClientDto> save(CreateClientDto client) {
        Organization org = organizationService.findById(client.organizationId()).orElseThrow(() -> new OrganizationNotFoundException("Organization with that ID is not found"));
        return clientService.save(client.toClient(org)).map(DisplayClientDto::from);
    }

    @Override
    public Optional<DisplayClientDto> update(Long id, CreateClientDto client) {
        Organization org = organizationService.findById(client.organizationId()).orElseThrow(() -> new OrganizationNotFoundException("Organization with that ID is not found"));
        return clientService.update(id, client.toClient(org)).map(DisplayClientDto::from);
    }

    @Override
    public List<DisplayClientDto> findByOrganizationId(Long orgId) {
        Organization org = organizationService.findById(orgId).orElseThrow(() -> new OrganizationNotFoundException("Organization with ID is not found"));
        return clientService.findByOrganization(org).stream().map(DisplayClientDto::from).toList();
    }

    @Override
    public void delete(Long id) {
        clientService.delete(id);
    }
}
