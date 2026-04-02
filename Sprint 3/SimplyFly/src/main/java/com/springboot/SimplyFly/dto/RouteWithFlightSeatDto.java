package com.springboot.SimplyFly.dto;

import com.springboot.SimplyFly.enums.DepartureTime;
import com.springboot.SimplyFly.enums.TripType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record RouteWithFlightSeatDto(

        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        int durationHours,
        int durationMins,
        String stops,
        TripType tripType,
        DepartureTime departureTimeEnum

) {
}
