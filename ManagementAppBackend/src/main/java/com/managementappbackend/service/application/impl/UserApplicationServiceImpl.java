package com.managementappbackend.service.application.impl;

import com.managementappbackend.dto.*;
import com.managementappbackend.helpers.JwtHelper;
import com.managementappbackend.model.domain.Organization;
import com.managementappbackend.model.domain.SubscriptionPlan;
import com.managementappbackend.model.domain.Task;
import com.managementappbackend.model.domain.User;
import com.managementappbackend.model.enumerations.Role;
import com.managementappbackend.model.exceptions.InvalidArgumentsException;
import com.managementappbackend.model.exceptions.PasswordsDoNotMatchException;
import com.managementappbackend.model.exceptions.SubscriptionPlanNotFound;
import com.managementappbackend.service.application.UserApplicationService;
import com.managementappbackend.service.domain.OrganizationService;
import com.managementappbackend.service.domain.SubscriptionPlanService;
import com.managementappbackend.service.domain.UserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserApplicationServiceImpl implements UserApplicationService {

    private final UserService userService;
    private final JwtHelper jwtHelper;
    private final OrganizationService organizationService;
    private final SubscriptionPlanService subscriptionPlanService;

    public UserApplicationServiceImpl(UserService userService, JwtHelper jwtHelper, OrganizationService organizationService, SubscriptionPlanService subscriptionPlanService) {
        this.userService = userService;
        this.jwtHelper = jwtHelper;
        this.organizationService = organizationService;
        this.subscriptionPlanService = subscriptionPlanService;
    }

    @Override
    public List<DisplayUserDto> findAll() {
        return userService.findAll().stream().map(DisplayUserDto::from).toList();
    }

    @Override
    public Optional<DisplayUserDto> register(CreateRegistrationOrganizationDto dto) {

        if (dto.organizationName() == null || dto.organizationName().trim().isEmpty()) {
            System.out.println("❌ Organization name is empty");
            throw new RuntimeException("Organization name is required");
        }

        if (!dto.password().equals(dto.repeatPassword())) {
            throw new PasswordsDoNotMatchException("Passwords do not match");
        }


        User existingUser = null;
        try {
            existingUser = userService.findByUsername(dto.username());
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }

        if (existingUser != null) {
            throw new InvalidArgumentsException("Username already exists");
        }

        Organization organization = new Organization();
        organization.setName(dto.organizationName());
        organization.setDescription(dto.description());
        organization.setContactEmail(dto.email());
        organization.setContactPhone(dto.contactPhone());
        organization.setAddress(dto.address());
        organization.setActive(true);
        organization.setCreatedAt(LocalDateTime.now());
        organization.setUpdatedAt(LocalDateTime.now());

        SubscriptionPlan freePlan = null;
        try {
            freePlan = subscriptionPlanService.findByName("FREE")
                    .orElseThrow(() -> new SubscriptionPlanNotFound("Free plan not found"));
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }

        organization.setSubscriptionPlan(freePlan);

        Optional<Organization> org = null;
        try {
            org = organizationService.save(organization);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }

        CreateUserDto userDto = dto.toCreateUserDto(organization.getId());

        User manager = null;
        try {
            manager = userService.register(
                    userDto.username(),
                    userDto.password(),
                    userDto.repeatPassword(),
                    userDto.name(),
                    userDto.surname(),
                    Role.MANAGER,
                    organization.getId()
            );
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }

        return Optional.of(DisplayUserDto.from(manager));
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

    @Override
    public List<DisplayUserDto> findByOrganizationIdAndRole(Long organizationId) {
        return userService.findByOrganizationIdAndRole(organizationId, Role.USER).stream().map(DisplayUserDto::from).toList();
    }

    @Override
    public Optional<DisplayUserDto> createUser(CreateUserDto createUserDto) {
        User user = userService.register(
                createUserDto.username(),
                createUserDto.password(),
                createUserDto.repeatPassword(),
                createUserDto.name(),
                createUserDto.surname(),
                createUserDto.role(),
                createUserDto.organizationId()
        );
        return Optional.of(DisplayUserDto.from(user));
    }

    @Override
    public Optional<DisplayUserDto> updateUser(CreateUserDto createUserDto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.updateUser(username, createUserDto.toUser()).map(DisplayUserDto::from);
    }

    @Override
    public Optional<DisplayUserDto> changePassword(ChangePasswordDto changePasswordDto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.changePassword(username, changePasswordDto.currentPassword(), changePasswordDto.newPassword(), changePasswordDto.confirmPassword()).map(DisplayUserDto::from);
    }


}
