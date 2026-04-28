package com.springboot.SimplyFly.controller;

import com.springboot.SimplyFly.dto.*;
import com.springboot.SimplyFly.repository.FlightPassengerRepository;
import com.springboot.SimplyFly.service.FlightPassengerService;
import com.springboot.SimplyFly.service.SeatService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/booking")
@CrossOrigin(origins = "http://localhost:5173/")
public class BookingController {

    private final SeatService seatService;
    private final FlightPassengerService flightPassengerService;

    @GetMapping("/get-all")
    public BookingPageRespDto getAllBookings(
            @RequestParam (value = "page", required = false,defaultValue = "0")int page,
            @RequestParam(value = "size",required = false,defaultValue = "5")int size){
        return flightPassengerService.getAllBookings(page,size);
    }


    @PostMapping("/cancel/{bookingId}")
    public ResponseEntity<?> cancelBooking(@PathVariable long bookingId, Principal principal){
        flightPassengerService.cancelBooking(bookingId,principal.getName());
        return ResponseEntity.status(HttpStatus.OK).build();
    }

//    @GetMapping("/stats")
//    public List<StatsDto> getStats(Principal principal){
//        return flightPassengerService.getStats(principal.getName());
//    }

    @PostMapping("/create")
    public List<BookingResponseDto> createBooking(@RequestBody BookingRequestDto bookingRequestDto, Principal principal){
        return flightPassengerService.createBooking(bookingRequestDto,principal.getName());
    }

    @GetMapping("/passenger")
    public List<MyBookingsDto> showBookingsForPassenger(Principal principal){
        return flightPassengerService.showBookingsForPassenger(principal.getName());
    }

    @GetMapping("/dashboard/stats")
    public BookingStatDto getDashboardStats(Principal principal){
        return flightPassengerService.getDashboardStats(principal.getName());
    }

}
