package com.springboot.SimplyFly.dto;

import java.util.List;

public record CancellationResponsePageDto(
        List<CancellationResponseDto> data,
        int totalPages,
        long totalElements
) {
}
