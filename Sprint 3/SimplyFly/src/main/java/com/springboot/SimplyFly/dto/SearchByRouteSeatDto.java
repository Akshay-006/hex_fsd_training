package com.springboot.SimplyFly.dto;

import com.springboot.SimplyFly.enums.PassengerAge;
import com.springboot.SimplyFly.enums.SeatClass;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record SearchByRouteSeatDto(
        String fromCode,
        String toCode,
        LocalDate departureDate,
        int neededSeats,
        SeatClass seatClass

) {
}
