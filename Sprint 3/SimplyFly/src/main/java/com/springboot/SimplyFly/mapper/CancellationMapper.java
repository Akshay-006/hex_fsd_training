package com.springboot.SimplyFly.mapper;

import com.springboot.SimplyFly.dto.CancellationResponseDto;
import com.springboot.SimplyFly.model.Cancellation;
import com.springboot.SimplyFly.model.FlightPassenger;

public class CancellationMapper {
    public static CancellationResponseDto mapToDto(Cancellation c){
        FlightPassenger fp = c.getBooking();
        return new CancellationResponseDto(
                c.getId(),
                fp.getId(),
                fp.getPassenger().getName(),
                fp.getFlight().getFlightNumber(),
                fp.getFlight().getRoute().getSourceAirport().getCode(),
                fp.getFlight().getRoute().getDestinationAirport().getCode(),
                fp.getFlight().getRoute().getDepartureDate(),
                fp.getSeat() != null ? fp.getSeat().getSeatRow() : null,
                fp.getSeat() != null ? fp.getSeat().getSeatcolumn() : null,
                fp.getTotalAmount(),
                c.getReason(),
                c.getStatus(),
                c.getRequestedAt()
        );
    }
}
