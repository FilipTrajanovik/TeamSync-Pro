package com.managementappbackend.service.domain;

import com.managementappbackend.model.domain.User;
import com.managementappbackend.model.enumerations.Role;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;
import java.util.Optional;

public interface UserService extends UserDetailsService {
    User register(String username, String password, String repeatPassword, String name, String surname, Role role, Long orgId);

    User login(String username, String password);

    User findByUsername(String username);

    List<User> findAll();
    List<User> findByRole(Role role);
    List<User> findByOrganizationId(Long organizationId);
    List<User> findByOrganizationIdAndRole(Long organizationId, Role role);
    Optional<User> updateUser(String username, User user);
    Optional<User> changePassword(String username, String oldPassword, String newPassword, String confirmPassword);
}
