package com.springboot.SimplyFly.service;

import com.springboot.SimplyFly.dto.*;
import com.springboot.SimplyFly.enums.DepartureTime;
import com.springboot.SimplyFly.exception.ResourceNotFoundException;
import com.springboot.SimplyFly.mapper.FlightMapper;
import com.springboot.SimplyFly.mapper.SeatMapper;
import com.springboot.SimplyFly.model.Flight;
import com.springboot.SimplyFly.model.Passenger;
import com.springboot.SimplyFly.model.Seat;
import com.springboot.SimplyFly.repository.PassengerRepository;
import com.springboot.SimplyFly.repository.SeatRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@AllArgsConstructor

public class SeatService {

    private final SeatRepository seatRepository;
    private final PassengerRepository passengerRepository;

    public List<SeatRespDto> getSeatDetailsWithFlightId(long flightId){
        List<Seat> seatList = seatRepository.findByFlightId(flightId);
        return seatList.stream()
                .map(SeatMapper:: mapToDto)
                .toList();
    }

    public List<SearchRespDto> getFlightsByFilter(String stops, String deptime, String airline, String minfare, String maxfare) {
        if (stops.isEmpty()) stops=null;

        DepartureTime deptime1 = (!deptime.isEmpty())? DepartureTime.valueOf(deptime) : null;
        BigDecimal minfare1 = null;
        BigDecimal maxfare1 = null;
        //if (deptime.isEmpty()) deptime=null;
        if (airline.isEmpty()) airline=null;
        if (maxfare.isEmpty()) maxfare=null;

        if (maxfare==null || maxfare.isEmpty()) maxfare1 = null;
        else {
            maxfare1 = new BigDecimal(maxfare);
        }
        if (minfare==null || minfare.isEmpty()) minfare1=null;
        else{
            minfare1 = new BigDecimal(minfare);
        }

        if (stops==null && deptime==null && airline==null)
            return List.of();

        List<Flight> flightList = seatRepository.getFlightsByFilter(stops,deptime1, airline,minfare1,maxfare1);

        return flightList.stream()
                .map(FlightMapper:: mapToSearchRespDto)
                .toList();
    }

    public SearchRespPageDto getFlightsForBooking(SearchByRouteSeatDto searchByRouteSeatDto, int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<Flight> flightList = seatRepository.getFlightsForBooking(
                searchByRouteSeatDto.fromAirport(),
                searchByRouteSeatDto.toAirport(),
                searchByRouteSeatDto.departureDate(),
                searchByRouteSeatDto.neededSeats(),
                searchByRouteSeatDto.passengerAge(),
                searchByRouteSeatDto.seatClass(),
                pageable
        );

        List<SearchRespDto> data = flightList.toList()
                .stream()
                .map(FlightMapper :: mapToSearchRespDto)
                .toList();

        int totalPages = flightList.getTotalPages();
        long totalElements = flightList.getTotalElements();

        return new SearchRespPageDto(
                data,
                totalPages,
                totalElements
        );


    }

    @Transactional
    public void bookSeats(SeatBookingDto seatBookingDto) {
        List<Long> list = seatBookingDto.seatsId();

        Passenger passenger = passengerRepository.findById(seatBookingDto.pid()).orElseThrow(
                () -> new ResourceNotFoundException("Passenger Id not found")
        );
        for (Long aLong : list) {

            Seat seat = seatRepository.findById(aLong).orElseThrow(() -> new ResourceNotFoundException("Seat Id INVALID!!"));
            seat.setAvailable(false);

            seat.setPassenger(passenger);
            seatRepository.save(seat);

        }

    }


    public Seat getseatById(long id){
        Seat seat = seatRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Seat ID not found")
        );

        return seat;
    }

    public void cancelSeat(long id){
        Seat seat = getseatById(id);
        seat.setAvailable(true);
        seatRepository.save(seat);


    }

}
