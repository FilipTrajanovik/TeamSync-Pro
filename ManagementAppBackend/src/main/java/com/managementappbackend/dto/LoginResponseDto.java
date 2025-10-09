package com.managementappbackend.dto;

public record LoginResponseDto(String token, DisplayUserDto user) {
}
