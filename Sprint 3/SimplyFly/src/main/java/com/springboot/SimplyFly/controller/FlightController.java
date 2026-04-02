package com.springboot.SimplyFly.controller;

import com.springboot.SimplyFly.dto.*;
import com.springboot.SimplyFly.model.Flight;
import com.springboot.SimplyFly.model.Seat;
import com.springboot.SimplyFly.service.CoPassengerService;
import com.springboot.SimplyFly.service.FlightService;
import com.springboot.SimplyFly.service.RouteService;
import com.springboot.SimplyFly.service.SeatService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

/*

seat id, passenger id ,flight id in flight_passenger
co passenger table -> passenger (many to one)

 */
import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/search")
public class FlightController {

    private final FlightService flightService;
    private final RouteService routeService;
    private final SeatService seatService;
    private final CoPassengerService coPassengerService;

    @GetMapping("/routes")
    public RoutesRespDto getRouteDetails(@RequestBody SearchByRouteSeatDto searchByRouteSeatDto,
    @RequestParam(value = "page",required = false,defaultValue = "0") int page,
    @RequestParam(value = "size",required = false,defaultValue = "5") int size
        ){
        return routeService.getRouteDetails(searchByRouteSeatDto,page,size);
    }

    @GetMapping("/flights/{routeId}")
    public FlightRespPageDto getFlightsByRouteId(@PathVariable long routeId,
                                                   @RequestParam(value = "page",required = false,defaultValue = "0") int page,
                                                   @RequestParam(value = "size",required = false,defaultValue = "5") int size){
        return flightService.getFlightsByRouteId(routeId,page,size);
    }


    @GetMapping("/seats/{flightId}")
    public List<SeatRespDto> getSeatDetailsWithFlightId(@PathVariable long flightId){
        return seatService.getSeatDetailsWithFlightId(flightId);
    }

    @GetMapping("/filter")
    public List<SearchRespDto> getFlightsByFilter(
            @RequestParam(value = "stops",required = false,defaultValue = "") String stops,
            @RequestParam(value = "deptime",required = false,defaultValue = "") String deptime,
            @RequestParam(value = "airline",required = false,defaultValue = "") String airline,
            @RequestParam(value = "minfare",required = false,defaultValue = "")String minfare,
            @RequestParam(value = "maxfare",required = false,defaultValue = "")String maxfare
            ){

        return seatService.getFlightsByFilter(stops,deptime,airline,minfare,maxfare);
    }

    @GetMapping("/flights")
    public SearchRespPageDto getFlightsForBooking(@RequestBody SearchByRouteSeatDto searchByRouteSeatDto,
                                                  @RequestParam(value = "page",required = false,defaultValue = "0") int page,
                                                    @RequestParam(value = "size",required = false,defaultValue = "5") int size){
        return seatService.getFlightsForBooking(searchByRouteSeatDto,page, size);
    }

    @PostMapping("/add/copassenger")
    public ResponseEntity<?> addCoPassenger(@RequestBody CoPassengerDto coPassengerDto, Principal principal){
        coPassengerService.addCoPassenger(coPassengerDto,principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).build();

    }


}
