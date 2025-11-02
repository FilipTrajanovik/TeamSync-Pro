package com.managementappbackend.dto;

import com.managementappbackend.model.domain.Comment;
import com.managementappbackend.model.domain.Task;
import com.managementappbackend.model.domain.User;

import java.time.LocalDateTime;
import java.util.List;

public record DisplayCommentDto(Long id,String text, String username, Long taskId, LocalDateTime createdAt, LocalDateTime updatedAt, boolean isEdited) {

    public static DisplayCommentDto from(Comment comment) {
        return new DisplayCommentDto(
                comment.getId(),
                comment.getText(),
                comment.getUser().getUsername(),
                comment.getTask().getId(),
                comment.getCreatedAt(),
                comment.getUpdatedAt(),
                comment.isEdited()
        );
    }

    public static List<DisplayCommentDto> from(List<Comment> comments) {
        return comments.stream().map(DisplayCommentDto::from).toList();
    }

    public Comment toComment(User user, Task task) {
        return new Comment(
                text, user, task, createdAt, updatedAt, isEdited
        );
    }
}
