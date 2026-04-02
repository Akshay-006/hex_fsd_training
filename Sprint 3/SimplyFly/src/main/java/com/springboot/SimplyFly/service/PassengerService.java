package com.springboot.SimplyFly.service;

import com.springboot.SimplyFly.exception.ResourceNotFoundException;
import com.springboot.SimplyFly.model.Passenger;
import com.springboot.SimplyFly.repository.PassengerRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor


public class PassengerService {

    private final PassengerRepository passengerRepository;

    public Passenger getPassengerById(long id){
        Passenger passenger = passengerRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Passenger Id not found !!")
        );

        return passenger;


    }


    public Passenger getPassengerByUsername(String username) {
        return passengerRepository.getPassengerByUsername(username);

    }
}
