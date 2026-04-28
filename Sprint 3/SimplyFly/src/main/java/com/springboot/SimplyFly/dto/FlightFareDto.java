package com.springboot.SimplyFly.dto;

import com.springboot.SimplyFly.model.Flight;

import java.math.BigDecimal;

public record FlightFareDto(
        BigDecimal fare,
        Flight flight
) {
}
