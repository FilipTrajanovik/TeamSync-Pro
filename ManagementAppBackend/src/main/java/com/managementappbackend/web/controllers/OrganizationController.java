package com.managementappbackend.web.controllers;

import com.managementappbackend.dto.CreateOrganizationDto;
import com.managementappbackend.dto.DisplayOrganizationDto;
import com.managementappbackend.model.domain.Organization;
import com.managementappbackend.service.application.OrganizationApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import java.util.List;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

    private final OrganizationApplicationService organizationApplicationService;

    public OrganizationController(OrganizationApplicationService organizationApplicationService) {
        this.organizationApplicationService = organizationApplicationService;
    }

    @Operation(summary = "Get all organizations", description = "Retrieves a list of all available organizations.")
    @GetMapping
    public List<DisplayOrganizationDto> findAll(){
        return organizationApplicationService.findAll();
    }

    @Operation(summary = "Get an organization by its ID", description = "Finds a organization by its ID.")
    @GetMapping("/{id}")
    public ResponseEntity<DisplayOrganizationDto> findById(@PathVariable Long id){
        return organizationApplicationService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }


    @Operation(summary = "Add a new organization", description = "Creates a new organization.")
    @PostMapping("/add")
    public ResponseEntity<DisplayOrganizationDto> save(@RequestBody CreateOrganizationDto createOrganizationDto){
        return organizationApplicationService.save(createOrganizationDto).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Update an existing organization", description = "Updates an organization by its ID.")
    @PutMapping("/edit/{id}")
    public ResponseEntity<DisplayOrganizationDto> update(@PathVariable Long id, @RequestBody CreateOrganizationDto createOrganizationDto){
        return organizationApplicationService.update(id, createOrganizationDto).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Delete an organization", description = "Deletes an organization by its ID.")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        if(organizationApplicationService.findById(id).isPresent()){
            organizationApplicationService.delete(id);
            return ResponseEntity.noContent().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }
    @Operation(
    summary = "Get my organizations",
    description = "Retrieves all organizations that the authenticated user belongs to"
            )
    @ApiResponse(responseCode = "200", description = "Organizations retrieved successfully")
    @GetMapping("/my-organizations")
    public List<DisplayOrganizationDto> getMyOrganizations(Authentication authentication) {
        String username = authentication.getName();
        return organizationApplicationService.findByUserUsername(username);
    }




}
