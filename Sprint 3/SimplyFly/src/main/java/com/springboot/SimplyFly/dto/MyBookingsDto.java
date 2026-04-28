package com.springboot.SimplyFly.dto;

import com.springboot.SimplyFly.enums.AmountStatus;
import com.springboot.SimplyFly.enums.BookingStatus;
import com.springboot.SimplyFly.enums.SeatClass;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MyBookingsDto(
        long bookingId,
        String flightNumber,
        String fromCode,
        String toCode,
        String fromCity,
        String toCity,
        LocalDateTime departureDate,
        LocalDateTime arrivalDate,
        String seatRow,
        Integer seatColumn,
        SeatClass seatClass,
        BookingStatus bookingStatus,
        AmountStatus amountStatus,
        BigDecimal totalAmount,
        String coPassengerName,
        int coPassengerAge
) {
}
