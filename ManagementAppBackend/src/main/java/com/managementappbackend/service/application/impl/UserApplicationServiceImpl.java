package com.managementappbackend.service.application.impl;

import com.managementappbackend.dto.CreateUserDto;
import com.managementappbackend.dto.DisplayUserDto;
import com.managementappbackend.dto.LoginResponseDto;
import com.managementappbackend.dto.LoginUserDto;
import com.managementappbackend.helpers.JwtHelper;
import com.managementappbackend.model.domain.User;
import com.managementappbackend.model.enumerations.Role;
import com.managementappbackend.service.application.UserApplicationService;
import com.managementappbackend.service.domain.UserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserApplicationServiceImpl implements UserApplicationService {

    private final UserService userService;
    private final JwtHelper jwtHelper;

    public UserApplicationServiceImpl(UserService userService, JwtHelper jwtHelper) {
        this.userService = userService;
        this.jwtHelper = jwtHelper;
    }

    @Override
    public List<DisplayUserDto> findAll() {
        return userService.findAll().stream().map(DisplayUserDto::from).toList();
    }

    @Override
    public Optional<DisplayUserDto> register(CreateUserDto createUserDto) {
        User user = userService.register(
                createUserDto.username(),
                createUserDto.password(),
                createUserDto.repeatPassword(),
                createUserDto.name(),
                createUserDto.surname(),
                createUserDto.role()
        );
        return Optional.of(DisplayUserDto.from(user));
    }

    @Override
    public Optional<LoginResponseDto> login(LoginUserDto loginUserDto) {
        User user = userService.login(
                loginUserDto.username(),
                loginUserDto.password()
        );

        String token = jwtHelper.generateToken(user);
        DisplayUserDto displayUserDto = DisplayUserDto.from(user);

        return Optional.of(new LoginResponseDto(token, displayUserDto));
    }

    @Override
    public Optional<DisplayUserDto> findByUsername(String username) {
        return Optional.of(DisplayUserDto.from(userService.findByUsername(username)));
    }

    @Override
    public List<DisplayUserDto> findByRole(Role role) {
        return userService.findByRole(role).stream().map(DisplayUserDto::from).toList();
    }

    @Override
    public List<DisplayUserDto> findByOrganizationId(Long organizationId) {
        return userService.findByOrganizationId(organizationId)
                .stream()
                .map(DisplayUserDto::from)
                .toList();
    }


}
