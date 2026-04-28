package com.springboot.SimplyFly.dto;

import com.springboot.SimplyFly.enums.Gender;

import java.util.List;

public record PassengerDetailDto(
        Long passengerId,
        String name,
        Integer age,
        Gender gender,
        String email,
        String contactNumber,
        String address,
        List<PassengerBookingDto> bookings
) {
}
