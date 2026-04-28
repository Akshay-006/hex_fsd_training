package com.springboot.SimplyFly.dto;

import java.time.Instant;

public record UserResponseDto(
        Long userId,
        String username,
        String role,
        Boolean isActive,
        Instant createdAt
) {
}
