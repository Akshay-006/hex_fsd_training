package com.springboot.SimplyFly.repository;

import com.springboot.SimplyFly.model.Airport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AirportRepository  extends JpaRepository<Airport,Long> {

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Airport a WHERE a.code = ?1")
    boolean existsByCode(String upperCase);
}
