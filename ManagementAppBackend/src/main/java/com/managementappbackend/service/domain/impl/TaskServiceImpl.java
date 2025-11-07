package com.managementappbackend.service.domain.impl;

import com.managementappbackend.events.TaskAssignedEvent;
import com.managementappbackend.model.domain.Organization;
import com.managementappbackend.model.domain.Task;
import com.managementappbackend.model.domain.User;
import com.managementappbackend.model.enumerations.ServiceStatus;
import com.managementappbackend.model.exceptions.NotOwnedTaskException;
import com.managementappbackend.model.exceptions.TaskNotFoundException;
import com.managementappbackend.repository.TaskRepository;
import com.managementappbackend.service.domain.TaskService;
import com.sun.source.util.TaskEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ApplicationEventPublisher eventPublisher;


    public TaskServiceImpl(TaskRepository taskRepository, ApplicationEventPublisher eventPublisher) {
        this.taskRepository = taskRepository;
        this.eventPublisher = eventPublisher;
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
        eventPublisher.publishEvent(new TaskAssignedEvent(
                this,
                task.getCreatedByUserId().getUsername(),
                task.getAssignedToUserId().getUsername(),
                task.getId(),
                task.getTitle()
        ));
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

    @Override
    public Optional<Task> toggleFinished(Long id, String username) {
        if (taskRepository.findById(id).isPresent()) {
            Task task = taskRepository.findById(id).get();

            if (!task.getAssignedToUserId().getUsername().equals(username)) {
                throw new NotOwnedTaskException("You can only toggle your own assigned tasks");
            }


            task.setFinished(!task.isFinished());
            task.setUpdatedDate(LocalDateTime.now());

            if (task.isFinished()) {
                task.setCompletedDate(LocalDateTime.now());
                task.setStatus(ServiceStatus.COMPLETED);
            } else {
                task.setCompletedDate(null);
                task.setStatus(ServiceStatus.IN_PROGRESS);
            }

            return Optional.of(taskRepository.save(task));
        } else {
            throw new TaskNotFoundException("Task with ID:" + id + " has not been found");
        }
    }

    @Override
    public List<Task> findAllByOrganization(Organization organization) {
        return taskRepository.findByOrganization(organization);
    }
}