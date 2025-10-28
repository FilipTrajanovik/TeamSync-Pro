package com.managementappbackend.repository;

import com.managementappbackend.model.domain.Client;
import com.managementappbackend.model.domain.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByFirstName(String name);
    Optional<Client> findByLastName(String name);
    Optional<Client> findByEmail(String email);
    List<Client> findByOrganization(Organization organization);

    @Query("SELECT c.Id, c.firstName, c.lastName, " +
            "SIZE(c.tasks), " +
            "SUM(CASE WHEN t.status = 'COMPLETED' THEN 1 ELSE 0 END) " +
            "FROM Client c " +
            "LEFT JOIN c.tasks t " +
            "WHERE c.organization = :organization " +
            "GROUP BY c.Id, c.firstName, c.lastName " +
            "ORDER BY SIZE(c.tasks) DESC")
    List<Object[]> findClientTaskDistribution(@Param("organization") Organization organization);

}
