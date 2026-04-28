package com.springboot.SimplyFly.service;

import com.springboot.SimplyFly.dto.AdminSignupDto;
import com.springboot.SimplyFly.dto.SignUpDto;
import com.springboot.SimplyFly.dto.UserResponseDto;
import com.springboot.SimplyFly.dto.UserResponsePageDto;
import com.springboot.SimplyFly.enums.Role;
import com.springboot.SimplyFly.exception.NoAccessException;
import com.springboot.SimplyFly.exception.ResourceNotFoundException;
import com.springboot.SimplyFly.mapper.UserMapper;
import com.springboot.SimplyFly.model.Admin;
import com.springboot.SimplyFly.model.Passenger;
import com.springboot.SimplyFly.model.User;
import com.springboot.SimplyFly.repository.AdminRepository;
import com.springboot.SimplyFly.repository.PassengerRepository;
import com.springboot.SimplyFly.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.parameters.P;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PassengerRepository passengerRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public void insertUser(User user){
        userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.getUsername(username);
    }

    public void signup(SignUpDto signUpDto) {

        boolean exists = userRepository.existsByName(signUpDto.username());
        if (exists) throw new NoAccessException("Username already Exists !!");

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
        user.setRole(Role.PASSENGER);

        userRepository.save(user);

        passenger.setUser(user);

        passengerRepository.save(passenger);

    }

    public void adminSignup(AdminSignupDto adminSignupDto) {
        Admin admin = new Admin();
        admin.setName(adminSignupDto.name());
        admin.setEmail(adminSignupDto.email());

        User user = new User();
        user.setUserName(adminSignupDto.username());
        user.setPassword(passwordEncoder.encode(adminSignupDto.password()));
        user.setRole(Role.ADMIN);

        userRepository.save(user);

        admin.setUser(user);
        adminRepository.save(admin);

    }

    public void ownerSignup(AdminSignupDto adminSignupDto) {
        User user = new User();
        user.setUserName(adminSignupDto.username());
        user.setPassword(passwordEncoder.encode(adminSignupDto.password()));
        user.setRole(Role.FLIGHT_OWNER);
        userRepository.save(user);
    }

    public UserResponsePageDto getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<User> users = userRepository.findAll(pageable);

        List<UserResponseDto> userResponseDtos =
                users.toList()
                        .stream()
                        .map(UserMapper :: toDto)
                        .toList();

        return new UserResponsePageDto(
                userResponseDtos,
                users.getTotalPages(),
                users.getTotalElements()
        );
    }

    public UserResponsePageDto getAllUsersByRole(String role, int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<User> users = userRepository.findByRole(Role.valueOf(role),pageable);

        List<UserResponseDto> userResponseDtos =
                users.toList()
                        .stream()
                        .map(UserMapper :: toDto)
                        .toList();

        return new UserResponsePageDto(
                userResponseDtos,
                users.getTotalPages(),
                users.getTotalElements()
        );
    }

    public void toggleUserActive(long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found !!"));

        user.setActive(!user.isActive());
        userRepository.save(user);

    }
}
