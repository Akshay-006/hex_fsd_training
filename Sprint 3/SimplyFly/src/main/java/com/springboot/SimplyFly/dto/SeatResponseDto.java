package com.springboot.SimplyFly.dto;

import com.springboot.SimplyFly.enums.PassengerAge;
import com.springboot.SimplyFly.enums.SeatClass;

import java.math.BigDecimal;

public record SeatResponseDto(
        long id,
        String seatRow,
        int seatColumn,
        SeatClass seatClass,
        BigDecimal fare,
        Boolean isAvailable,
        PassengerAge passengerAge
) {
}
