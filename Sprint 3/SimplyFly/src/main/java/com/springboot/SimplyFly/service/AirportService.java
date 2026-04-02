package com.springboot.SimplyFly.service;

import com.springboot.SimplyFly.dto.AirportPostDto;
import com.springboot.SimplyFly.model.Airport;
import com.springboot.SimplyFly.repository.AirportRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AirportService {

    private final AirportRepository airportRepository;

    public void addAirport(AirportPostDto airportPostDto) {
        Airport airport = new Airport();
        airport.setCity(airportPostDto.city());
        airport.setName(airportPostDto.name());
        airportRepository.save(airport);

    }
}
