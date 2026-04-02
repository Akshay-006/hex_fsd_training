package com.springboot.SimplyFly.service;

import com.springboot.SimplyFly.model.Flight;
import com.springboot.SimplyFly.repository.FlightRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class FlightServiceTest {

    @InjectMocks
    private FlightService flightService;
    @Mock
    private FlightRepository flightRepository;

    @Test
    public void getflightsByRouteIdTest(){

        Flight flight = new Flight();
        Flight flight1 = new Flight();

        //Preparing Sample Data
        flight.getRoute().setId(1L);
        flight.setFlightNumber("ATK-123");
        flight.setName("BOEING-747");

        flight1.getRoute().setId(1L);
        flight1.setFlightNumber("ATK-143");
        flight1.setName("NIMBUS-747");








    }

}
