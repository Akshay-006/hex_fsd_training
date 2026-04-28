package com.springboot.SimplyFly.repository;

import com.springboot.SimplyFly.model.Passenger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PassengerRepository extends JpaRepository<Passenger,Long> {

    @Query("Select p from Passenger p where p.user.userName = ?1")
    Passenger getPassengerByUsername(String username);

    @Query("Select distinct p from Passenger p join FlightPassenger fp on fp.passenger = p where fp.flight.owner.userName = ?1")
    Page<Passenger> getPassengersByOwner(String name, Pageable pageable);
}
