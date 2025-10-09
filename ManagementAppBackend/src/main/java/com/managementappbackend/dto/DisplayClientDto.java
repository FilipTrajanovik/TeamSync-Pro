package com.managementappbackend.dto;

import com.managementappbackend.model.domain.Client;
import com.managementappbackend.model.domain.Organization;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record DisplayClientDto (Long id, String firstName, String lastName, String phoneNumber, String email, String address, LocalDate birthday, String notes, Long organizationId, LocalDateTime createdAt, LocalDateTime updatedAt) {
    public static DisplayClientDto from(Client client){
        return new DisplayClientDto(client.getId(), client.getFirstName(), client.getLastName(), client.getPhone(), client.getEmail(), client.getAddress(), client.getBirthday(), client.getNotes(), client.getOrganization().getId(), client.getCreatedAt(), client.getUpdatedAt());
    }

    public static List<DisplayClientDto> from(List<Client> clients){
        return clients.stream().map(DisplayClientDto::from).toList();
    }

    public Client toClient(Organization organization){
        return new Client(firstName, lastName, email, phoneNumber, address, birthday, notes, organization, true, createdAt, updatedAt);
    }


}
