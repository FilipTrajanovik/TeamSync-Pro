package com.managementappbackend.dto;

import com.managementappbackend.model.domain.Client;
import com.managementappbackend.model.domain.Record;

import java.time.LocalDateTime;
import java.util.List;

public record CreateRecordDto(Long clientId, String profileType, String jsonData) {
    public static CreateRecordDto from(Record record) {
        return new CreateRecordDto(record.getClient().getId(), record.getProfileType(), record.getJsonData());
    }

    public static List<CreateRecordDto> from(List<Record> records) {
        return records.stream().map(CreateRecordDto::from).toList();
    }

    public Record toRecord(Client client) {
        return new Record(client, profileType, jsonData, LocalDateTime.now(), null);
    }
}
