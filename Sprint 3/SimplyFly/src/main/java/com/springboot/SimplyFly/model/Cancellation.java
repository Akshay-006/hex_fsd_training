package com.springboot.SimplyFly.model;

import com.springboot.SimplyFly.enums.CancellationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cancellations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class Cancellation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne
    @JoinColumn(name = "booking_id")
    private FlightPassenger booking;

    @CreationTimestamp
    private LocalDateTime requestedAt;

    private String reason;

    @Enumerated(EnumType.STRING)
    private CancellationStatus status;

    @UpdateTimestamp
    private LocalDateTime reviewedAt;

    @ManyToOne
    @JoinColumn (name = "reviewed_by")
    private User reviewedBy;

    private BigDecimal refundAmount;
}
