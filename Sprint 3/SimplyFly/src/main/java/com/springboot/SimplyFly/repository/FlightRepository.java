package com.springboot.SimplyFly.repository;

import com.springboot.SimplyFly.enums.DepartureTime;
import com.springboot.SimplyFly.enums.PassengerAge;
import com.springboot.SimplyFly.enums.SeatClass;
import com.springboot.SimplyFly.model.Flight;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface FlightRepository extends JpaRepository<Flight,Long> {

    @Query("""
            select f from Flight f where f.route.sourceAirport.city=?1 and
                f.route.sourceAirport.name = ?2 and
                f.route.destinationAirport.city = ?3 and
                f.route.destinationAirport.name = ?4 and
                f.route.departureDate = ?5 and
                f.availableSeats > ?6
            """)
    List<Flight> getRouteDetails(String fromLoc, String fromAir, String toLoc, String toAir, LocalDate localDate, int neededSeat);

    @Query("Select f from Flight f where f.route.id = ?1")
    Page<Flight> getFlightsByRouteId(long routeId, Pageable pageable);

    @Query("Select f from Flight f where f.owner.userName = ?1")
    List<Flight> findByOwner(String name);

    @Query("Select f from Flight f order by f.id desc")
    Page<Flight> findAllByOrder(Pageable pageable);

    /*@Query("""
        select f from Flight f where
                (?1 is null or f.route.stops=?1) and 
                        (?2 is null or f.route.departureTime=?2) and
                                (?3 is null or f.name = ?3)""")
    List<Flight> getFlightsByFilter(String stops, DepartureTime deptime, String airline);
    */

}
