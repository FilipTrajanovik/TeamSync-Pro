package com.managementappbackend.service.application;
import com.managementappbackend.dto.CreateRecordDto;
import com.managementappbackend.dto.DisplayRecordDto;
import com.managementappbackend.model.domain.Record;

import java.util.List;
import java.util.Optional;

public interface RecordApplicationService {
    List<DisplayRecordDto> findAll();
    Optional<DisplayRecordDto> findById(Long id);
    List<DisplayRecordDto> findByClientId(Long clientId);
    Optional<DisplayRecordDto> save(CreateRecordDto record);
    Optional<DisplayRecordDto> update(Long id, CreateRecordDto record);
    void delete(Long id);
}
