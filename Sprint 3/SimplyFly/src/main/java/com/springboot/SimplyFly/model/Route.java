package com.springboot.SimplyFly.model;

import com.springboot.SimplyFly.enums.DepartureTime;
import com.springboot.SimplyFly.enums.TripType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.internal.util.stereotypes.ThreadSafe;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "routes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "departure_date")
    private LocalDateTime departureDate;
    @Column(name = "arrival_date")
    private LocalDateTime arrivalDate;
    @Column(name="duration_hours")
    private int durationHrs;
    @Column(name = "duration_mins")
    private int durationMins;

    private String stops;

    @Enumerated(EnumType.STRING)
    private DepartureTime departureTime;

    @Column(name = "trip_type")
    @Enumerated(EnumType.STRING)
    private TripType tripType;

    @ManyToOne
    private Airport sourceAirport;
    @ManyToOne
    private Airport destinationAirport;

}
