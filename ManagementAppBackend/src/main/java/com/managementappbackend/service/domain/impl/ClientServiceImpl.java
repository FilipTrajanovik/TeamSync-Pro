package com.managementappbackend.service.domain.impl;

import com.managementappbackend.model.domain.Client;
import com.managementappbackend.model.domain.Organization;
import com.managementappbackend.repository.ClientRepository;
import com.managementappbackend.service.domain.ClientService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;

    public ClientServiceImpl(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @Override
    public List<Client> findAll() {
        return clientRepository.findAll();
    }

    @Override
    public Optional<Client> findById(Long id) {
        return clientRepository.findById(id);
    }

    @Override
    public Optional<Client> findByName(String name) {
        return clientRepository.findByFirstName(name);
    }

    @Override
    public Optional<Client> findByEmail(String email) {
        return clientRepository.findByEmail(email);
    }

    @Override
    public Optional<Client> save(Client client) {
        return Optional.of(clientRepository.save(client));
    }

    @Override
    public Optional<Client> update(Long id, Client Client) {
        return clientRepository.findById(id).map(
                existingClient -> {
                    existingClient.setFirstName(Client.getFirstName());
                    existingClient.setLastName(Client.getLastName());
                    existingClient.setEmail(Client.getEmail());
                    existingClient.setPhone(Client.getPhone());
                    existingClient.setAddress(Client.getAddress());
                    existingClient.setBirthday(Client.getBirthday());
                    existingClient.setNotes(Client.getNotes());
                    existingClient.setOrganization(Client.getOrganization());
                    existingClient.setUpdatedAt(LocalDateTime.now());
                    return clientRepository.save(existingClient);
                }
        );
    }

    @Override
    public void delete(Long id) {
        clientRepository.deleteById(id);
    }

    @Override
    public List<Client> findByOrganization(Organization org) {
        return clientRepository.findByOrganization(org);
    }
}
