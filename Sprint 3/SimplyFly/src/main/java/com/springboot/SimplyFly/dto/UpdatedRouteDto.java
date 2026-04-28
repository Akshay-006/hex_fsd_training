package com.springboot.SimplyFly.dto;

import com.springboot.SimplyFly.enums.DepartureTime;
import com.springboot.SimplyFly.enums.TripType;

import java.time.LocalDateTime;

public record UpdatedRouteDto(
        LocalDateTime departureDate,
        LocalDateTime arrivalDate,
        int durationHrs,
        int durationMins,
        String stops,
        DepartureTime departureTime,
        TripType tripType,
        long sourceAirportId,
        long destinationAirportId


) {
}
