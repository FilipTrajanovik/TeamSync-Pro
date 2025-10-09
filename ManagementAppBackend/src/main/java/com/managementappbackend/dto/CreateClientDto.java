package com.managementappbackend.dto;

import com.managementappbackend.model.domain.Client;
import com.managementappbackend.model.domain.Organization;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public record CreateClientDto (String firstName, String lastName, String email, String phoneNumber, String address, LocalDate dateOfBirth, String notes, Long organizationId, LocalDateTime createdAt) {

    public static CreateClientDto from(Client client){
        return new CreateClientDto(
                client.getFirstName(),
                client.getLastName(),
                client.getEmail(),
                client.getPhone(),
                client.getAddress(),
                client.getBirthday(),
                client.getNotes(),
                client.getOrganization().getId(),
                LocalDateTime.now()
        );
    }

    public static List<CreateClientDto> from(List<Client> clients){
        return clients.stream().map(CreateClientDto::from).collect(Collectors.toList());
    }

    public Client toClient(Organization organization){
        return new Client(firstName, lastName, email, phoneNumber, address, dateOfBirth, notes, organization, true, createdAt, null);
    }

}

