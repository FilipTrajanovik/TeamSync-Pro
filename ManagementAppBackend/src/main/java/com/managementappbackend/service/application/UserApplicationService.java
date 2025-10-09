package com.managementappbackend.service.application;

import com.managementappbackend.dto.CreateUserDto;
import com.managementappbackend.dto.DisplayUserDto;
import com.managementappbackend.dto.LoginResponseDto;
import com.managementappbackend.dto.LoginUserDto;
import com.managementappbackend.model.domain.User;
import com.managementappbackend.model.enumerations.Role;

import java.util.List;
import java.util.Optional;

public interface UserApplicationService {

    List<DisplayUserDto> findAll();

    Optional<DisplayUserDto> register(CreateUserDto createUserDto);

    Optional<LoginResponseDto> login(LoginUserDto loginUserDto);
    Optional<DisplayUserDto>  findByUsername(String username);
    List<DisplayUserDto> findByRole(Role role);
    List<DisplayUserDto> findByOrganizationId(Long organizationId);
}
