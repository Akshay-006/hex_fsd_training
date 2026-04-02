package com.springboot.SimplyFly.dto;

import java.util.List;

public record SearchRespPageDto(
        List<SearchRespDto> data,
        int totalPages,
        long totalElements
) {
}
