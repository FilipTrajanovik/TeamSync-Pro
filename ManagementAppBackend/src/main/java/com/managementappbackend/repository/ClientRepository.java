package com.managementappbackend.repository;

import com.managementappbackend.model.domain.Client;
import com.managementappbackend.model.domain.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByFirstName(String name);
    Optional<Client> findByLastName(String name);
    Optional<Client> findByEmail(String email);
    List<Client> findByOrganization(Organization organization);
}
