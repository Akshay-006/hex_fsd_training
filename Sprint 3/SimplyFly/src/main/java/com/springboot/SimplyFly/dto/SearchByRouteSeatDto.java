package com.springboot.SimplyFly.dto;

import com.springboot.SimplyFly.enums.PassengerAge;
import com.springboot.SimplyFly.enums.SeatClass;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record SearchByRouteSeatDto(
        String fromLocation,
        String fromAirport,
        String toLocation,
        String toAirport,
        LocalDateTime departureDate,
        int neededSeats,
        PassengerAge passengerAge,
        SeatClass seatClass

) {
}
