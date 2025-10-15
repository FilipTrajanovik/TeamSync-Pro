package com.managementappbackend.dto;

import com.managementappbackend.model.domain.User;
import com.managementappbackend.model.enumerations.Role;

import java.util.List;

public record CreateUserDto(String username, String password, String repeatPassword, String name, String surname, Role role, Long organizationId) {


    public static CreateUserDto from(User user) {

        Long orgId = user.getOrganizations() != null && !user.getOrganizations().isEmpty()
                ? user.getOrganizations().get(0).getId()
                : null;

        return new CreateUserDto(user.getUsername(), user.getPassword(), user.getPassword(), user.getName(), user.getSurname(), user.getRole(), orgId);
    }

    public static List<CreateUserDto> from(List<User> users)
    {
        return users.stream().map(CreateUserDto::from).toList();
    }

    public User toUser()
    {
        return new User(username, name, surname, role.name());
    }
}
