package com.springboot.SimplyFly.service;

import com.springboot.SimplyFly.dto.RoutePostDto;
import com.springboot.SimplyFly.dto.RouteWithFlightSeatDto;
import com.springboot.SimplyFly.dto.RoutesRespDto;
import com.springboot.SimplyFly.dto.SearchByRouteSeatDto;
import com.springboot.SimplyFly.mapper.RouteMapper;
import com.springboot.SimplyFly.model.Route;
import com.springboot.SimplyFly.repository.RouteRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor

public class RouteService {

    private final RouteRepository routeRepository;

    public RoutesRespDto getRouteDetails(SearchByRouteSeatDto searchByRouteSeatDto,int page, int size) {

        Pageable pageable = PageRequest.of(page,size);

        Page<Route> routeList = routeRepository.getRouteWithDetails(
                searchByRouteSeatDto.fromLocation(),
                searchByRouteSeatDto.fromAirport(),
                searchByRouteSeatDto.toLocation(),
                searchByRouteSeatDto.toAirport(),
                searchByRouteSeatDto.departureDate(),
                pageable

        );

        List<RouteWithFlightSeatDto> data = routeList.toList()
                .stream()
                .map(RouteMapper:: mapToDto)
                .toList();

        int totalPages = routeList.getTotalPages();
        long totalElements = routeList.getTotalElements();

        return new RoutesRespDto(
                data,
                totalPages,
                totalElements
        );



    }

    public void addRoute(RoutePostDto routePostDto) {
        Route route = new Route();

        route.setArrivalDate(routePostDto.arrivalDate());
        route.setDepartureDate(routePostDto.departureDate());
        route.setDepartureTime(routePostDto.departureTime());
        route.setStops(routePostDto.stops());
        route.setDurationHrs(routePostDto.durHrs());
        route.setDurationMins(routePostDto.durMins());
        route.setTripType(routePostDto.tripType());

        routeRepository.save(route);


    }
}
