package com.managementappbackend.dto;

public record ChangePasswordDto(
        String currentPassword,
        String newPassword,
        String confirmPassword
) {
}
