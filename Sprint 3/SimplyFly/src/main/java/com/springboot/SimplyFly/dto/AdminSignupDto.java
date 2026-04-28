package com.springboot.SimplyFly.dto;

public record AdminSignupDto(
        String username,
        String password,
        String name,
        String email
) {
}
