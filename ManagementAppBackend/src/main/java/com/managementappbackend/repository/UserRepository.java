package com.managementappbackend.repository;

import com.managementappbackend.model.enumerations.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import com.managementappbackend.model.domain.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsernameAndPassword(String username, String password);

    Optional<User> findByUsername(String username);

    List<User> findByRole(Role role);
    @Query("SELECT u FROM User u JOIN u.organizations o WHERE o.id = :organizationId")
    List<User> findByOrganizationId(@Param("organizationId") Long organizationId);

    @Query("SELECT u FROM User u JOIN u.organizations o WHERE o.id = :organizationId AND u.role = :role")
    List<User> findByOrganizationIdAndRole(@Param("organizationId") Long organizationId, @Param("role") Role role);

}
