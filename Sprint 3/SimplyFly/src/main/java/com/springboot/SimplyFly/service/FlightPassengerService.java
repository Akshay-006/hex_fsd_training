package com.springboot.SimplyFly.service;

import com.springboot.SimplyFly.dto.*;
import com.springboot.SimplyFly.enums.AmountStatus;
import com.springboot.SimplyFly.enums.BookingStatus;
import com.springboot.SimplyFly.exception.NoAccessException;
import com.springboot.SimplyFly.exception.ResourceNotFoundException;
import com.springboot.SimplyFly.mapper.BookingMapper;
import com.springboot.SimplyFly.model.*;
import com.springboot.SimplyFly.repository.CoPassengerRepository;
import com.springboot.SimplyFly.repository.FlightPassengerRepository;
import com.springboot.SimplyFly.repository.FlightRepository;
import com.springboot.SimplyFly.repository.SeatRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.event.Level;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
@Slf4j

public class FlightPassengerService {

    private final FlightPassengerRepository flightPassengerRepository;
    private final SeatService seatService;
    private final FlightService flightService;
    private final CoPassengerService coPassengerService;
    private final PassengerService passengerService;
    private final SeatRepository seatRepository;
    private final FlightRepository flightRepository;
    private final CoPassengerRepository coPassengerRepository;





    public FlightPassenger getById(long id){
        FlightPassenger flightPassenger = flightPassengerRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Booking Id not found")
        );

        return flightPassenger;
    }


    public void cancelBooking(long id,String name) {
        FlightPassenger flightPassenger = getById(id);
        Passenger passenger = passengerService.getPassengerByUsername(name);


        long seatId = flightPassenger.getSeat().getId();
        seatService.cancelSeat(seatId);

        if (flightPassenger.getPassenger().getId() != passenger.getId()){
            throw new NoAccessException("U do not have access to cancel the seat");
        }


        flightPassenger.setBookingStatus(BookingStatus.CANCELLED);
        flightPassenger.setAmountStatus(AmountStatus.YET_TO_BE_REFUNDED);

        flightPassengerRepository.save(flightPassenger);
        log.atLevel(Level.WARN).log("Cancelled Booking for Passenger : " + name);

    }

//    public void initiateRefund(long bookingId) {
//        FlightPassenger flightPassenger = getById(bookingId);
//        flightPassenger.setAmountStatus(AmountStatus.REFUNDED);
//        flightPassengerRepository.save(flightPassenger);
//    }

//    public void updateBooking(long bookingId, UpdatedBookingDto updatedBookingDto) {
//        FlightPassenger flightPassenger = getById(bookingId);
//
//        if (updatedBookingDto.bookingStatus()!=null){
//            flightPassenger.setBookingStatus(updatedBookingDto.bookingStatus());
//        }
//
//        if (updatedBookingDto.amountStatus()!=null){
//            flightPassenger.setAmountStatus(updatedBookingDto.amountStatus());
//        }
//
//        if(updatedBookingDto.totalAmount()!=null){
//            flightPassenger.setTotalAmount(updatedBookingDto.totalAmount());
//        }
//
//        flightPassengerRepository.save(flightPassenger);
//
//
//    }


    public List<StatsDto> getStats(String name) {
        List <FlightPassenger> bookingsList = flightPassengerRepository.getBookingsForPassenger(name);

        StatsDto statsDto1 = new StatsDto("BOOKINGS CONFIRMED",bookingsList.stream()
                .filter(booking -> booking.getBookingStatus().equals(BookingStatus.CONFIRMED))
                .toList()
                .size());

        StatsDto statsDto2 = new StatsDto("BOOKINGS COMPLETED",bookingsList.stream()
                .filter(booking -> booking.getBookingStatus().equals(BookingStatus.COMPLETED))
                .toList()
                .size());

        StatsDto statsDto3 = new StatsDto("BOOKINGS CANCELLED",bookingsList.stream()
                .filter(booking -> booking.getBookingStatus().equals(BookingStatus.CANCELLED))
                .toList()
                .size());

        return List.of(statsDto1,statsDto2,statsDto3);
    }

//    public List<BookingRespDto> getAllBookingsForCustomer(String name) {
//
//        List<FlightPassenger> bookingsList = flightPassengerRepository.getBookingsForPassenger(name);
//
//        return bookingsList.stream()
//                .map(BookingMapper :: mapToDto)
//                .toList();
//
//    }

    public BookingPageRespDto getAllBookings(int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<FlightPassenger> bookingsList = flightPassengerRepository.findAll(pageable);

        long totalElements = bookingsList.getTotalElements();
        int totalPages = bookingsList.getTotalPages();
        List<BookingRespDto> bookingRespDtoList = bookingsList.toList().stream()
                .map(BookingMapper :: mapToDto)
                .toList();

        log.atLevel(Level.INFO).log("Retrieved All bookings !!");
        return new BookingPageRespDto(
                bookingRespDtoList,
                totalElements,
                totalPages
        );



    }

    @Transactional
    public List<BookingResponseDto> createBooking(BookingRequestDto bookingRequestDto, String name) {
        Passenger passenger = passengerService.getPassengerByUsername(name);

//        Seat seat = seatRepository.findById(bookingRequestDto.seatId())
//                .orElseThrow(() -> new ResourceNotFoundException("Seat Id not found"));



        Flight flight = flightRepository.findById(bookingRequestDto.flightId())
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));

        if (flight.getAvailableSeats() < bookingRequestDto.seatBookings().size()){
            throw new ResourceNotFoundException("Not enough seats on this Flight");
        }

        List<BookingResponseDto> responses = new ArrayList<>();

        for (SeatBookingItemDto item : bookingRequestDto.seatBookings()){

            if(item.seatId()==-1){

                if(item.coPassengerDto()!=null){
                    CoPassenger coPassenger = coPassengerService.addCoPassenger(item.coPassengerDto(),name);
                    FlightPassenger booking = new FlightPassenger();
                    booking.setFlight(flight);
                    booking.setPassenger(passenger);
                    booking.setCoPassenger(coPassenger);
                    booking.setSeat(null);
                    booking.setTotalAmount(null);
                    booking.setAmountStatus(null);

                    booking.setBookingStatus(BookingStatus.CONFIRMED);
                    FlightPassenger saved = flightPassengerRepository.save(booking);
                    responses.add(new BookingResponseDto(
                                    saved.getId(),
                                    saved.getBookingStatus(),
                                    null,
                                    null,
                                    flight.getFlightNumber(),
                                    null,
                                    -1,
                                    null

                            )

                    );
                }
                continue;

            }

            Seat seat = seatRepository.findById(item.seatId()).orElseThrow(
                    () -> new ResourceNotFoundException("Seat not found")
            );

            if (!seat.isAvailable()){
                throw new ResourceNotFoundException("Seat already booked !!");
            }

            seat.setAvailable(false);
            seatRepository.save(seat);

//            CoPassenger coPassenger = null;
//            if (item.coPassengerDto()!=null){
//                coPassenger = new CoPassenger();
//                coPassenger.setName(item.coPassengerDto().name());
//                coPassenger.setAge(item.coPassengerDto().age());
//                coPassenger.setPassenger(passenger);
//                coPassengerRepository.save(coPassenger);
//            }
            CoPassenger coPassenger = coPassengerService.addCoPassenger(item.coPassengerDto(),name);

            FlightPassenger booking = new FlightPassenger();
            booking.setFlight(flight);
            booking.setSeat(seat);
            booking.setPassenger(passenger);
            booking.setCoPassenger(coPassenger);
            booking.setTotalAmount(seat.getFare());
            booking.setBookingStatus(BookingStatus.CONFIRMED);
            booking.setAmountStatus(AmountStatus.PAID);

            FlightPassenger saved = flightPassengerRepository.save(booking);

            responses.add(new BookingResponseDto(
                    saved.getId(),
                    saved.getBookingStatus(),
                    saved.getAmountStatus(),
                    saved.getTotalAmount(),
                    flight.getFlightNumber(),
                    seat.getSeatRow(),
                    seat.getSeatcolumn(),
                    seat.getSeatClass()

                    )
            );


//
        }



        flight.setAvailableSeats(flight.getAvailableSeats()-bookingRequestDto.seatBookings().size());
        flightRepository.save(flight);
        log.atLevel(Level.INFO).log("Booking successfull for the Passenger: "+name);
        return responses;


    }

    public List<MyBookingsDto> showBookingsForPassenger(String name) {
        List<FlightPassenger> flightPassengerList = flightPassengerRepository.getBookingsForPassenger(name);

        return flightPassengerList.stream()
                .map(BookingMapper :: mapToMyBookingDto)
                .toList();
    }

    public BookingStatDto getDashboardStats(String name) {
        return flightPassengerRepository.getDashboardStats(name);
    }
}
