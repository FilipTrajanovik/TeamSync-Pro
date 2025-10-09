package com.managementappbackend.web.controllers;

import com.managementappbackend.dto.CreateRecordDto;
import com.managementappbackend.dto.DisplayRecordDto;
import com.managementappbackend.service.application.RecordApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/records")
public class RecordController {

    private final RecordApplicationService recordApplicationService;

    public RecordController(RecordApplicationService recordApplicationService) {
        this.recordApplicationService = recordApplicationService;
    }

    @Operation(summary = "Get all records", description = "Retrieves a list of all available records.")
    @GetMapping
    public List<DisplayRecordDto> getAllRecords() {
        return recordApplicationService.findAll();
    }

    @Operation(summary = "Get a record by its ID", description = "Finds a record by its ID.")
    @GetMapping("/{id}")
    public ResponseEntity<DisplayRecordDto> getRecordById(@PathVariable Long id) {
        return recordApplicationService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Add a new record", description = "Creates a new record.")
    @PostMapping("/add")
    public ResponseEntity<DisplayRecordDto> save(@RequestBody CreateRecordDto createRecordDto) {
        return recordApplicationService.save(createRecordDto).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Update an existing organization", description = "Updates an organization by its ID.")
    @PutMapping("/edit/{id}")
    public ResponseEntity<DisplayRecordDto> update(@PathVariable Long id, @RequestBody CreateRecordDto createRecordDto) {
        return recordApplicationService.update(id, createRecordDto).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Delete a record", description = "Deletes a record by its ID.")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<DisplayRecordDto> delete(@PathVariable Long id) {
        if(recordApplicationService.findById(id).isPresent()) {
            recordApplicationService.delete(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Get all records by Client", description = "Finds all records by specific Client.")
    @GetMapping("/client/{clientId}")
    public List<DisplayRecordDto> getAllRecordsByClient(@PathVariable Long clientId) {
        return recordApplicationService.findByClientId(clientId);
    }


}
