package com.springboot.SimplyFly.controller;


import com.springboot.SimplyFly.dto.AirportPostDto;
import com.springboot.SimplyFly.dto.RoutePostDto;
import com.springboot.SimplyFly.service.AirportService;
import com.springboot.SimplyFly.service.RouteService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/actions")
@AllArgsConstructor

public class AdminController {

    private final AirportService airportService;
    private final RouteService routeService;

    @PostMapping("/addAirport")
    public ResponseEntity<?> addAirport(@RequestBody AirportPostDto airportPostDto){
        airportService.addAirport(airportPostDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/addRoute")
    public ResponseEntity<?> addRoute(@RequestBody RoutePostDto routePostDto){
        routeService.addRoute(routePostDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


}
