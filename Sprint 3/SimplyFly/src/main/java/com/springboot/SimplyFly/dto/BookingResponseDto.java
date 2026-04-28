package com.springboot.SimplyFly.dto;

import com.springboot.SimplyFly.enums.AmountStatus;
import com.springboot.SimplyFly.enums.BookingStatus;
import com.springboot.SimplyFly.enums.SeatClass;

import java.math.BigDecimal;

public record BookingResponseDto(
        long bookingId,
        BookingStatus bookingStatus,
        AmountStatus amountStatus,
        BigDecimal totalAmount,
        String flightNumber,
        String seatRow,
        int seatColumn,
        SeatClass seatClass
) {
}
