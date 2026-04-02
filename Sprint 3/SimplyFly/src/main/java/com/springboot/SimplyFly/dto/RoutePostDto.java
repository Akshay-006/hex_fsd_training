package com.springboot.SimplyFly.dto;

import com.springboot.SimplyFly.enums.DepartureTime;
import com.springboot.SimplyFly.enums.TripType;

import java.time.LocalDateTime;

public record RoutePostDto(

    LocalDateTime arrivalDate,
    LocalDateTime departureDate,
    DepartureTime departureTime,
    int durHrs,
    int durMins,
    String stops,
    TripType tripType

) {
}
