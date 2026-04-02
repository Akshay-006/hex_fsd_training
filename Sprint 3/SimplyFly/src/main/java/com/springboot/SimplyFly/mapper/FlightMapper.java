package com.springboot.SimplyFly.mapper;

import com.springboot.SimplyFly.dto.FlightRespDto;
import com.springboot.SimplyFly.dto.SearchRespDto;
import com.springboot.SimplyFly.model.Flight;

public class FlightMapper {

    public static FlightRespDto mapToDto(Flight flight){
        return new FlightRespDto(

                flight.getFlightNumber(),
                flight.getName()
        );
    }

    public static SearchRespDto mapToSearchRespDto(Flight flight){
        return new SearchRespDto(
                flight.getFlightNumber(),
                flight.getName(),
                flight.getRoute().getSourceAirport().getCity(),
                flight.getRoute().getDestinationAirport().getCity(),
                flight.getRoute().getStops(),
                flight.getRoute().getDurationHrs(),
                flight.getRoute().getDurationHrs()
        );
    }

}
