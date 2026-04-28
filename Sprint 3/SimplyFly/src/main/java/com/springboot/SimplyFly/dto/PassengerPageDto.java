package com.springboot.SimplyFly.dto;

import java.util.List;

public record PassengerPageDto(
        List<PassengerRespDto> data,
        long totalElements,
        int totalPages
) {
}
