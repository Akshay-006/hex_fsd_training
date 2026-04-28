package com.springboot.SimplyFly.dto;

import com.springboot.SimplyFly.enums.CancellationStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CancellationResponseDto(
        Long cancellationId,
        Long flightPassengerId,
        String passengerName,
        String flightNumber,
        String fromCode,
        String toCode,
        LocalDateTime departureDate,
        String seatRow,
        Integer seatColumn,
        BigDecimal totalAmount,
        String reason,
        CancellationStatus status,
        LocalDateTime requestedAt
) {
}
