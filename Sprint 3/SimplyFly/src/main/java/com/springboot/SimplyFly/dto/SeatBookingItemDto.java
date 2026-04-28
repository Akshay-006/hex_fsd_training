package com.springboot.SimplyFly.dto;

public record SeatBookingItemDto(
        long seatId,
        CoPassengerDto coPassengerDto
) {
}
