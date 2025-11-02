package com.managementappbackend.service.domain.impl;

import com.managementappbackend.model.domain.Comment;
import com.managementappbackend.model.domain.Task;
import com.managementappbackend.model.domain.User;
import com.managementappbackend.repository.CommentRepository;
import com.managementappbackend.service.domain.CommentService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;

    public CommentServiceImpl(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @Override
    public List<Comment> findAll() {
        return commentRepository.findAll();
    }

    @Override
    public Optional<Comment> findById(Long id) {
        return commentRepository.findById(id);
    }

    @Override
    public Optional<Comment> save(Comment comment) {
        return Optional.of(commentRepository.save(comment));
    }

    @Override
    public Optional<Comment> update(Long id, Comment comment) {
        return commentRepository.findById(id)
                .map((existingComment) -> {
                    existingComment.setText(comment.getText());
                    existingComment.setUpdatedAt(LocalDateTime.now());
                    existingComment.setEdited(true);
                    return commentRepository.save(existingComment);
                });
    }

    @Override
    public void delete(Comment comment) {
        commentRepository.delete(comment);
    }

    @Override
    public List<Comment> findByUser(User user) {
        return commentRepository.findByUser(user);
    }

    @Override
    public List<Comment> findByTask(Task task) {
        return commentRepository.findByTask(task);
    }
}
