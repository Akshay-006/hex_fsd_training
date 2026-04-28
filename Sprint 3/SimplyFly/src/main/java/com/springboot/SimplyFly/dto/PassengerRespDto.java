package com.springboot.SimplyFly.dto;

public record PassengerRespDto(
        long id,
        String name,
        String email,
        String contact
) {
}
