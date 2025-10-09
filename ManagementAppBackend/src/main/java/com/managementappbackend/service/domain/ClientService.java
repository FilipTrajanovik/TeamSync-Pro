package com.managementappbackend.service.domain;

import com.managementappbackend.model.domain.Client;
import com.managementappbackend.model.domain.Organization;

import java.util.List;
import java.util.Optional;

public interface ClientService {

    List<Client> findAll();
    Optional<Client> findById(Long id);
    Optional<Client>  findByName(String name);
    Optional<Client>  findByEmail(String email);

    Optional<Client> save(Client client);
    Optional<Client> update(Long id, Client Client);
    void delete(Long id);

    List<Client> findByOrganization(Organization org);
}
