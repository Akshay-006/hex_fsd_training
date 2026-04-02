package com.springboot.SimplyFly.service;

import com.springboot.SimplyFly.dto.*;
import com.springboot.SimplyFly.enums.DepartureTime;
import com.springboot.SimplyFly.exception.ResourceNotFoundException;
import com.springboot.SimplyFly.mapper.FlightMapper;
import com.springboot.SimplyFly.mapper.RouteMapper;
import com.springboot.SimplyFly.mapper.SeatMapper;
import com.springboot.SimplyFly.model.Flight;
import com.springboot.SimplyFly.model.Route;
import com.springboot.SimplyFly.model.Seat;
import com.springboot.SimplyFly.repository.FlightRepository;
import com.springboot.SimplyFly.repository.RouteRepository;
import com.springboot.SimplyFly.repository.SeatRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@AllArgsConstructor
public class FlightService {

    private final FlightRepository flightRepository;
    private final RouteRepository routeRepository;
    private final SeatRepository seatRepository;



    public FlightRespPageDto getFlightsByRouteId(long routeId, int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<Flight> flightList = flightRepository.getFlightsByRouteId(routeId,pageable);


        List<FlightRespDto> data = flightList.toList()
                .stream()
                .map(FlightMapper:: mapToDto)
                .toList();

        int totalPages = flightList.getTotalPages();
        long totalElements = flightList.getTotalElements();

        return new FlightRespPageDto(
                data,
                totalPages,
                totalElements
        );

    }


    public Flight getFlightById(long id){
        Flight flight = flightRepository.findById(id).orElseThrow(
                ()-> new ResourceNotFoundException("Flight Id not found")
        );

        return flight;
    }


}
