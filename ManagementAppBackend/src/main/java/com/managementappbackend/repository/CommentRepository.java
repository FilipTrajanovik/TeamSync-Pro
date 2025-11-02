package com.managementappbackend.repository;

import com.managementappbackend.model.domain.Comment;
import com.managementappbackend.model.domain.Task;
import com.managementappbackend.model.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByUser(User user);
    List<Comment> findByTask(Task task);
}
