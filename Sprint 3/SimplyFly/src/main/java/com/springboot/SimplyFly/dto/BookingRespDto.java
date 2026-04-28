package com.springboot.SimplyFly.dto;

import com.springboot.SimplyFly.enums.AmountStatus;
import com.springboot.SimplyFly.enums.BookingStatus;

import java.math.BigDecimal;

public record BookingRespDto(
        long id,
        String coPassengerName,
        AmountStatus amountStatus,
        String seat,
        String passengerName,
        BookingStatus bookingStatus,
        BigDecimal totalAmount,
        String flightName


) {
}
