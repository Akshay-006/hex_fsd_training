package com.springboot.SimplyFly.model;

import com.springboot.SimplyFly.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "tickets")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString

public class Ticket {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "ticket_status")
    @Enumerated(EnumType.STRING)
    private BookingStatus bookingStatus;

    @Column(name = "booking_date")
    @CreationTimestamp
    private Instant bookingDate;

    @Column(name = "cancellation_date")
    @UpdateTimestamp
    private Instant cancellationDate;

    @Column(name = "total_fare")
    private BigDecimal totalFare;



}
