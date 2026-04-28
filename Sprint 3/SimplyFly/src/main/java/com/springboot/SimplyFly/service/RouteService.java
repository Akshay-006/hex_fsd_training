package com.springboot.SimplyFly.service;

import com.springboot.SimplyFly.dto.*;
import com.springboot.SimplyFly.enums.FlightStatus;
import com.springboot.SimplyFly.exception.NoAccessException;
import com.springboot.SimplyFly.exception.ResourceNotFoundException;
import com.springboot.SimplyFly.mapper.RouteMapper;
import com.springboot.SimplyFly.model.Airport;
import com.springboot.SimplyFly.model.Flight;
import com.springboot.SimplyFly.model.Route;
import com.springboot.SimplyFly.model.User;
import com.springboot.SimplyFly.repository.AirportRepository;
import com.springboot.SimplyFly.repository.FlightRepository;
import com.springboot.SimplyFly.repository.RouteRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Comparator;
import java.util.List;

@Service
@AllArgsConstructor

public class RouteService {

    private final RouteRepository routeRepository;
    private final AirportService airportService;
    private final FlightService flightService;
    private final AirportRepository airportRepository;
    private final FlightRepository flightRepository;

//    public RoutesRespDto getRouteDetails(SearchByRouteSeatDto searchByRouteSeatDto,int page, int size) {
//
//        Pageable pageable = PageRequest.of(page,size);
//
//        Page<Route> routeList = routeRepository.getRouteWithDetails(
//                searchByRouteSeatDto.fromCode(),
//                searchByRouteSeatDto.toCode(),
//                searchByRouteSeatDto.toAirport(),
//                searchByRouteSeatDto.departureDate(),
//                pageable
//
//        );
//
//        List<RouteWithFlightSeatDto> data = routeList.toList()
//                .stream()
//                .map(RouteMapper:: mapToDto)
//                .toList();
//
//        int totalPages = routeList.getTotalPages();
//        long totalElements = routeList.getTotalElements();
//
//        return new RoutesRespDto(
//                data,
//                totalPages,
//                totalElements
//        );
//
//
//
//    }

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

    public Route getRouteById(long id){
        Route route = routeRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Route ID not found !!")
        );

        return route;
    }

    public void updateRoute(UpdatedRouteDto updatedRouteDto, long routeId) {
        Route route = getRouteById(routeId);

        if (updatedRouteDto.departureDate()!=null){
            route.setDepartureDate(updatedRouteDto.departureDate());
        }

        if (updatedRouteDto.arrivalDate()!=null){
            route.setArrivalDate(updatedRouteDto.arrivalDate());
        }

        if (updatedRouteDto.departureTime()!=null){
            route.setDepartureTime(updatedRouteDto.departureTime());
        }

        if (updatedRouteDto.durationHrs()!=-1){
            route.setDurationHrs(updatedRouteDto.durationHrs());
        }

        if(updatedRouteDto.durationMins()!=-1){
            route.setDurationMins(updatedRouteDto.durationMins());
        }

        if(updatedRouteDto.stops()!=null){
            route.setStops(updatedRouteDto.stops());
        }

        if (updatedRouteDto.tripType()!=null){
            route.setTripType(updatedRouteDto.tripType());
        }

        if (updatedRouteDto.destinationAirportId()!=-1){
            Airport destinationAirport = airportService.getAirportById(updatedRouteDto.destinationAirportId());
            route.setDestinationAirport(destinationAirport);
        }

        if(updatedRouteDto.sourceAirportId()!=-1){
            Airport sourceAirport = airportService.getAirportById(updatedRouteDto.destinationAirportId());
            route.setSourceAirport(sourceAirport);
        }

        routeRepository.save(route);

    }

    public void updateRoutev2(Long flightId, UpdRouteDto routeDto, String name) {
        Flight flight = flightService.getFlightById(flightId);

        if (!flight.getOwner().getUsername().equals(name)){
            throw new NoAccessException("U dont have access to edit !!");
        }

        Route route = flight.getRoute();
        route.setDepartureDate(routeDto.departureDate());
        route.setArrivalDate(routeDto.arrivalDate());

        flight.setStatus(FlightStatus.SCHEDULED);
        flightRepository.save(flight);

        routeRepository.save(route);
    }

    public RouteResponsePageDto getAllRoutes(int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<Route> routes = routeRepository.findAllByOrder(pageable);

        int totalPages = routes.getTotalPages();
        long totalElements = routes.getTotalElements();

        List<RouteResponseDto> routeResponseDtos =  routes.toList().stream()
                .map(RouteMapper :: toDto)
                .toList();

        return new RouteResponsePageDto(
                routeResponseDtos,
                totalPages,
                totalElements
        );
    }

    public void createRoute(RouteRequestDto dto) {
        Airport source = airportRepository.findById(dto.sourceAirportId())
                .orElseThrow(() -> new ResourceNotFoundException("Airport not found !!"));

        Airport destination = airportRepository.findById(dto.destinationAirportId())
                .orElseThrow(() -> new ResourceNotFoundException("Airport not found !!"));

        if (source.getId() == destination.getId()){
            throw new RuntimeException("Source and destination cannot be the same !!");
        }

        Route route = new Route();

        route.setSourceAirport(source);
        route.setDestinationAirport(destination);
        route.setDepartureDate(dto.departureDate());
        route.setArrivalDate(dto.arrivalDate());
        route.setDepartureTime(dto.departureTime());
        route.setDurationHrs(dto.durationHours());
        route.setDurationMins(dto.durationMins());
        route.setStops(dto.stops());
        route.setTripType(dto.tripType());

        routeRepository.save(route);
    }


    public void updateRouteAdmin(long id, RouteRequestDto dto) {

        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found !!"));

        Airport source = airportRepository.findById(dto.sourceAirportId())
                .orElseThrow(() -> new ResourceNotFoundException("Airport not found !!"));

        Airport destination = airportRepository.findById(dto.destinationAirportId())
                .orElseThrow(() -> new ResourceNotFoundException("Airport not found !!"));

        if (source.getId() == destination.getId()){
            throw new RuntimeException("Source and destination cannot be the same !!");
        }

        route.setSourceAirport(source);
        route.setDestinationAirport(destination);
        route.setDepartureDate(dto.departureDate());
        route.setArrivalDate(dto.arrivalDate());
        route.setDepartureTime(dto.departureTime());
        route.setDurationHrs(dto.durationHours());
        route.setDurationMins(dto.durationMins());
        route.setStops(dto.stops());
        route.setTripType(dto.tripType());

        routeRepository.save(route);



    }

    public void deleteRoute(long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found !!"));

        routeRepository.delete(route);

    }


}
