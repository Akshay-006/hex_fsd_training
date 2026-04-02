package com.springboot.SimplyFly.model;

import com.springboot.SimplyFly.enums.Gender;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "passengers")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString

public class Passenger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private int age;

    private String email;

    @Column(name = "contact_number")
    private String contactNumber;

    @Column(length = 1000)
    private String address;


    @OneToOne
    private User user;


}
