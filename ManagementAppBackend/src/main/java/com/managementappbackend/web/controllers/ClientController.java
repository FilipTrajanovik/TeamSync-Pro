package com.managementappbackend.web.controllers;

import com.managementappbackend.dto.CreateClientDto;
import com.managementappbackend.dto.DisplayClientDto;
import com.managementappbackend.service.application.ClientApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientApplicationService clientApplicationService;

    public ClientController(ClientApplicationService clientApplicationService) {
        this.clientApplicationService = clientApplicationService;
    }

    @Operation(summary = "Get all clients", description = "Retrieves a list of all available clients.")
    @GetMapping
    public List<DisplayClientDto> findAll() {
        return clientApplicationService.findAll();
    }

    @Operation(summary = "Get a client by its ID", description = "Finds a client by its ID.")
    @GetMapping("/{id}")
    public ResponseEntity<DisplayClientDto> findById(@PathVariable Long id) {
        return clientApplicationService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Add a new client", description = "Creates a new client.")
    @PostMapping("/add")
    public ResponseEntity<DisplayClientDto> save(@RequestBody CreateClientDto createClientDto) {
        return clientApplicationService.save(createClientDto).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Update an existing client", description = "Updates a client by its ID.")
    @PutMapping("/edit/{id}")
    public ResponseEntity<DisplayClientDto> update(@PathVariable Long id, @RequestBody CreateClientDto createClientDto) {
        return clientApplicationService.update(id,createClientDto).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Delete a client", description = "Deletes a client by its ID.")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if(clientApplicationService.findById(id).isPresent()) {
            clientApplicationService.delete(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Find a client by email", description = "Get a client by the email")
    @GetMapping("/find-by-email")
    public ResponseEntity<DisplayClientDto> findByEmail(@RequestParam String email) {
        return clientApplicationService.findByEmail(email).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Find a client by first name", description = "Get a client by the first name")
    @GetMapping("/find-by-first-name")
    public ResponseEntity<DisplayClientDto> findByFirstName(@RequestParam String firstName) {
        return clientApplicationService.findByName(firstName).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }


    @Operation(summary = "Find all clients by organization", description = "Retrieves a list from all clients in one organization")
    @GetMapping("/organization/{orgId}")
    public List<DisplayClientDto> findByOrganization(@PathVariable Long orgId) {
      return clientApplicationService.findByOrganizationId(orgId);
    }

}
