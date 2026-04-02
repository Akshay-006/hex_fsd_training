package com.springboot.SimplyFly.dto;

import com.springboot.SimplyFly.enums.AmountStatus;
import com.springboot.SimplyFly.enums.BookingStatus;

import java.math.BigDecimal;
import java.util.Map;

public record BookingConfirmationDto(
        BookingStatus bookingStatus,
        AmountStatus amountStatus,
        BigDecimal totalAmount,
        Map<Long,Long> coPassengerAndSeatMap,
        Long passengerId,
        long flightId

) {
}
