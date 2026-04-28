package com.springboot.SimplyFly.service;

import com.springboot.SimplyFly.dto.AdminSignupDto;
import com.springboot.SimplyFly.model.Admin;
import com.springboot.SimplyFly.model.User;
import com.springboot.SimplyFly.repository.AdminRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AdminService {
    private final AdminRepository adminRepository;



}
