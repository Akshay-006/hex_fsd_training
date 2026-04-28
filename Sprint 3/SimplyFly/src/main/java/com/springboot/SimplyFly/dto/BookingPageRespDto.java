package com.springboot.SimplyFly.dto;

import java.util.List;

public record BookingPageRespDto(
        List<BookingRespDto> data,
        long totalElements,
        int totalPages
) {
}
