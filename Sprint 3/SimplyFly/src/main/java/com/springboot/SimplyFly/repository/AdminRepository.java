package com.springboot.SimplyFly.repository;

import com.springboot.SimplyFly.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin,Long> {
}
