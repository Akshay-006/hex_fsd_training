package com.springboot.SimplyFly.service;

import com.springboot.SimplyFly.dto.BookingConfirmationDto;
import com.springboot.SimplyFly.enums.AmountStatus;
import com.springboot.SimplyFly.enums.BookingStatus;
import com.springboot.SimplyFly.exception.ResourceNotFoundException;
import com.springboot.SimplyFly.model.*;
import com.springboot.SimplyFly.repository.FlightPassengerRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@AllArgsConstructor

public class FlightPassengerService {

    private final FlightPassengerRepository flightPassengerRepository;
    private final SeatService seatService;
    private final FlightService flightService;
    private final CoPassengerService coPassengerService;
    private final PassengerService passengerService;


    public void confirmBooking(BookingConfirmationDto bookingConfirmationDto) {
      //  Seat seat = seatService.getseatById(bookingConfirmationDto.seatId());
        Flight flight = flightService.getFlightById(bookingConfirmationDto.flightId());
        Passenger passenger = passengerService.getPassengerById(bookingConfirmationDto.passengerId());
       // CoPassenger coPassenger = coPassengerService.getCoPassengerById(bookingConfirmationDto.coPassengerAndSeatMap());



        Map<Long,Long> map = bookingConfirmationDto.coPassengerAndSeatMap();

        for (Long id: map.keySet()){

            long seatId = map.get(id);


            Seat seat = seatService.getseatById(seatId);
            CoPassenger coPassenger = coPassengerService.getCoPassengerById(id);

            FlightPassenger flightPassenger = new FlightPassenger();
            flightPassenger.setFlight(flight);
            flightPassenger.setCoPassenger(coPassenger);
            flightPassenger.setSeat(seat);
            flightPassenger.setBookingStatus(bookingConfirmationDto.bookingStatus());
            flightPassenger.setAmountStatus(bookingConfirmationDto.amountStatus());
            flightPassenger.setTotalAmount(bookingConfirmationDto.totalAmount());
            flightPassenger.setPassenger(passenger);

            flightPassengerRepository.save(flightPassenger);


        }

    }


    public FlightPassenger getById(long id){
        FlightPassenger flightPassenger = flightPassengerRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Booking Id not found")
        );

        return flightPassenger;
    }


    public void cancelBooking(long id) {
        FlightPassenger flightPassenger = getById(id);


        long seatId = flightPassenger.getSeat().getId();
        seatService.cancelSeat(seatId);


        flightPassenger.setBookingStatus(BookingStatus.CANCELLED);
        flightPassenger.setAmountStatus(AmountStatus.YET_TO_BE_REFUNDED);

        flightPassengerRepository.save(flightPassenger);

    }
}
