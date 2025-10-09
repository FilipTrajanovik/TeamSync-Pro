package com.managementappbackend.web.controllers;

import com.managementappbackend.dto.CreateTaskDto;
import com.managementappbackend.dto.DisplayTaskDto;
import com.managementappbackend.service.application.TaskApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskApplicationService taskApplicationService;

    public TaskController(TaskApplicationService taskApplicationService) {
        this.taskApplicationService = taskApplicationService;
    }

    @Operation(summary = "Get all tasks", description = "Retrieves a list of all available tasks.")
    @GetMapping
    public List<DisplayTaskDto> findAll()
    {
        return taskApplicationService.findAll();
    }

    @Operation(summary = "Get a task by its ID", description = "Finds a task by its ID.")
    @GetMapping("/{id}")
    public ResponseEntity<DisplayTaskDto> findById(@PathVariable Long id){
        return taskApplicationService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Add a new task", description = "Creates a new task.")
    @PostMapping("/add")
    public ResponseEntity<DisplayTaskDto> save(@RequestBody CreateTaskDto createTaskDto){
        return taskApplicationService.save(createTaskDto).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Update a existing task", description = "Updates an task by its ID.")
    @PutMapping("/edit/{id}")
    public ResponseEntity<DisplayTaskDto> update(@PathVariable Long id, @RequestBody CreateTaskDto createTaskDto){
        return taskApplicationService.update(id,createTaskDto).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Delete a task", description = "Deletes a task by its ID.")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        if(taskApplicationService.findById(id).isPresent()){
            taskApplicationService.delete(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Finds all tasks by a client", description = "For every client it gets its tasks")
    @GetMapping("/client/{clientId}")
    public List<DisplayTaskDto> findByClientId(@PathVariable Long clientId){
        return taskApplicationService.findByClientId(clientId).stream().toList();
    }

    @Operation(summary = "Finds all tasks by assigned one", description = "For every assignedUser it gets its tasks")
    @GetMapping("/assigned/{username}")
    public List<DisplayTaskDto> findByUsername(@PathVariable String username){
        return taskApplicationService.findByAssignedTo(username).stream().toList();
    }

    @Operation(summary = "Finds all tasks by their title", description = "For every task it gets it by the title")
    @GetMapping("/find-by-title")
    public ResponseEntity<DisplayTaskDto> findByTitle(@RequestParam String title){
        return taskApplicationService.findByTitle(title).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

}
