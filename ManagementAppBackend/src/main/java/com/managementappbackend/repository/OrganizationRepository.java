package com.managementappbackend.repository;

import com.managementappbackend.model.domain.Organization;
import com.managementappbackend.model.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findByName(String name);
    @Query("SELECT o FROM Organization o JOIN o.users u WHERE u.username = :username")
    List<Organization> findByUsersUsername(@PathVariable String username);
}
