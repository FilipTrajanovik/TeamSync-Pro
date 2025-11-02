package com.managementappbackend.web.controllers;

import com.managementappbackend.dto.CreateClientDto;
import com.managementappbackend.dto.CreateCommentDto;
import com.managementappbackend.dto.DisplayCommentDto;
import com.managementappbackend.service.application.CommentApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentApplicationService commentApplicationService;

    public CommentController(CommentApplicationService commentApplicationService) {
        this.commentApplicationService = commentApplicationService;
    }

    @Operation(summary = "Get all comments", description = "Retrieves a list of all available comments.")
    @GetMapping
    public List<DisplayCommentDto> findAll() {
        return commentApplicationService.findAll();
    }

    @Operation(summary = "Get a comment by its ID", description = "Finds a comment by its ID.")
    @GetMapping("/{id}")
    public ResponseEntity<DisplayCommentDto> findById(@PathVariable Long id) {
        return commentApplicationService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Add a new comment", description = "Creates a new comment.")
    @PostMapping("/add")
    public ResponseEntity<DisplayCommentDto> save(@RequestBody CreateCommentDto commentDto) {
        return commentApplicationService.save(commentDto).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Update an existing comment", description = "Updates a comment by its ID.")
    @PutMapping("/edit/{id}")
    public ResponseEntity<DisplayCommentDto> update(@PathVariable Long id, @RequestBody CreateCommentDto commentDto) {
        return commentApplicationService.update(id, commentDto).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }


    @Operation(summary = "Delete a client", description = "Deletes a client by its ID.")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
         commentApplicationService.deleteById(id);
         return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get task's comments", description = "Retrieves all comments of the task")
    @GetMapping("/tasks/{taskId}")
    public List<DisplayCommentDto> findByTaskId(@PathVariable Long taskId) {
        return commentApplicationService.findByTask(taskId);
    }

    @Operation(summary = "Get user's comments", description = "Retrieves all comments made by the user")
    @GetMapping("/user")
    public List<DisplayCommentDto> findByUser() {
        return commentApplicationService.findByUser();
    }

}
