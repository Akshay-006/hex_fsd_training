package com.springboot.SimplyFly.dto;

public record SearchRespDto(
        String flightNumber,
        String flightName,
        String fromLocation,
        String toLocation,
        String stops,
        int durHrs,
        int durMins

) {
}
