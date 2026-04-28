package com.springboot.SimplyFly.dto;

import com.springboot.SimplyFly.enums.FlightDesc;

import java.math.BigDecimal;

public record SearchRespDto(
        long id,
        String code,
        String airline,
        String depTime,
        String arrTime,
        String depAirport,
        String arrAirport,
        String duration,
        String stops,
        FlightDesc flightDesc

) {
}
