package com.managementappbackend.service.application.impl;

import com.managementappbackend.dto.CreateRecordDto;
import com.managementappbackend.dto.DisplayRecordDto;
import com.managementappbackend.model.domain.Client;
import com.managementappbackend.model.domain.Record;
import com.managementappbackend.model.exceptions.ClientNotFoundException;
import com.managementappbackend.service.application.RecordApplicationService;
import com.managementappbackend.service.domain.ClientService;
import com.managementappbackend.service.domain.RecordService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecordApplicationServiceImpl implements RecordApplicationService {


    private final RecordService recordService;
    private final ClientService clientService;

    public RecordApplicationServiceImpl(RecordService recordService, ClientService clientService) {
        this.recordService = recordService;
        this.clientService = clientService;
    }

    @Override
    public List<DisplayRecordDto> findAll() {
        return recordService.findAll().stream().map(DisplayRecordDto::from).toList();
    }

    @Override
    public Optional<DisplayRecordDto> findById(Long id) {
        return recordService.findById(id).map(DisplayRecordDto::from);
    }

    @Override
    public List<DisplayRecordDto> findByClientId(Long clientId) {
        return recordService.findByClientId(clientId).stream().map(DisplayRecordDto::from).toList();
    }

    @Override
    public Optional<DisplayRecordDto> save(CreateRecordDto record) {
        Client client = clientService.findById(record.clientId()).orElseThrow(() -> new ClientNotFoundException("Client with " + record.clientId() + " had not been found"));
        return recordService.save(record.toRecord(client)).map(DisplayRecordDto::from);
    }

    @Override
    public Optional<DisplayRecordDto> update(Long id, CreateRecordDto record) {
        Client client = clientService.findById(record.clientId()).orElseThrow(() -> new ClientNotFoundException("Client with " + record.clientId() + " had not been found"));
        return recordService.update(id,record.toRecord(client)).map(DisplayRecordDto::from);
    }

    @Override
    public void delete(Long id) {
        recordService.delete(id);
    }
}
