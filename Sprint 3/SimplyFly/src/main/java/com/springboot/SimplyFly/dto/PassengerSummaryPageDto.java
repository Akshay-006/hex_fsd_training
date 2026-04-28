package com.springboot.SimplyFly.dto;

import java.util.List;

public record PassengerSummaryPageDto(
        List<PassengerSummaryDto> data,
        int totalPages,
        long totalElements
) {
}
