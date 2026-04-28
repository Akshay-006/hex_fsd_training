package com.springboot.SimplyFly.dto;

import com.springboot.SimplyFly.enums.Gender;

import java.math.BigDecimal;

public record PassengerSummaryDto(
        Long passengerId,
        String name,
        Integer age,
        Gender gender,
        String email,
        String contactNumber,
        Long totalBookings,
        BigDecimal totalAmountSpent
) {
}
