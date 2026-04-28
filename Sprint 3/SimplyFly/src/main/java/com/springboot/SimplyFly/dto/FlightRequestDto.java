package com.springboot.SimplyFly.dto;

public record FlightRequestDto(
   String flightNumber,
   String name,
   Long routeId,
   Long ownerId,
   Integer seatRows,
   Integer seatColumns
) {
}
