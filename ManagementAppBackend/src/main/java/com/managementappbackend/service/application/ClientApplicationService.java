package com.managementappbackend.service.application;

import com.managementappbackend.dto.CreateClientDto;
import com.managementappbackend.dto.DisplayClientDto;
import com.managementappbackend.model.domain.Client;

import java.util.List;
import java.util.Optional;

public interface ClientApplicationService {

    List<DisplayClientDto> findAll();
    Optional<DisplayClientDto> findById(Long id);
    Optional<DisplayClientDto>  findByName(String name);
    Optional<DisplayClientDto>  findByEmail(String email);

    Optional<DisplayClientDto> save(CreateClientDto client);
    Optional<DisplayClientDto> update(Long id, CreateClientDto client);
    List<DisplayClientDto> findByOrganizationId(Long orgId);
    void delete(Long id);

}
