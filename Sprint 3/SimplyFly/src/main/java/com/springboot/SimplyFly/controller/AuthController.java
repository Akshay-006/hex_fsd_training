package com.springboot.SimplyFly.controller;

import com.springboot.SimplyFly.dto.AdminSignupDto;
import com.springboot.SimplyFly.dto.SignUpDto;
import com.springboot.SimplyFly.dto.UserDetailsDto;
import com.springboot.SimplyFly.exception.NoAccessException;
import com.springboot.SimplyFly.model.User;
import com.springboot.SimplyFly.service.AdminService;
import com.springboot.SimplyFly.service.UserService;
import com.springboot.SimplyFly.utility.JwtUtil;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/auth")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173/")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final UserService userService;


    @GetMapping("/login")
    public ResponseEntity<?> login (Principal principal){

        String loggedInUser = principal.getName();
        User user = (User) userService.loadUserByUsername(loggedInUser);
        if (!user.isActive()) throw new NoAccessException("Account Deactivated");
        Map<String,String> map = new HashMap<>();
        map.put("token",jwtUtil.generateToken(loggedInUser));
        return ResponseEntity.status(HttpStatus.OK).body(map);

    }


    @PostMapping("/passenger/signup")
    public ResponseEntity<?> signup(@RequestBody SignUpDto signUpDto){
        userService.signup(signUpDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/admin/signup")
    public ResponseEntity<?> adminSignup(@RequestBody AdminSignupDto adminSignupDto){
        userService.adminSignup(adminSignupDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/owner/signup")
    public ResponseEntity<?> ownerSignup(@RequestBody AdminSignupDto adminSignupDto){
        userService.ownerSignup(adminSignupDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/userdetails")
    public UserDetailsDto userDetails(Principal principal){
        User user = (User) userService.loadUserByUsername(principal.getName());
        return new UserDetailsDto(
                user.getUsername(),
                user.getRole().toString()
        );
    }



}
