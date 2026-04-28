package com.springboot.SimplyFly.controller;


import com.springboot.SimplyFly.dto.*;
import com.springboot.SimplyFly.service.*;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/admin")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173/")

public class AdminController {

    private final AirportService airportService;
    private final RouteService routeService;
    private final FlightPassengerService flightPassengerService;
    private final FlightService flightService;
    private final UserService userService;
    private final CancellationService cancellationService;


    //Route Module

    @GetMapping("/routes/get-all")
    public RouteResponsePageDto getAll(
            @RequestParam(value = "page", required = false, defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "5") int size
    ){
        return routeService.getAllRoutes(page,size);
    }

    @PostMapping("/routes/create")
    public ResponseEntity<?> create(@RequestBody RouteRequestDto dto){
        routeService.createRoute(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/routes/update/{id}")
    public ResponseEntity<?> update(@PathVariable long id, @RequestBody RouteRequestDto dto){
        routeService.updateRouteAdmin(id,dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/routes/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable long id){
        routeService.deleteRoute(id);
        return ResponseEntity.status(HttpStatus.GONE).build();
    }

    //Flight module

    @GetMapping("/flights/get-all")
    public FlightResponsePageDto getAllAdmin(
            @RequestParam(value = "page", required = false,defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "5") int size
    ){
        return flightService.getAllFlights(page,size);
    }

    @PostMapping("/flights/create")
    public ResponseEntity<?> create(@RequestBody FlightRequestDto dto){
        flightService.createFlight(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/flights/update/{id}")
    public ResponseEntity<?> update(@PathVariable long id, @RequestBody FlightRequestDto dto){
        flightService.updateFlight(id,dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/flights/delete/{id}")
    public ResponseEntity<?> deleteFlight(@PathVariable long id){
        flightService.deleteFlight(id);
        return ResponseEntity.status(HttpStatus.GONE).build();
    }

    // User Module

    @GetMapping("/users/get-all")
    public UserResponsePageDto getAllUsers(
            @RequestParam(value = "page", required = false,defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "5") int size
    ){
        return userService.getAllUsers(page,size);
    }

    @GetMapping("users/role/{role}")
    public UserResponsePageDto getAllUsersByRole(
            @PathVariable String role,
            @RequestParam(value = "page", required = false,defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "5") int size
    ){
        return userService.getAllUsersByRole(role,page,size);
    }

    @PutMapping("/users/toggle/{id}")
    public ResponseEntity<?> toggle(@PathVariable long id){
        userService.toggleUserActive(id);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // Cancellation Overview

    @GetMapping("/cancellations/get-all")
    public CancellationResponsePageDto getAllCancellation(
            @RequestParam(value = "page", required = false,defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "5") int size
    ){
        return cancellationService.getAllCancellationsForAdmin(page,size);
    }

    @GetMapping("/cancellations/status/{status}")
    public CancellationResponsePageDto getAllCancellationByStatus(
            @PathVariable String status,
            @RequestParam(value = "page", required = false,defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "5") int size
    ){
        return cancellationService.getAllCancellationsByStatus(status,page,size);
    }

    @GetMapping("/dashboard/stats")
    public AdminDashboardStatsDto getDashboardStats(){
        return flightService.getDashboardStats();
    }






}
