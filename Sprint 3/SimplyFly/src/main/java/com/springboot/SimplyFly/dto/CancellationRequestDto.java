package com.springboot.SimplyFly.dto;

public record CancellationRequestDto(
        Long flightPassengerId,
        String reason
) {
}
