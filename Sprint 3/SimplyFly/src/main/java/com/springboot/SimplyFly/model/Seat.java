package com.springboot.SimplyFly.model;

import com.springboot.SimplyFly.enums.PassengerAge;
import com.springboot.SimplyFly.enums.SeatClass;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "seats")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "seat_row")
    private String seatRow;
    @Column(name = "seat_column")
    private int seatcolumn;

    @Column(name = "seat_class")
    @Enumerated(EnumType.STRING)
    private SeatClass seatClass;
    @Column(name = "passenger_age")
    @Enumerated(EnumType.STRING)
    private PassengerAge passengerAge;


    private BigDecimal fare;

    @Column(name = "is_available")
    private boolean isAvailable;

    @ManyToOne
    private Flight flight;

    @ManyToOne
    @JoinColumn(name = "ticket_id")
    private Ticket ticket;

    @ManyToOne
    private Passenger passenger;




}
