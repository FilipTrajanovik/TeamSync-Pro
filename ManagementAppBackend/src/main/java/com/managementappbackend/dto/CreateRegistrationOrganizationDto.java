package com.managementappbackend.dto;

import com.managementappbackend.model.enumerations.Role;

public record CreateRegistrationOrganizationDto(

        String organizationName,
        String description,
        String address,
        String contactPhone,


        String username,
        String password,
        String repeatPassword,
        String name,
        String surname,
        String email


) {

    public CreateUserDto toCreateUserDto(Long organizationId) {
        return new CreateUserDto(
                this.username,
                this.password,
                this.repeatPassword,
                this.name,
                this.surname,
                Role.MANAGER,
                organizationId
        );
    }
}