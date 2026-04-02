package com.springboot.SimplyFly.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "co_passengers")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString

public class CoPassenger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    private int age;




    @ManyToOne
    private Passenger passenger;


}
