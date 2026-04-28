package com.springboot.SimplyFly.repository;

import com.springboot.SimplyFly.enums.CancellationStatus;
import com.springboot.SimplyFly.model.Cancellation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CancellationRepository extends JpaRepository<Cancellation,Long> {
    @Query("Select c from Cancellation c where c.booking.flight.owner.id = ?1 and c.status = 'PENDING'")
    List<Cancellation> findPendingByOwnerId(long id);

    @Query("Select c from Cancellation c where c.booking.flight.owner.id = ?1")
    List<Cancellation> findAllByOwnerId(long id);

    @Query("Select c from Cancellation c where c.status = ?1")
    Page<Cancellation> findAllByStatus(CancellationStatus cancellationStatus, Pageable pageable);
}
