package com.springboot.SimplyFly.repository;

import com.springboot.SimplyFly.model.Route;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface RouteRepository extends JpaRepository<Route,Long> {

    @Query("""
        select r from Route r where r.sourceAirport.city = ?1 and
             r.sourceAirport.name = ?2 and
             r.destinationAirport.city = ?3 and
             r.destinationAirport.name = ?4 and
             r.departureDate = ?5
     """)
    Page<Route> getRouteWithDetails(String s, String s1, String location, String airport, LocalDateTime localDate, Pageable pageable);
}
