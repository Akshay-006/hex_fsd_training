package com.springboot.SimplyFly.mapper;

import com.springboot.SimplyFly.dto.RouteResponseDto;
import com.springboot.SimplyFly.dto.RouteWithFlightSeatDto;
import com.springboot.SimplyFly.model.Route;

public class RouteMapper {

    public static RouteWithFlightSeatDto mapToDto(Route route) {
        return new RouteWithFlightSeatDto(

                route.getDepartureDate(),
                route.getArrivalDate(),
                route.getDurationHrs(),
                route.getDurationMins(),
                route.getStops(),
                route.getTripType(),
                route.getDepartureTime()


        );
    }

    public static RouteResponseDto toDto(Route r) {
        return new RouteResponseDto(
                r.getId(),
                r.getSourceAirport().getCode(),
                r.getSourceAirport().getCity(),
                r.getDestinationAirport().getCode(),
                r.getDestinationAirport().getCity(),
                r.getDepartureDate(),
                r.getArrivalDate(),
                r.getDepartureTime(),
                r.getDurationHrs(),
                r.getDurationMins(),
                r.getStops(),
                r.getTripType()
        );
    }


}
