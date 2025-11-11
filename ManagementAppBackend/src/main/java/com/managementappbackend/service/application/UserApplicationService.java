package com.managementappbackend.service.application;

import com.managementappbackend.dto.*;
import com.managementappbackend.model.domain.User;
import com.managementappbackend.model.enumerations.Role;

import java.util.List;
import java.util.Optional;

public interface UserApplicationService {

    List<DisplayUserDto> findAll();

    Optional<DisplayUserDto> register(CreateRegistrationOrganizationDto dto);

    Optional<LoginResponseDto> login(LoginUserDto loginUserDto);
    Optional<DisplayUserDto>  findByUsername(String username);
    List<DisplayUserDto> findByRole(Role role);
    List<DisplayUserDto> findByOrganizationId(Long organizationId);
    List<DisplayUserDto> findByOrganizationIdAndRole(Long organizationId);
    Optional<DisplayUserDto> createUser(CreateUserDto createUserDto);
    Optional<DisplayUserDto> updateUser(CreateUserDto createUserDto);
    Optional<DisplayUserDto> changePassword(ChangePasswordDto changePasswordDto);
}
