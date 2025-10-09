package com.managementappbackend.service.domain;
import com.managementappbackend.model.domain.Record;
import java.util.List;
import java.util.Optional;

public interface RecordService {
    List<Record> findAll();
    Optional<Record> findById(Long id);
    List<Record> findByClientId(Long clientId);
    Optional<Record> save(Record record);
    Optional<Record> update(Long id, Record record);
    void delete(Long id);
}
