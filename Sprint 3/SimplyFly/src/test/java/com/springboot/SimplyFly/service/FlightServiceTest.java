package com.springboot.SimplyFly.service;

import com.springboot.SimplyFly.dto.FlightResponseDto;
import com.springboot.SimplyFly.enums.FlightDesc;
import com.springboot.SimplyFly.enums.FlightStatus;
import com.springboot.SimplyFly.exception.ResourceNotFoundException;
import com.springboot.SimplyFly.mapper.FlightMapper;
import com.springboot.SimplyFly.model.Airport;
import com.springboot.SimplyFly.model.Flight;
import com.springboot.SimplyFly.model.Route;
import com.springboot.SimplyFly.repository.FlightRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class FlightServiceTest {

    @InjectMocks
    private FlightService flightService;
    @Mock
    private FlightRepository flightRepository;

    @Test
    public void getflightsByIdTestWhenExists(){


        //Checking whether flightService is null
        Assertions.assertNotNull(flightService);
        Flight flight = new Flight();
        Route route = new Route();
        route.setId(1L);
        route.setStops("Non-stop");

        //Preparing Sample Data


        flight.setFlightNumber("ATK-123");
        flight.setName("BOEING-747");
        flight.setSeatRows(6);
        flight.setSeatColumns(7);
        flight.setAvailableSeats(42);
        flight.setStatus(FlightStatus.COMPLETED);
        flight.setFlightDesc(FlightDesc.CHEAPEST);
        flight.setRoute(route);

        Flight flight1 = new Flight();
        flight1.setId(2L);
        flight1.setFlightNumber("AKT-123");
        flight1.setName("BOEING-898");
        flight1.setSeatRows(6);
        flight1.setSeatColumns(7);
        flight1.setAvailableSeats(42);
        flight1.setStatus(FlightStatus.COMPLETED);
        flight1.setFlightDesc(FlightDesc.CHEAPEST);
        flight1.setRoute(route);


        // this is a simulation where when findyById is called it must return flight
        when(flightRepository.findById(1L)).thenReturn(Optional.of(flight));

        //Checking whether getById(1L) gives Flight
        Assertions.assertEquals(flight,flightService.getFlightById(1L));
        Assertions.assertNotEquals(flight1,flightService.getFlightById(1L));

    }

    @Test
    public void getFLightByIdWhenNotExists(){
        when(flightRepository.findById(4L)).thenReturn(Optional.empty());

        Exception e = Assertions.assertThrows(ResourceNotFoundException.class,
                () -> flightService.getFlightById(4L));

        Assertions.assertEquals("Flight Id not found",e.getMessage());

    }

    @Test
    public void getFlightsByOwnerTest(){

        Airport airport = new Airport();
        airport.setCode("BOM");
        airport.setCity("Mumbai");
        airport.setId(1L);
        airport.setName("Chatrapathi Shivaji Intl");

        Airport airport1 = new Airport();
        airport1.setCode("MAA");
        airport1.setCity("Chennai");
        airport1.setId(2L);
        airport1.setName("MA Chidambaram Intl");


        Flight flight = new Flight();
        Route route = new Route();
        route.setId(1L);
        route.setStops("Non-stop");
        route.setSourceAirport(airport1);
        route.setDestinationAirport(airport);
        route.setDepartureDate(LocalDateTime.now());
        route.setArrivalDate(LocalDateTime.now());

        //Preparing Sample Data


        flight.setFlightNumber("ATK-123");
        flight.setName("BOEING-747");
        flight.setSeatRows(6);
        flight.setSeatColumns(7);
        flight.setAvailableSeats(42);
        flight.setStatus(FlightStatus.COMPLETED);
        flight.setFlightDesc(FlightDesc.CHEAPEST);
        flight.setRoute(route);

        Flight flight1 = new Flight();
        flight1.setId(2L);
        flight1.setFlightNumber("AKT-123");
        flight1.setName("BOEING-898");
        flight1.setSeatRows(6);
        flight1.setSeatColumns(7);
        flight1.setAvailableSeats(42);
        flight1.setStatus(FlightStatus.COMPLETED);
        flight1.setFlightDesc(FlightDesc.CHEAPEST);
        flight1.setRoute(route);


        FlightResponseDto dto = FlightMapper.mapToRespDto(flight);
        FlightResponseDto dto1 = FlightMapper.mapToRespDto(flight1);
        List<Flight> list1 = List.of(flight,flight1);
        List<FlightResponseDto> list = List.of(dto,dto1);

        when(flightRepository.findByOwner("Akshay")).thenReturn(list1);

        Assertions.assertEquals(list,flightService.getFlightsByOwner("Akshay"));

    }

    @Test
    public void getAllFlights(){
        Flight flight = new Flight();
        Route route = new Route();
        route.setId(1L);
        route.setStops("Non-stop");
        Airport airport = new Airport();
        airport.setCode("BOM");
        airport.setCity("Mumbai");
        airport.setId(1L);
        airport.setName("Chatrapathi Shivaji Intl");


        Airport airport1 = new Airport();
        airport1.setCode("MAA");
        airport1.setCity("Chennai");
        airport1.setId(2L);
        airport1.setName("MA Chidambaram Intl");

        route.setSourceAirport(airport);
        route.setDestinationAirport(airport1);
        route.setArrivalDate(LocalDateTime.now());
        route.setDepartureDate(LocalDateTime.now());

        //Preparing Sample Data
        flight.setId(1L);
        flight.setFlightNumber("ATK-123");
        flight.setName("BOEING-747");
        flight.setSeatRows(6);
        flight.setSeatColumns(7);
        flight.setAvailableSeats(42);
        flight.setStatus(FlightStatus.COMPLETED);
        flight.setFlightDesc(FlightDesc.CHEAPEST);
        flight.setRoute(route);

        Flight flight1 = new Flight();
        flight1.setId(2L);
        flight1.setFlightNumber("AKT-123");
        flight1.setName("BOEING-898");
        flight1.setSeatRows(6);
        flight1.setSeatColumns(7);
        flight1.setAvailableSeats(42);
        flight1.setStatus(FlightStatus.COMPLETED);
        flight1.setFlightDesc(FlightDesc.CHEAPEST);
        flight1.setRoute(route);

        List<Flight> list = List.of(flight,flight1);

        Page<Flight> page = new PageImpl<>(list);
        Page<Flight> page1 = new PageImpl<>(list.subList(0,1));
        int pag = 0;
        int size = 2;

        Pageable pageable = PageRequest.of(pag,size);
        Pageable pageable1 = PageRequest.of(pag,1);

        //when(flightRepository.findAllByOrder(pageable)).thenReturn(page);
        when(flightRepository.findAllByOrder(pageable1)).thenReturn(page1);



        //Assertions.assertEquals(2,flightService.getAllFlights(0,2).data().size());
        Assertions.assertEquals(1,flightService.getAllFlights(0,1).data().size());


    }






}
