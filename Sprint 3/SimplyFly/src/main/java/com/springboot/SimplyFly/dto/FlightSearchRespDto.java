package com.springboot.SimplyFly.dto;

import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;


public record FlightSearchRespDto(

        long id,
        String code,
        String airline,
        LocalDateTime depTime,
        LocalDateTime arrTime,
        String depAirport,
        String arrAirport,
        int durationHrs,
        int durationMins,
        String stops,
        BigDecimal price,
        String badge


) {
}
