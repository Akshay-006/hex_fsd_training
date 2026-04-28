package com.springboot.SimplyFly.dto;

import java.time.LocalDateTime;

public record FlightResponseAdminDto(
        Long flightId,
        String flightNumber,
        String name,
        String fromCode,
        String fromCity,
        String toCode,
        String toCity,
        LocalDateTime departureDate,
        LocalDateTime arrivalDate,
        Integer availableSeats,
        Integer seatRows,
        Integer seatColumns,
        String ownerUsername
) {
}
