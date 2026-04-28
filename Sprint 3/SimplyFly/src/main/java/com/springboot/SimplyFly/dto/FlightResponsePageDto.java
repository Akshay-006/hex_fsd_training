package com.springboot.SimplyFly.dto;

import java.util.List;

public record FlightResponsePageDto(
        List<FlightResponseAdminDto> data,
        int totalPages,
        long totalElements
) {
}
