package com.springboot.SimplyFly.mapper;

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
}
