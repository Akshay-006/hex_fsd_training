package com.springboot.SimplyFly.model;

import com.springboot.SimplyFly.enums.AmountStatus;
import com.springboot.SimplyFly.enums.BookingStatus;
import com.springboot.SimplyFly.enums.Status;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "flight_passenger")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString

public class FlightPassenger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Enumerated(EnumType.STRING)
    private BookingStatus bookingStatus;

    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    private AmountStatus amountStatus;

    @OneToOne
    CoPassenger coPassenger;

    @ManyToOne
    Passenger passenger;

    @ManyToOne
    Seat seat;

    @ManyToOne
    Flight flight;




}
