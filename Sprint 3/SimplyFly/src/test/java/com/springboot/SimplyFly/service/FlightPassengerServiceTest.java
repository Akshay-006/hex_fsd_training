package com.springboot.SimplyFly.service;

import com.springboot.SimplyFly.exception.ResourceNotFoundException;
import com.springboot.SimplyFly.model.CoPassenger;
import com.springboot.SimplyFly.model.Flight;
import com.springboot.SimplyFly.model.FlightPassenger;
import com.springboot.SimplyFly.repository.FlightPassengerRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class FlightPassengerServiceTest {

    @InjectMocks
    private FlightPassengerService flightPassengerService;

    @Mock
    private FlightPassengerRepository flightPassengerRepository;

    @Test
    public void getByIdWhenExists(){
        FlightPassenger fp = new FlightPassenger();
        fp.setId(1L);

        when(flightPassengerRepository.findById(1L)).thenReturn(Optional.of(fp));

        Assertions.assertEquals(fp,flightPassengerService.getById(1L));
    }

    @Test
    public void getByIdWhenNotExists(){
        when(flightPassengerRepository.findById(2L)).thenReturn(Optional.empty());

        Exception e = Assertions.assertThrows(ResourceNotFoundException.class,
                () -> flightPassengerService.getById(2L));

        Assertions.assertEquals("Booking Id not found",e.getMessage());
    }

    @Test
    public void getAllBookings(){
        CoPassenger co1 = new CoPassenger();
        Flight flight = new Flight();
        flight.setName("Indigo");
        co1.setName("Hi");
        FlightPassenger fp1 = new FlightPassenger();
        fp1.setId(1L);
        fp1.setCoPassenger(co1);
        fp1.setFlight(flight);


        FlightPassenger fp2 = new FlightPassenger();

        fp2.setId(2L);
        fp2.setCoPassenger(co1);
        fp2.setFlight(flight);

        List<FlightPassenger> list = List.of(fp1,fp2);

        int page = 0;
        int size = 2;

        Pageable pageable = PageRequest.of(page,size);
        Page<FlightPassenger> page1 = new PageImpl<>(list);

        when(flightPassengerRepository.findAll(pageable)).thenReturn(page1);

        Assertions.assertEquals(2,flightPassengerService.getAllBookings(0,2).data().size());

    }




}
