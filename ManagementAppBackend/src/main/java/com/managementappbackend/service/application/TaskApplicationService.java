package com.managementappbackend.service.application;

import com.managementappbackend.dto.CreateTaskDto;
import com.managementappbackend.dto.DisplayTaskDto;
import com.managementappbackend.model.domain.Task;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface TaskApplicationService {
    List<DisplayTaskDto> findAll();
    Optional<DisplayTaskDto> findById(Long id);
    Optional<DisplayTaskDto> save(CreateTaskDto task);
    Optional<DisplayTaskDto> update(Long id, CreateTaskDto task);
    Optional<DisplayTaskDto> findByTitle(String title);
    List<DisplayTaskDto> findByClientId(Long clientId);
    List<DisplayTaskDto> findByAssignedTo(String username);
    Optional<DisplayTaskDto> toggleFinished(Long id, String username);
    void delete(Long id);
}
