package com.springboot.SimplyFly.dto;

import java.util.List;

public record RoutesRespDto(
        List<RouteWithFlightSeatDto> data,
        int totalPages,
        long totalSize
) {
}
