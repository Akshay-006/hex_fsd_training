package com.springboot.SimplyFly.repository;

import com.springboot.SimplyFly.dto.BookingConfirmationDto;
import com.springboot.SimplyFly.model.FlightPassenger;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FlightPassengerRepository extends JpaRepository<FlightPassenger,Long> {

}
