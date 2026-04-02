package com.springboot.SimplyFly.service;

import com.springboot.SimplyFly.dto.CoPassengerDto;
import com.springboot.SimplyFly.exception.ResourceNotFoundException;
import com.springboot.SimplyFly.model.CoPassenger;
import com.springboot.SimplyFly.model.Passenger;
import com.springboot.SimplyFly.repository.CoPassengerRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor

public class CoPassengerService {

    private final CoPassengerRepository coPassengerRepository;
    private final PassengerService passengerService;

    public CoPassenger getCoPassengerById(long l) {
        CoPassenger coPassenger = coPassengerRepository.findById(l).orElseThrow(
                () -> new ResourceNotFoundException("Co Passenget id not found")
        );

        return coPassenger;
    }

    public void addCoPassenger(CoPassengerDto coPassengerDto, String username) {
        Passenger passenger = passengerService.getPassengerByUsername(username);
        CoPassenger coPassenger = new CoPassenger();

        coPassenger.setName(coPassengerDto.name());
        coPassenger.setAge(coPassengerDto.age());
        coPassenger.setPassenger(passenger);

        coPassengerRepository.save(coPassenger);

    }
}
