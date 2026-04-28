package com.springboot.SimplyFly.dto;

import com.springboot.SimplyFly.enums.FlightStatus;

import java.time.LocalDateTime;

public record FlightResponseDto(
        Long flightId,
        String flightNumber,
        String fromCode,
        String fromCity,
        String toCode,
        String toCity,
        LocalDateTime departureDate,
        LocalDateTime arrivalDate,
        Integer availableSeats,
        Long routeId,
        FlightStatus status
) {
}
