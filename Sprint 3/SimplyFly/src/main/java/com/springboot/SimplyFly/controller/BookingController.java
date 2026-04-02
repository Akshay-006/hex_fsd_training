package com.springboot.SimplyFly.controller;

import com.springboot.SimplyFly.dto.BookingConfirmationDto;
import com.springboot.SimplyFly.dto.SeatBookingDto;
import com.springboot.SimplyFly.repository.FlightPassengerRepository;
import com.springboot.SimplyFly.service.FlightPassengerService;
import com.springboot.SimplyFly.service.SeatService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/booking")
public class BookingController {

    private final SeatService seatService;
    private final FlightPassengerService flightPassengerService;




    @PostMapping("/seats")
    public ResponseEntity<?> bookSeats(@RequestBody SeatBookingDto seatBookingDto){
        seatService.bookSeats(seatBookingDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmBooking(@RequestBody BookingConfirmationDto bookingConfirmationDto){
        flightPassengerService.confirmBooking(bookingConfirmationDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/cancel/{bookingId}")
    public ResponseEntity<?> cancelBooking(@PathVariable long bookingId){
        flightPassengerService.cancelBooking(bookingId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }


}
