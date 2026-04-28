package com.springboot.SimplyFly.mapper;

import com.springboot.SimplyFly.dto.PassengerBookingDto;
import com.springboot.SimplyFly.dto.PassengerRespDto;
import com.springboot.SimplyFly.dto.PassengerSummaryDto;
import com.springboot.SimplyFly.model.FlightPassenger;
import com.springboot.SimplyFly.model.Passenger;
import com.springboot.SimplyFly.repository.FlightPassengerRepository;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
public class PassengerMapper {

    private final FlightPassengerRepository flightPassengerRepository;

    public static PassengerRespDto mapToDto(Passenger passenger){

        return new PassengerRespDto(
                passenger.getId(),
                passenger.getName(),
                passenger.getEmail(),
                passenger.getContactNumber()
        );
    }


    public static List<PassengerBookingDto> mapToBookingDto(List<FlightPassenger> bookings) {

        List<PassengerBookingDto> data = new ArrayList<>();

        bookings.forEach((b) -> {
            PassengerBookingDto passengerBookingDto = new PassengerBookingDto(
                    b.getId(),
                    b.getFlight().getFlightNumber(),
                    b.getFlight().getRoute() != null ? b.getFlight().getRoute().getSourceAirport().getCode() : null,
                    b.getFlight().getRoute() != null ? b.getFlight().getRoute().getDestinationAirport().getCode() : null,
                    b.getFlight().getRoute() != null ? b.getFlight().getRoute().getDepartureDate():null,
                    b.getSeat()!=null? b.getSeat().getSeatRow() : null,
                    b.getSeat()!=null? b.getSeat().getSeatcolumn() : null,
                    b.getSeat()!=null? b.getSeat().getSeatClass() : null,
                    b.getBookingStatus(),
                    b.getSeat()!=null? b.getAmountStatus() : null,
                    b.getSeat()!=null? b.getTotalAmount():null
            );
            data.add(passengerBookingDto);
        });

        return  data;
    }
}
