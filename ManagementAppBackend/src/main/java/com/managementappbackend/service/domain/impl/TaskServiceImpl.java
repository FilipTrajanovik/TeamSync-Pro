package com.managementappbackend.service.domain.impl;

import com.managementappbackend.model.domain.Task;
import com.managementappbackend.model.domain.User;
import com.managementappbackend.repository.TaskRepository;
import com.managementappbackend.service.domain.TaskService;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public List<Task> findAll() {
        return taskRepository.findAll();
    }

    @Override
    public Optional<Task> findById(Long id) {
        return taskRepository.findById(id);
    }

    @Override
    public Optional<Task> save(Task task) {
        return Optional.of(taskRepository.save(task));
    }

    @Override
    public Optional<Task> update(Long id, Task task) {
        return taskRepository.findById(id).map(existingTask -> {
            existingTask.setClient(task.getClient());
            existingTask.setDescription(task.getDescription());
            existingTask.setTitle(task.getTitle());
            existingTask.setPriority(task.getPriority());
            existingTask.setDueDate(task.getDueDate());
            existingTask.setStatus(task.getStatus());
            existingTask.setCompletedDate(task.getCompletedDate());
            existingTask.setAssignedToUserId(task.getAssignedToUserId());
            existingTask.setCreatedByUserId(task.getCreatedByUserId());
            return taskRepository.save(existingTask);
        });
    }

    @Override
    public Optional<Task> findByTitle(String title) {
        return taskRepository.findByTitle(title);
    }

    @Override
    public List<Task> findByClientId(Long clientId) {
        return taskRepository.findByClientId(clientId);
    }

    @Override
    public List<Task> findByAssignedTo(User user) {
        return taskRepository.findByAssignedToUserId(user);
    }

    @Override
    public void delete(Long id) {
        taskRepository.deleteById(id);
    }
}
