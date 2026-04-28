package com.springboot.SimplyFly.mapper;

import com.springboot.SimplyFly.dto.UserResponseDto;
import com.springboot.SimplyFly.model.User;

public class UserMapper {

    public static UserResponseDto toDto(User u){
        return new UserResponseDto(
                u.getId(),
                u.getUsername(),
                u.getRole().name(),
                u.isActive(),
                u.getCreatedAt()
        );
    }
}
