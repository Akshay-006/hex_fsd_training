package com.springboot.SimplyFly.dto;

public record AirportRequestDto(
        String city,
        String name,
        String code
) {
}
