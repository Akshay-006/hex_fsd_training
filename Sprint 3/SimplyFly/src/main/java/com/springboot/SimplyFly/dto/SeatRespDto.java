package com.springboot.SimplyFly.dto;

import com.springboot.SimplyFly.enums.PassengerAge;
import com.springboot.SimplyFly.enums.SeatClass;

import java.math.BigDecimal;

public record SeatRespDto(
        String seatRow,
        int seatColumn,
        BigDecimal fare,
        PassengerAge passengerAge,
        SeatClass seatClass,
        boolean availability
) {
}
