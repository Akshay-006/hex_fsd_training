package com.springboot.SimplyFly.dto;

import com.springboot.SimplyFly.enums.DepartureTime;
import com.springboot.SimplyFly.enums.TripType;

import java.time.LocalDateTime;

public record RouteResponseDto(
        Long id,
        String fromCode,
        String fromCity,
        String toCode,
        String toCity,
        LocalDateTime departureDate,
        LocalDateTime arrivalDate,
        DepartureTime departureTime,
        Integer durationHours,
        Integer durationMins,
        String stops,
        TripType tripType
) {
}
