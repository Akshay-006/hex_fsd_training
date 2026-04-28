package com.springboot.SimplyFly.repository;


import com.springboot.SimplyFly.dto.FlightFareDto;
import com.springboot.SimplyFly.dto.FlightSearchRespDto;
import com.springboot.SimplyFly.dto.FlightSearchResultDto;
import com.springboot.SimplyFly.enums.DepartureTime;
import com.springboot.SimplyFly.enums.PassengerAge;
import com.springboot.SimplyFly.enums.SeatClass;
import com.springboot.SimplyFly.model.Airport;
import com.springboot.SimplyFly.model.Flight;
import com.springboot.SimplyFly.model.Seat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

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
        select distinct(s1.flight) from Seat s1 where s1.flight.route.sourceAirport.code=?1
               and s1.flight.route.destinationAirport.code = ?2 and
                      DATE(s1.flight.route.departureDate) = ?3 and
                (select count(s2.id) from Seat s2 where 
                       s2.flight = s1.flight and
                              s2.seatClass=?5 and s2.isAvailable = true) >=?4
       """)

    Page<Flight> getFlightsForBooking(String fromCode, String toCode, LocalDate date, int neededSeats, SeatClass seatClass, Pageable pageable);

//    @Query("""
//        select distinct new com.springboot.SimplyFly.dto.FlightFareDto(select min(s3.fare) from Seat s3,s.flight) from Seat s where s.flight.route.sourceAirport.code=?1
//               and s.flight.route.destinationAirport.code = ?2 and
//                      DATE(s.flight.route.departureDate) = ?3 and
//                (select count(s.id) from Seat s where s.seatClass=?5) >=?4
//       """)

    //Page<FlightFareDto> getFlightsForBookingv1(String fromCode, String toCode, LocalDate date, int neededSeats, SeatClass seatClass, Pageable pageable);

    @Query("""
    SELECT new com.springboot.SimplyFly.dto.FlightSearchResultDto(
        s1.flight.id,
        s1.flight.flightNumber,
        s1.flight.name,
        s1.flight.flightDesc,
        s1.flight.availableSeats,
        s1.flight.route.durationHrs,
        s1.flight.route.durationMins,
        s1.flight.route.stops,
        s1.flight.route.tripType,
        s1.flight.route.departureTime,
        s1.flight.route.departureDate,
        s1.flight.route.arrivalDate,
        s1.flight.route.sourceAirport.code,
        s1.flight.route.sourceAirport.city,
        s1.flight.route.destinationAirport.code,
        s1.flight.route.destinationAirport.city,
        (SELECT MIN(s2.fare) FROM Seat s2
            WHERE s2.flight = s1.flight
            AND s2.seatClass = ?5
            AND s2.isAvailable = true)
    )
    FROM Seat s1
    WHERE s1.flight.route.sourceAirport.code = ?1
      AND s1.flight.route.destinationAirport.code = ?2
      AND DATE(s1.flight.route.departureDate) = ?3
      AND (SELECT COUNT(s3.id) FROM Seat s3
               WHERE s3.flight = s1.flight
               AND s3.seatClass = ?5
               AND s3.isAvailable = true) >= ?4
    GROUP BY s1.flight
""")
    Page<FlightSearchResultDto> getFlightsForBookingv2(
            String fromCode,
            String toCode,
            LocalDate date,
            int neededSeats,
            SeatClass seatClass,
            Pageable pageable
    );

    @Modifying
    @Transactional
    @Query("Delete from Seat s where s.flight.id = ?1")
    void deleteByFlightId(long id);
}
