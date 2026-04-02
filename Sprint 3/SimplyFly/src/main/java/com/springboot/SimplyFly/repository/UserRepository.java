package com.springboot.SimplyFly.repository;

import com.springboot.SimplyFly.enums.Role;
import com.springboot.SimplyFly.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserRepository extends JpaRepository<User,Long> {
    @Query("Select u from User u where u.userName = ?1")
    User getUsername(String username);


}
