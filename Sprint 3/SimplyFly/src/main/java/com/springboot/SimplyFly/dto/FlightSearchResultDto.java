package com.springboot.SimplyFly.dto;

import com.springboot.SimplyFly.enums.DepartureTime;
import com.springboot.SimplyFly.enums.FlightDesc;
import com.springboot.SimplyFly.enums.TripType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FlightSearchResultDto(
        long id,
        String code,
        String airline,
        FlightDesc flightDesc,
        int availableSeats,
        int durationHours,
        int durationMins,
        String stops,
        TripType tripType,
        DepartureTime departureTime,
        LocalDateTime departureDate,
        LocalDateTime arrivalDate,
        String depAirport,
        String fromCity,
        String arrAirport,
        String toCity,
        BigDecimal minFare
) {
}
