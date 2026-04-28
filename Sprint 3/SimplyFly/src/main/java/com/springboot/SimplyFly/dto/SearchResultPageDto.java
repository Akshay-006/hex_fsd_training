package com.springboot.SimplyFly.dto;

import java.util.List;

public record SearchResultPageDto(
        List<FlightSearchResultDto> data,
        int totalPages,
        long totalElements

) {
}
