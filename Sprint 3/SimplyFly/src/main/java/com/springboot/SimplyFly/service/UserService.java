package com.springboot.SimplyFly.service;

import com.springboot.SimplyFly.dto.SignUpDto;
import com.springboot.SimplyFly.enums.Role;
import com.springboot.SimplyFly.model.Passenger;
import com.springboot.SimplyFly.model.User;
import com.springboot.SimplyFly.repository.PassengerRepository;
import com.springboot.SimplyFly.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PassengerRepository passengerRepository;
    private final PasswordEncoder passwordEncoder;

    public void insertUser(User user){
        userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.getUsername(username);
    }

    public void signup(SignUpDto signUpDto) {
        Passenger passenger = new Passenger();
        passenger.setName(signUpDto.name());
        passenger.setAge(signUpDto.age());
        passenger.setAddress(signUpDto.address());
        passenger.setEmail(signUpDto.email());
        passenger.setGender(signUpDto.gender());
        passenger.setContactNumber(signUpDto.contact());


        User user = new User();
        user.setUserName(signUpDto.username());
        user.setPassword(passwordEncoder.encode(signUpDto.password()));
        user.setRole(Role.USER);

        userRepository.save(user);

        passenger.setUser(user);

        passengerRepository.save(passenger);

    }
}
