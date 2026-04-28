package com.springboot.SimplyFly.dto;

import com.springboot.SimplyFly.enums.AmountStatus;
import com.springboot.SimplyFly.enums.BookingStatus;

import java.math.BigDecimal;

public record UpdatedBookingDto(
        BookingStatus bookingStatus,
        AmountStatus amountStatus,
        BigDecimal totalAmount
) {
}
