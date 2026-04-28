package com.springboot.SimplyFly.mapper;

import com.springboot.SimplyFly.dto.BookingRespDto;
import com.springboot.SimplyFly.dto.MyBookingsDto;
import com.springboot.SimplyFly.model.FlightPassenger;

public class BookingMapper {

    public static BookingRespDto mapToDto (FlightPassenger flightPassenger){


        return new BookingRespDto(
                flightPassenger.getId(),
                flightPassenger.getCoPassenger().getName(),
                flightPassenger.getAmountStatus(),
                flightPassenger.getSeat()==null ? null : flightPassenger.getSeat().getSeatRow()+Integer.toString(flightPassenger.getSeat().getSeatcolumn()),
                flightPassenger.getPassenger()==null ? null : flightPassenger.getPassenger().getName(),
                flightPassenger.getBookingStatus(),
                flightPassenger.getTotalAmount(),
                flightPassenger.getFlight().getName()

        );
    }

    public static MyBookingsDto mapToMyBookingDto(FlightPassenger flightPassenger) {

        if (flightPassenger.getSeat()==null){
            return new MyBookingsDto(
                    flightPassenger.getId(),
                    flightPassenger.getFlight().getFlightNumber(),
                    flightPassenger.getFlight().getRoute().getSourceAirport().getCode(),
                    flightPassenger.getFlight().getRoute().getDestinationAirport().getCode(),
                    flightPassenger.getFlight().getRoute().getSourceAirport().getCity(),
                    flightPassenger.getFlight().getRoute().getDestinationAirport().getCity(),
                    flightPassenger.getFlight().getRoute().getDepartureDate(),
                    flightPassenger.getFlight().getRoute().getArrivalDate(),
                    null,
                    null,
                    null,
                    flightPassenger.getBookingStatus(),
                    null,
                    null,
                    flightPassenger.getCoPassenger().getName(),
                    flightPassenger.getCoPassenger().getAge()

            );
        }

        return new MyBookingsDto(
                flightPassenger.getId(),
                flightPassenger.getFlight().getFlightNumber(),
                flightPassenger.getFlight().getRoute().getSourceAirport().getCode(),
                flightPassenger.getFlight().getRoute().getDestinationAirport().getCode(),
                flightPassenger.getFlight().getRoute().getSourceAirport().getCity(),
                flightPassenger.getFlight().getRoute().getDestinationAirport().getCity(),
                flightPassenger.getFlight().getRoute().getDepartureDate(),
                flightPassenger.getFlight().getRoute().getArrivalDate(),
                flightPassenger.getSeat().getSeatRow(),
                flightPassenger.getSeat().getSeatcolumn(),
                flightPassenger.getSeat().getSeatClass(),
                flightPassenger.getBookingStatus(),
                flightPassenger.getAmountStatus(),
                flightPassenger.getTotalAmount(),
                flightPassenger.getCoPassenger().getName(),
                flightPassenger.getCoPassenger().getAge()

        );
    }
}
