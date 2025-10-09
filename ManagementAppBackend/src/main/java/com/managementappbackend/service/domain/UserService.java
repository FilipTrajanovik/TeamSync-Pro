package com.managementappbackend.service.domain;

import com.managementappbackend.model.domain.User;
import com.managementappbackend.model.enumerations.Role;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {
    User register(String username, String password, String repeatPassword, String name, String surname, Role role);

    User login(String username, String password);

    User findByUsername(String username);

    List<User> findAll();
    List<User> findByRole(Role role);
    List<User> findByOrganizationId(Long organizationId);
}
