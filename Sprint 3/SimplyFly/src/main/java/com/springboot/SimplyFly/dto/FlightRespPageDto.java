package com.springboot.SimplyFly.dto;

import java.util.List;

public record FlightRespPageDto(
        List<FlightRespDto> data,
        int totalPages,
        long totalElements
) {
}
