package com.managementappbackend.dto;

import com.managementappbackend.model.domain.Client;
import com.managementappbackend.model.domain.Record;

import java.time.LocalDateTime;
import java.util.List;

public record DisplayRecordDto(Long id, Long clientId, String profileType, String jsonData) {

    public static DisplayRecordDto from(Record record) {
        return new DisplayRecordDto(record.getId(), record.getClient().getId(), record.getProfileType(), record.getJsonData());
    }
    public static List<DisplayRecordDto> from(List<Record> records) {
        return records.stream().map(DisplayRecordDto::from).toList();
    }
    public Record toRecord(Client client) {
        return new Record(client, profileType, jsonData, LocalDateTime.now(), LocalDateTime.now());
    }
}
