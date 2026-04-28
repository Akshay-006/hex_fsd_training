package com.springboot.SimplyFly.mapper;

import com.springboot.SimplyFly.dto.*;
import com.springboot.SimplyFly.model.Flight;

import java.time.format.DateTimeFormatter;

public class FlightMapper {

    public static FlightRespDto mapToDto(Flight flight){
        return new FlightRespDto(

                flight.getFlightNumber(),
                flight.getName()
        );
    }

    public static SearchRespDto mapToSearchRespDto(Flight flight){

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        String depTime = flight.getRoute().getDepartureDate().format(formatter);
        String arrTime = flight.getRoute().getArrivalDate().format(formatter);
        String duration = Integer.toString(flight.getRoute().getDurationHrs()) + "h " + Integer.toString(flight.getRoute().getDurationMins()) +"m";

        return new SearchRespDto(
                flight.getId(),
                flight.getFlightNumber(),
                flight.getName(),
                depTime,
                arrTime,
                flight.getRoute().getSourceAirport().getCode(),
                flight.getRoute().getDestinationAirport().getCode(),
                duration,
                flight.getRoute().getStops(),
                flight.getFlightDesc()
        );
    }

    public static FlightResponseDto mapToRespDto(Flight flight){
        return new FlightResponseDto(
                flight.getId(),
                flight.getFlightNumber(),
                flight.getRoute()!=null ?flight.getRoute().getSourceAirport().getCode() : null,
                flight.getRoute()!=null ?flight.getRoute().getSourceAirport().getCity():null,
                flight.getRoute()!=null ?flight.getRoute().getDestinationAirport().getCode():null,
                flight.getRoute()!=null ?flight.getRoute().getDestinationAirport().getCity():null,
                flight.getRoute()!=null ?flight.getRoute().getDepartureDate() :null,
                flight.getRoute()!=null ?flight.getRoute().getArrivalDate():null,
                flight.getAvailableSeats(),
                flight.getRoute()!=null ?flight.getRoute().getId():null,
                flight.getStatus()

        );
    }

    public static FlightResponseAdminDto toDto(Flight f){
        return new FlightResponseAdminDto(
                f.getId(),
                f.getFlightNumber(),
                f.getName(),
                f.getRoute()!=null ? f.getRoute().getSourceAirport().getCode() : null,
                f.getRoute()!=null ? f.getRoute().getSourceAirport().getCity() : null,
                f.getRoute()!=null ? f.getRoute().getDestinationAirport().getCode() : null,
                f.getRoute()!=null ? f.getRoute().getDestinationAirport().getCity() : null,
                f.getRoute()!=null ? f.getRoute().getDepartureDate() : null,
                f.getRoute()!=null ? f.getRoute().getArrivalDate() : null,
                f.getAvailableSeats(),
                f.getSeatRows(),
                f.getSeatColumns(),
                f.getOwner() != null ? f.getOwner().getUsername() : null
        );
    }


}
