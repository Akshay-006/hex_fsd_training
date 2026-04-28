package com.springboot.SimplyFly.dto;

import java.util.List;

public record RouteResponsePageDto(
        List<RouteResponseDto> data,
        int totalPages,
        long totalElements
) {
}
