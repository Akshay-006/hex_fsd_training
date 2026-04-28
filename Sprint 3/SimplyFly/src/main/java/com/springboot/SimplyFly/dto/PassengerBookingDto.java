package com.springboot.SimplyFly.dto;

import com.springboot.SimplyFly.enums.AmountStatus;
import com.springboot.SimplyFly.enums.BookingStatus;
import com.springboot.SimplyFly.enums.SeatClass;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PassengerBookingDto(
        Long bookingId,
        String flightNumber,
        String fromCode,
        String toCode,
        LocalDateTime departureDate,
        String seatRow,
        Integer seatColumn,
        SeatClass seatClass,
        BookingStatus bookingStatus,
        AmountStatus amountStatus,
        BigDecimal totalAmount
) {
}
