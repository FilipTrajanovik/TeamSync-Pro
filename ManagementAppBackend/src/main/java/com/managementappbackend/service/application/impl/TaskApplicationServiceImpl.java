package com.managementappbackend.service.application.impl;


import com.managementappbackend.dto.CreateTaskDto;
import com.managementappbackend.dto.DisplayTaskDto;
import com.managementappbackend.model.domain.Client;
import com.managementappbackend.model.domain.Organization;
import com.managementappbackend.model.domain.User;
import com.managementappbackend.model.enumerations.Role;
import com.managementappbackend.model.exceptions.ClientNotFoundException;
import com.managementappbackend.model.exceptions.OrganizationNotFoundException;
import com.managementappbackend.service.application.TaskApplicationService;
import com.managementappbackend.service.domain.ClientService;
import com.managementappbackend.service.domain.OrganizationService;
import com.managementappbackend.service.domain.TaskService;
import com.managementappbackend.service.domain.UserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskApplicationServiceImpl implements TaskApplicationService {

    private final TaskService taskService;
    private final UserService userService;
    private final OrganizationService organizationService;
    private final ClientService clientService;

    public TaskApplicationServiceImpl(TaskService taskService, UserService userService, OrganizationService organizationService, ClientService clientService) {
        this.taskService = taskService;
        this.userService = userService;
        this.organizationService = organizationService;
        this.clientService = clientService;
    }

    @Override
    public List<DisplayTaskDto> findAll() {
        return taskService.findAll().stream().map(DisplayTaskDto::from).toList();
    }

    @Override
    public Optional<DisplayTaskDto> findById(Long id) {
        return taskService.findById(id).map(DisplayTaskDto::from);
    }

    @Override
    public Optional<DisplayTaskDto> save(CreateTaskDto task) {
        String currentUsername = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User createdBy = userService.findByUsername(currentUsername);
        User user = userService.findByUsername(task.assignedToUserId());
        Organization org = organizationService.findById(task.organizationId()).orElseThrow(() -> new OrganizationNotFoundException("Organization not found"));
        Client client = clientService.findById(task.clientId()).orElseThrow(() -> new ClientNotFoundException("Client not found"));
        return taskService.save(task.toTask(user, createdBy, org, client)).map(DisplayTaskDto::from);
    }

    @Override
    public Optional<DisplayTaskDto> update(Long id, CreateTaskDto task) {
        String currentUsername = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User createdBy = userService.findByUsername(currentUsername);
        User user = userService.findByUsername(task.assignedToUserId());
        Organization org = organizationService.findById(task.organizationId()).orElseThrow(() -> new OrganizationNotFoundException("Organization not found"));
        Client client = clientService.findById(task.clientId()).orElseThrow(() -> new ClientNotFoundException("Client not found"));
        return taskService.update(id, task.toTask(user, createdBy, org, client)).map(DisplayTaskDto::from);
    }

    @Override
    public Optional<DisplayTaskDto> findByTitle(String title) {
        return taskService.findByTitle(title).map(DisplayTaskDto::from);
    }

    @Override
    public List<DisplayTaskDto> findByClientId(Long clientId) {
        return taskService.findByClientId(clientId).stream().map(DisplayTaskDto::from).toList();
    }

    @Override
    public List<DisplayTaskDto> findByAssignedTo(String username) {
        User user = userService.findByUsername(username);
        return taskService.findByAssignedTo(user).stream().map(DisplayTaskDto::from).toList();
    }

    @Override
    public Optional<DisplayTaskDto> toggleFinished(Long id, String username) {
        return taskService.toggleFinished(id, username).map(DisplayTaskDto::from);
    }

    @Override
    public void delete(Long id) {
        taskService.delete(id);
    }

    @Override
    public List<DisplayTaskDto> findByOrganization() {
        String currentUsername = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User user = userService.findByUsername(currentUsername);
        if(user.getRole().equals(Role.MANAGER))
        {
            Organization org = user.getOrganizations().get(0);
            return taskService.findAllByOrganization(org).stream().map(DisplayTaskDto::from).toList();
        }
        return List.of();
    }
}
