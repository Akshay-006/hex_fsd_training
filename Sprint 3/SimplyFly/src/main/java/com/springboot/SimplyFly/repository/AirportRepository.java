package com.springboot.SimplyFly.repository;

import com.springboot.SimplyFly.model.Airport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AirportRepository  extends JpaRepository<Airport,Long> {


}
