package com.springboot.SimplyFly.controller;

import com.springboot.SimplyFly.dto.SeatResponseDto;
import com.springboot.SimplyFly.service.SeatService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/seats")
@CrossOrigin(origins = "http://localhost:5173/")

public class SeatController {

    private final SeatService seatService;

    @GetMapping("/{flightId}")
    public List<SeatResponseDto> getSeatsByFlightId(@PathVariable long flightId){
        return seatService.getSeatsByFlightId(flightId);
    }
}
