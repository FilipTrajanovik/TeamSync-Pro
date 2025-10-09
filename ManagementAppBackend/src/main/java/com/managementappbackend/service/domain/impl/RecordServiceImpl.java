package com.managementappbackend.service.domain.impl;

import com.managementappbackend.repository.RecordRepository;
import com.managementappbackend.service.domain.RecordService;
import org.springframework.stereotype.Service;
import com.managementappbackend.model.domain.Record;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RecordServiceImpl implements RecordService {

    private final RecordRepository recordRepository;

    public RecordServiceImpl(RecordRepository recordRepository) {
        this.recordRepository = recordRepository;
    }

    @Override
    public List<Record> findAll() {
        return recordRepository.findAll();
    }

    @Override
    public Optional<Record> findById(Long id) {
        return recordRepository.findById(id);
    }

    @Override
    public List<Record> findByClientId(Long clientId) {
        return recordRepository.findByClientId(clientId);
    }

    @Override
    public Optional<Record> save(Record record) {
        return Optional.of(recordRepository.save(record));
    }

    @Override
    public Optional<Record> update(Long id,Record record) {
       return recordRepository.findById(id)
               .map(existingRecord -> {

                   System.out.println("BEFORE UPDATE:");
                   System.out.println("ID: " + existingRecord.getId());
                   System.out.println("Old profileType: " + existingRecord.getProfileType());
                   System.out.println("Old jsonData: " + existingRecord.getJsonData());
                   System.out.println("Old client: " + existingRecord.getClient().getId());


                   existingRecord.setClient(record.getClient());
                    existingRecord.setJsonData(record.getJsonData());
                    existingRecord.setUpdatedAt(LocalDateTime.now());
                    existingRecord.setProfileType(record.getProfileType());



                   Record saved = recordRepository.save(existingRecord);

                   System.out.println("AFTER UPDATE:");
                   System.out.println("New profileType: " + saved.getProfileType());
                   System.out.println("New jsonData: " + saved.getJsonData());
                   System.out.println("New client: " + saved.getClient().getId());

                   return saved;
               });
    }

    @Override
    public void delete(Long id) {
        recordRepository.deleteById(id);
    }
}
