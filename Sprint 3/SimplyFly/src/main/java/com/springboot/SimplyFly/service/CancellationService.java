package com.springboot.SimplyFly.service;

import com.springboot.SimplyFly.dto.CancellationRequestDto;
import com.springboot.SimplyFly.dto.CancellationResponseDto;
import com.springboot.SimplyFly.dto.CancellationResponsePageDto;
import com.springboot.SimplyFly.enums.AmountStatus;
import com.springboot.SimplyFly.enums.BookingStatus;
import com.springboot.SimplyFly.enums.CancellationStatus;
import com.springboot.SimplyFly.exception.NoAccessException;
import com.springboot.SimplyFly.exception.ResourceNotFoundException;
import com.springboot.SimplyFly.mapper.CancellationMapper;
import com.springboot.SimplyFly.model.Cancellation;
import com.springboot.SimplyFly.model.FlightPassenger;
import com.springboot.SimplyFly.model.Passenger;
import com.springboot.SimplyFly.model.User;
import com.springboot.SimplyFly.repository.CancellationRepository;
import com.springboot.SimplyFly.repository.FlightPassengerRepository;
import com.springboot.SimplyFly.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor

public class CancellationService {

    private final CancellationRepository cancellationRepository;
    private final PassengerService passengerService;
    private final UserRepository userRepository;
    private final FlightPassengerRepository flightPassengerRepository;
    private final UserService userService;

    public void requestCancellation(CancellationRequestDto requestDto, String name) {
        Passenger passenger = passengerService.getPassengerByUsername(name);
        FlightPassenger booking = flightPassengerRepository.findById(requestDto.flightPassengerId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking Not found !!"));
        if (!passenger.getUser().getUsername().equals(booking.getPassenger().getUser().getUsername())){
            throw new NoAccessException("U dont have access to cancel this ticket");
        }

        if (booking.getBookingStatus().equals(BookingStatus.CANCELLED)){
            throw new RuntimeException("Booking is already Cancelled !");
        }

        Cancellation cancellation = new Cancellation();

        cancellation.setBooking(booking);
        cancellation.setReason(requestDto.reason());
        cancellation.setStatus(CancellationStatus.PENDING);
        cancellation.setRefundAmount(booking.getTotalAmount());
        cancellationRepository.save(cancellation);

        booking.setBookingStatus(BookingStatus.CANCELLED);
        flightPassengerRepository.save(booking);



    }

    public List<CancellationResponseDto> getPendingCancellations(String name) {
        //System.out.println(name);
        User user = (User) userService.loadUserByUsername(name);
        //System.out.println(user.getId());
        List<Cancellation> cancellations = cancellationRepository.findPendingByOwnerId(user.getId());

        return cancellations.stream()
                .map(CancellationMapper :: mapToDto)
                .toList();

    }

    public void rejectCancellation(long id, String name) {
        User user = (User) userService.loadUserByUsername(name);

        Cancellation cancellation = cancellationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cancellation not found !!"));

        cancellation.setStatus(CancellationStatus.REJECTED);
        cancellation.setReviewedBy(user);
        cancellationRepository.save(cancellation);

        FlightPassenger booking = cancellation.getBooking();
        booking.getSeat().setAvailable(true);
        booking.setBookingStatus(BookingStatus.CANCELLED);
        booking.setAmountStatus(AmountStatus.NO_REFUND);
        flightPassengerRepository.save(booking);
    }

    public void approveCancellation(long id, String name) {

        User user = (User) userService.loadUserByUsername(name);

        Cancellation cancellation = cancellationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cancellation not found !!"));

        cancellation.setStatus(CancellationStatus.APPROVED);
        cancellation.setReviewedBy(user);
        cancellationRepository.save(cancellation);

        FlightPassenger booking = cancellation.getBooking();
        booking.setAmountStatus(AmountStatus.YET_TO_BE_REFUNDED);
        flightPassengerRepository.save(booking);
    }

    public List<CancellationResponseDto> getAllCancellations(String name) {
        //System.out.println(name);
        User user = (User) userService.loadUserByUsername(name);
        //System.out.println(user.getId());
        List<Cancellation> cancellations = cancellationRepository.findAllByOwnerId(user.getId());
        //cancellations.forEach(c -> System.out.println(c.getStatus()));
        return cancellations.stream()
                .map(CancellationMapper :: mapToDto)
                .toList();
    }

    public CancellationResponsePageDto getAllCancellationsForAdmin(int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<Cancellation> cancellations = cancellationRepository.findAll(pageable);

        List<CancellationResponseDto> cancellationResponseDtos =
                cancellations.toList()
                        .stream()
                        .map(CancellationMapper :: mapToDto)
                        .toList();

        return new CancellationResponsePageDto(
                cancellationResponseDtos,
                cancellations.getTotalPages(),
                cancellations.getTotalElements()
        );

    }

    public CancellationResponsePageDto getAllCancellationsByStatus(String status,int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<Cancellation> cancellations = cancellationRepository.findAllByStatus(CancellationStatus.valueOf(status),pageable);

        List<CancellationResponseDto> cancellationResponseDtos =
                cancellations.toList()
                        .stream()
                        .map(CancellationMapper :: mapToDto)
                        .toList();

        return new CancellationResponsePageDto(
                cancellationResponseDtos,
                cancellations.getTotalPages(),
                cancellations.getTotalElements()
        );

    }
}
