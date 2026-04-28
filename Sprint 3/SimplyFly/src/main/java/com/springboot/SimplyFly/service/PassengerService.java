package com.springboot.SimplyFly.service;

import com.springboot.SimplyFly.dto.*;
import com.springboot.SimplyFly.exception.ResourceNotFoundException;
import com.springboot.SimplyFly.mapper.PassengerMapper;
import com.springboot.SimplyFly.model.FlightPassenger;
import com.springboot.SimplyFly.model.Passenger;
import com.springboot.SimplyFly.repository.FlightPassengerRepository;
import com.springboot.SimplyFly.repository.PassengerRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@AllArgsConstructor


public class PassengerService {

    private final PassengerRepository passengerRepository;
    private  final FlightPassengerRepository flightPassengerRepository;

    public Passenger getPassengerById(long id){
        Passenger passenger = passengerRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Passenger Id not found !!")
        );

        return passenger;


    }


    public Passenger getPassengerByUsername(String username) {
        return passengerRepository.getPassengerByUsername(username);

    }

    public PassengerPageDto getAllPassengers(int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<Passenger> passengerPage = passengerRepository.findAll(pageable);

        List<PassengerRespDto> passengerRespDtos = passengerPage.toList()
                .stream()
                .map(PassengerMapper :: mapToDto)
                .toList();

        long totalElements = passengerPage.getTotalElements();
        int totalPages = passengerPage.getTotalPages();
        return new PassengerPageDto(
                passengerRespDtos,
                totalElements,
                totalPages
        );

    }

    public PassengerSummaryPageDto getPassengersByOwner(String name, int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page <Passenger> passengerPage = passengerRepository.getPassengersByOwner(name,pageable);
        int totalPages = passengerPage.getTotalPages();
        long totalElements = passengerPage.getTotalElements();

        List<PassengerSummaryDto> passengerList = passengerPage.toList()
                .stream()
                .map(p -> {
                            List<FlightPassenger> bookings = flightPassengerRepository
                                    .findByPassengerIdAndOwner(p.getId(), name);

                            BigDecimal totalSpent = bookings.stream()
                                    .filter(fp -> fp.getTotalAmount() != null)
                                    .map(FlightPassenger::getTotalAmount)
                                    .reduce(BigDecimal.ZERO, BigDecimal::add);

                            return new PassengerSummaryDto(
                                    p.getId(),
                                    p.getName(),
                                    p.getAge(),
                                    p.getGender(),
                                    p.getEmail(),
                                    p.getContactNumber(),
                                    (long) bookings.size(),
                                    totalSpent
                            );
                        }
                )
                .toList();

        return new PassengerSummaryPageDto(
                passengerList,
                totalPages,
                totalElements
        );




     }

    public PassengerDetailDto getPassengerDetails(long passengerId, String name) {
        Passenger passenger = passengerRepository.findById(passengerId)
                .orElseThrow(() -> new ResourceNotFoundException("Passenger Not found !!"));

        List<FlightPassenger> bookings = flightPassengerRepository.findByPassengerIdAndOwner(passengerId,name);

        List<PassengerBookingDto> bookingDtos = PassengerMapper.mapToBookingDto(bookings);

        return new PassengerDetailDto(
                passengerId,
                passenger.getName(),
                passenger.getAge(),
                passenger.getGender(),
                passenger.getEmail(),
                passenger.getContactNumber(),
                passenger.getAddress(),
                bookingDtos
        );
    }
}
