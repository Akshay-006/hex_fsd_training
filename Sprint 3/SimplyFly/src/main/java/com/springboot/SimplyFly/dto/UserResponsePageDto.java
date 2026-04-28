package com.springboot.SimplyFly.dto;

import java.util.List;

public record UserResponsePageDto(
        List<UserResponseDto> data,
        int totalPages,
        long totalElements
) {
}
