package com.springboot.SimplyFly.service;

import com.springboot.SimplyFly.dto.AirportPostDto;
import com.springboot.SimplyFly.dto.AirportRequestDto;
import com.springboot.SimplyFly.exception.ResourceNotFoundException;
import com.springboot.SimplyFly.model.Airport;
import com.springboot.SimplyFly.repository.AirportRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.List;

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
    public Airport getAirportById(long id){
        return airportRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Airport ID not found"));
    }


    public List<Airport> getAllAirports() {
        return airportRepository.findAll();
    }


    public void create(AirportRequestDto airportRequestDto) {
        if (airportRepository.existsByCode(airportRequestDto.code().toUpperCase())){
            throw new RuntimeException("Airport with code "+ airportRequestDto.code() + " already exists !!");
        }

        Airport airport = new Airport();
        airport.setName(airportRequestDto.name());
        airport.setCity(airportRequestDto.city());
        airport.setCode(airportRequestDto.code());

        airportRepository.save(airport);



    }

    public void updateAirport(long id, AirportRequestDto dto) {
        Airport airport = airportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Airport not found !!"));

        airport.setCode(dto.code());
        airport.setCity(dto.city());
        airport.setName(dto.name());

        airportRepository.save(airport);

    }


    public void deleteAirport(long id) {
        Airport airport = airportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Airport not found !!"));

        airportRepository.delete(airport);
    }
}
