package com.springboot.SimplyFly.controller;

import com.springboot.SimplyFly.dto.PassengerDetailDto;
import com.springboot.SimplyFly.dto.PassengerPageDto;
import com.springboot.SimplyFly.dto.PassengerSummaryDto;
import com.springboot.SimplyFly.dto.PassengerSummaryPageDto;
import com.springboot.SimplyFly.service.PassengerService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/passenger")
@CrossOrigin(origins = "http://localhost:5173")

public class PassengerController {

    private final PassengerService passengerService;

    @GetMapping("/get-all")
    public PassengerPageDto getAllPassengers(
            @RequestParam(value = "page",required = false,defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "5") int size
    ){
        return passengerService.getAllPassengers(page,size);
    }

    @GetMapping("/owner/get-all")
    private PassengerSummaryPageDto getPassengersByOwner(Principal principal,
                                                         @RequestParam(value = "page",required = false,defaultValue = "0") int page,
                                                         @RequestParam(value = "size", required = false, defaultValue = "5") int size){
        return passengerService.getPassengersByOwner(principal.getName(),page,size);
    }

    @GetMapping("/{passengerId}")
    public PassengerDetailDto getPassengerDetails(@PathVariable long passengerId, Principal principal){
        return  passengerService.getPassengerDetails(passengerId,principal.getName());
    }
}
