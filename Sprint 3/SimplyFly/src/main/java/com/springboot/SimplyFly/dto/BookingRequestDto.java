package com.springboot.SimplyFly.dto;

import java.util.List;

public record BookingRequestDto(
        long flightId,
        List<SeatBookingItemDto> seatBookings
) {
}
