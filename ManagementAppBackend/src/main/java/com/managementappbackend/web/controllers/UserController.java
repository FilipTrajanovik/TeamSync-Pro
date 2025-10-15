package com.managementappbackend.web.controllers;

import com.managementappbackend.dto.CreateUserDto;
import com.managementappbackend.dto.DisplayUserDto;
import com.managementappbackend.dto.LoginResponseDto;
import com.managementappbackend.dto.LoginUserDto;
import com.managementappbackend.model.enumerations.Role;
import com.managementappbackend.model.exceptions.InvalidArgumentsException;
import com.managementappbackend.model.exceptions.InvalidUserCredentialsException;
import com.managementappbackend.model.exceptions.PasswordsDoNotMatchException;
import com.managementappbackend.service.application.UserApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserApplicationService userApplicationService;

    public UserController(UserApplicationService userApplicationService) {
        this.userApplicationService = userApplicationService;
    }

    @Operation(summary = "Register a new user", description = "Creates a new user account")
    @ApiResponses(
            value = {@ApiResponse(
                    responseCode = "200",
                    description = "User registered successfully"
            ), @ApiResponse(
                    responseCode = "400", description = "Invalid input or passwords do not match"
            )}
    )
    @PostMapping("/register")
    public ResponseEntity<DisplayUserDto> register(@RequestBody CreateUserDto createUserDto) {
        try {
            return userApplicationService.register(createUserDto)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (InvalidArgumentsException | PasswordsDoNotMatchException exception) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "User login", description = "Authenticates a user and generates a JWT")
    @ApiResponses(
            value = {@ApiResponse(
                    responseCode = "200",
                    description = "User authenticated successfully"
            ), @ApiResponse(responseCode = "404", description = "Invalid username or password")}
    )

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginUserDto loginUserDto) {
        try {
            return userApplicationService.login(loginUserDto)
                    .map(ResponseEntity::ok)
                    .orElseThrow(() -> new InvalidUserCredentialsException("Wrong credentials"));
        } catch (InvalidUserCredentialsException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Get all managers", description = "Returns all users with MANAGER role")
    @GetMapping("/managers")
    public List<DisplayUserDto> getAllManagers()
    {
        return userApplicationService.findByRole(Role.MANAGER).stream().toList();
    }

    @Operation(summary = "Get all users", description = "Returns all users")
    @GetMapping
    public List<DisplayUserDto> findAll(){
        return userApplicationService.findAll().stream().toList();
    }

    @Operation(summary = "Get users by organization",
            description = "Retrieves all users in a specific organization")
    @GetMapping("/organization/{organizationId}")
    public List<DisplayUserDto> findByOrganization(@PathVariable Long organizationId) {
        return userApplicationService.findByOrganizationId(organizationId);
    }

    @Operation(
            summary = "Get users by organization",
            description = "Retrieves all users with USER role belonging to a specific organization"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Organization not found")
    })
    @GetMapping("/organization/users")
    public List<DisplayUserDto> findUsersByOrganization(@RequestParam Long organizationId) {
        return userApplicationService.findByOrganizationIdAndRole(organizationId);
    }

    @Operation(summary = "Create a user (Manager/Admin only)",
            description = "Creates a new user and assigns to an organization")
    @ApiResponses(
            value = {@ApiResponse(
                    responseCode = "200",
                    description = "User created successfully"
            ), @ApiResponse(
                    responseCode = "400", description = "Invalid input or passwords do not match"
            )}
    )
    @PostMapping("/create")
    public ResponseEntity<DisplayUserDto> create(@RequestBody CreateUserDto createUserDto) {
        return userApplicationService.createUser(createUserDto).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }


}
