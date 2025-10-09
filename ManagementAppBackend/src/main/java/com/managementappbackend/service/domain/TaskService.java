package com.managementappbackend.service.domain;

import com.managementappbackend.model.domain.Task;
import com.managementappbackend.model.domain.User;

import java.util.List;
import java.util.Optional;

public interface TaskService {
    List<Task> findAll();
    Optional<Task> findById(Long id);
    Optional<Task> save(Task task);
    Optional<Task> update(Long id,Task task);
    Optional<Task> findByTitle(String title);
    List<Task> findByClientId(Long clientId);
    List<Task> findByAssignedTo(User user);
    void delete(Long id);
}
