package com.springboot.SimplyFly.model;

import com.springboot.SimplyFly.enums.FlightDesc;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;



@Entity
@Table(name="flights")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "flight_number")
    private String flightNumber;

    @Length(min = 3, max = 255, message = "Name must contain 3-255 characters")
    private String name;

    @Column(name = "seat_rows")
    private int seatRows;
    @Column(name = "seat_columns")
    private int seatColumns;

    @Column(name = "availableSeats")
    private int availableSeats;

    @Column(name = "flight_description")
    @Enumerated(EnumType.STRING)
    private FlightDesc flightDesc;

    @ManyToOne
    private Route route;









}
