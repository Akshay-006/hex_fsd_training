package com.springboot.SimplyFly.controller;

import com.springboot.SimplyFly.dto.AirportRequestDto;
import com.springboot.SimplyFly.model.Airport;
import com.springboot.SimplyFly.service.AirportService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/airport")
@CrossOrigin(origins = "http://localhost:5173/")

public class AirportController {

    private final AirportService airportService;

    @GetMapping("/get-all")
    public List<Airport> getAllAirports(){
        return airportService.getAllAirports();
    }

    @PostMapping("/admin/create")
    public ResponseEntity<?> create(@RequestBody AirportRequestDto airportRequestDto){
        airportService.create(airportRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/admin/update/{id}")
    public ResponseEntity<?> update(@PathVariable long id, @RequestBody AirportRequestDto dto){
        airportService.updateAirport(id,dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable long id){
        airportService.deleteAirport(id);
        return ResponseEntity.status(HttpStatus.GONE).build();
    }



}
