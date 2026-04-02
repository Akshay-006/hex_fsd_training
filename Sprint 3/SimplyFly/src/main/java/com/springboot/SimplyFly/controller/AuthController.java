package com.springboot.SimplyFly.controller;

import com.springboot.SimplyFly.dto.SignUpDto;
import com.springboot.SimplyFly.service.UserService;
import com.springboot.SimplyFly.utility.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/auth")
@AllArgsConstructor
public class AuthController {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    @GetMapping("/login")
    public ResponseEntity<?> login (Principal principal){

        String loggedInUser = principal.getName();
        Map<String,String> map = new HashMap<>();
        map.put("token",jwtUtil.generateToken(loggedInUser));
        return ResponseEntity.status(HttpStatus.OK).body(map);

    }


    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignUpDto signUpDto){
        userService.signup(signUpDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }



}
