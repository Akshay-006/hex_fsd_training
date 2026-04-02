package com.springboot.SimplyFly.dto;

import com.springboot.SimplyFly.enums.Gender;
import com.springboot.SimplyFly.enums.Role;

public record SignUpDto(
        String username,
        String password,
        String name,
        Gender gender,
        int age,
        String contact,
        String email,
        String address

) {
}
