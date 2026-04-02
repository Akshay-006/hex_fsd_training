package com.springboot.SimplyFly.repository;

import com.springboot.SimplyFly.model.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PassengerRepository extends JpaRepository<Passenger,Long> {

    @Query("Select p from Passenger p where p.name = ?1")
    Passenger getPassengerByUsername(String username);
}
