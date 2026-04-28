package com.springboot.SimplyFly.dto;

import com.springboot.SimplyFly.enums.DepartureTime;
import com.springboot.SimplyFly.enums.TripType;

import java.time.LocalDateTime;

public record RouteRequestDto(
        Long sourceAirportId,
        Long destinationAirportId,
        LocalDateTime departureDate,
        LocalDateTime arrivalDate,
        DepartureTime departureTime,   // MORNING, AFTERNOON, EVENING, NIGHT
        Integer durationHours,
        Integer durationMins,
        String stops,
        TripType tripType
) {
}
