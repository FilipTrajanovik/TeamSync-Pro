package com.managementappbackend.service.domain;

import com.managementappbackend.model.domain.Comment;
import com.managementappbackend.model.domain.Task;
import com.managementappbackend.model.domain.User;

import java.util.List;
import java.util.Optional;

public interface CommentService {

    List<Comment> findAll();
    Optional<Comment> findById(Long id);
    Optional<Comment> save(Comment comment);
    Optional<Comment> update(Long id, Comment comment);
    void delete(Comment comment);

    List<Comment> findByUser(User user);
    List<Comment> findByTask(Task task);

}
