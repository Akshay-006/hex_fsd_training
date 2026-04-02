package com.springboot.SimplyFly.repository;


import com.springboot.SimplyFly.enums.DepartureTime;
import com.springboot.SimplyFly.enums.PassengerAge;
import com.springboot.SimplyFly.enums.SeatClass;
import com.springboot.SimplyFly.model.Airport;
import com.springboot.SimplyFly.model.Flight;
import com.springboot.SimplyFly.model.Seat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface SeatRepository extends JpaRepository<Seat,Long> {

    @Query("select s from Seat s where s.flight.id = ?1")
    List<Seat> findByFlightId(long flightId);


    @Query("""
                  select distinct (s.flight) from Seat s where
                  (?1 is null or s.flight.route.stops=?1) and
                  (?2 is null or s.flight.route.departureTime=?2) and
                  (?3 is null or s.flight.name=?3) and
                  (?4 is null or s.fare>=?4) and
                  (?5 is null or s.fare<=?5)""")
    List<Flight> getFlightsByFilter(String stops, DepartureTime deptime1, String airline, BigDecimal minfare, BigDecimal maxfare);


    @Query("""
        select distinct(s.flight) from Seat s where s.flight.route.sourceAirport.name=?1 
               and s.flight.route.destinationAirport.name = ?2 and
                      s.flight.route.departureDate = ?3 and
                (select count(s.id) from Seat s where s.passengerAge = ?5
                        and s.seatClass=?6) >=?4
       """)
    Page<Flight> getFlightsForBooking(String fromAirport, String toAirport, LocalDateTime date, int neededSeats, PassengerAge passengerAge, SeatClass seatClass, Pageable pageable);
}
