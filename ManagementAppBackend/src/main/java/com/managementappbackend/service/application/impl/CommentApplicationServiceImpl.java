package com.managementappbackend.service.application.impl;

import com.managementappbackend.dto.CreateCommentDto;
import com.managementappbackend.dto.DisplayCommentDto;
import com.managementappbackend.model.domain.Comment;
import com.managementappbackend.model.domain.Task;
import com.managementappbackend.model.domain.User;
import com.managementappbackend.model.enumerations.Role;
import com.managementappbackend.model.exceptions.CommentNotFoundExceiption;
import com.managementappbackend.model.exceptions.NotYourCommentException;
import com.managementappbackend.model.exceptions.TaskNotFoundException;
import com.managementappbackend.service.application.CommentApplicationService;
import com.managementappbackend.service.domain.CommentService;
import com.managementappbackend.service.domain.TaskService;
import com.managementappbackend.service.domain.UserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentApplicationServiceImpl implements CommentApplicationService {

    private final CommentService commentService;
    private final UserService userService;
    private final TaskService taskService;

    public CommentApplicationServiceImpl(CommentService commentService, UserService userService, TaskService taskService) {
        this.commentService = commentService;
        this.userService = userService;
        this.taskService = taskService;
    }

    @Override
    public List<DisplayCommentDto> findAll() {
        return commentService.findAll().stream().map(DisplayCommentDto::from).toList();
    }

    @Override
    public Optional<DisplayCommentDto> findById(Long id) {
        return commentService.findById(id).map(DisplayCommentDto::from);
    }

    @Override
    public Optional<DisplayCommentDto> save(CreateCommentDto createCommentDto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByUsername(username);

        Task task = taskService.findById(createCommentDto.taskId()).
                orElseThrow(() -> new TaskNotFoundException("Task with " + createCommentDto.taskId() + " not found"));


        return commentService.save(createCommentDto.toComment(user, task)).map(DisplayCommentDto::from);
    }

    @Override
    public Optional<DisplayCommentDto> update(Long id, CreateCommentDto createCommentDto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByUsername(username);

        Task task = taskService.findById(createCommentDto.taskId()).
                orElseThrow(() -> new TaskNotFoundException("Task with " + createCommentDto.taskId() + " not found"));

        Comment comment = commentService.findById(id).orElseThrow(() -> new CommentNotFoundExceiption("Comment with " + id + " not found"));

        if(!comment.getUser().getUsername().equals(username)) {
            throw new NotYourCommentException("This is not your comment, you cannot edit it");
        }



        return commentService.update(id ,createCommentDto.toComment(user, task)).map(DisplayCommentDto::from);
    }

    @Override
    public List<DisplayCommentDto> findByUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByUsername(username);
        return commentService.findByUser(user).stream().map(DisplayCommentDto::from).toList();
    }

    @Override
    public List<DisplayCommentDto> findByTask(Long taskId) {
        Task task = taskService.findById(taskId).
                orElseThrow(() -> new TaskNotFoundException("Task with " + taskId + " not found"));
        return commentService.findByTask(task).stream().map(DisplayCommentDto::from).toList();
    }

    @Override
    public void deleteById(Long commentId) {
        Comment comment = commentService.findById(commentId).orElseThrow(() -> new CommentNotFoundExceiption("Comment with ID " +  commentId + " has not been found"));
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByUsername(username);

        boolean isOwner = comment.getUser().getUsername().equals(username);
        boolean isManager = user.getRole().equals(Role.MANAGER);
        boolean isAdmin = user.getRole().equals(Role.ADMIN);

        if(isOwner || isManager || isAdmin) {
            commentService.delete(comment);
        }
        else {
            throw new NotYourCommentException("This is not your comment, you cannot delete it");
        }

    }
}
