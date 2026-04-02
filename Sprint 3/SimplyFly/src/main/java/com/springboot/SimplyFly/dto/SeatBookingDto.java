package com.springboot.SimplyFly.dto;

import java.util.List;

public record SeatBookingDto(
        List<Long> seatsId,
        Long pid

        ) {
}
