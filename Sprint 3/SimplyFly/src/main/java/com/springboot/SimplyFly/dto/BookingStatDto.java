package com.springboot.SimplyFly.dto;

import java.math.BigDecimal;

public record BookingStatDto(
        Long totalBookings,
        Long cancelledBookings,
        BigDecimal totalRevenue
) {
}
