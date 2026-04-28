package com.springboot.SimplyFly.repository;

import com.springboot.SimplyFly.dto.BookingConfirmationDto;
import com.springboot.SimplyFly.dto.BookingStatDto;
import com.springboot.SimplyFly.model.FlightPassenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FlightPassengerRepository extends JpaRepository<FlightPassenger,Long> {
    @Query("""
    Select fp from FlightPassenger fp where fp.passenger.user.userName = ?1 order by fp.id desc
""")
    List<FlightPassenger> getBookingsForPassenger(String name);

    @Query("""
    select new com.springboot.SimplyFly.dto.BookingStatDto(count(fp.id),
    count(case when fp.bookingStatus = com.springboot.SimplyFly.enums.BookingStatus.CANCELLED and month(fp.bookingDate) = month(current_date)
    and year(fp.bookingDate) = year(current_date) then 1 end
    ),
    sum(fp.totalAmount))
    from FlightPassenger fp
    where fp.flight.owner.userName=?1
    
""")
    BookingStatDto getDashboardStats(String name);

    @Query("""
    Select fp from FlightPassenger fp where fp.passenger.id = ?1 and fp.flight.owner.userName = ?2
""")
    List<FlightPassenger> findByPassengerIdAndOwner(long id, String name);
}
