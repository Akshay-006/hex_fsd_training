package com.springboot.SimplyFly.service;

import com.springboot.SimplyFly.dto.*;
import com.springboot.SimplyFly.enums.*;
import com.springboot.SimplyFly.exception.NoAccessException;
import com.springboot.SimplyFly.exception.ResourceNotFoundException;
import com.springboot.SimplyFly.mapper.FlightMapper;
import com.springboot.SimplyFly.mapper.RouteMapper;
import com.springboot.SimplyFly.mapper.SeatMapper;
import com.springboot.SimplyFly.model.*;
import com.springboot.SimplyFly.repository.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.event.Level;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class FlightService {

    private final FlightRepository flightRepository;
    private final RouteRepository routeRepository;
    private final SeatRepository seatRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final AirportRepository airportRepository;
    private final CancellationRepository cancellationRepository;



    public FlightRespPageDto getFlightsByRouteId(long routeId, int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<Flight> flightList = flightRepository.getFlightsByRouteId(routeId,pageable);


        List<FlightRespDto> data = flightList.toList()
                .stream()
                .map(FlightMapper:: mapToDto)
                .toList();

        int totalPages = flightList.getTotalPages();
        long totalElements = flightList.getTotalElements();

        return new FlightRespPageDto(
                data,
                totalPages,
                totalElements
        );

    }


    public Flight getFlightById(long id){
        Flight flight = flightRepository.findById(id).orElseThrow(
                ()-> new ResourceNotFoundException("Flight Id not found")
        );

        return flight;
    }


    public List<FlightResponseDto> getFlightsByOwner(String name) {

        List<Flight> flightList = flightRepository.findByOwner(name);
        log.atLevel(Level.INFO).log("Retrieved Flights for Owner: "+name);
        return flightList.stream()
                .map(FlightMapper :: mapToRespDto)
                .toList();
    }

    public FlightResponsePageDto getAllFlights(int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<Flight> flights = flightRepository.findAllByOrder(pageable);

        List<FlightResponseAdminDto> flightResponseAdminDtos =
                flights.toList().stream()
                        .map(FlightMapper :: toDto)
                        .toList();
        log.atLevel(Level.INFO).log("Retrieved All Flights !!");
        return new FlightResponsePageDto(
                flightResponseAdminDtos,
                flights.getTotalPages(),
                flights.getTotalElements()
        );
    }


    public void generateSeats(Flight flight) {
        int rows    = flight.getSeatRows();
        int columns = flight.getSeatColumns();

        for (int row = 1; row <= rows; row++) {
            SeatClass seatClass;
            BigDecimal fare;

            // Class assignment based on row number
            if (row <= 2) {
                seatClass = SeatClass.BUSINESS_CLASS;
                fare      = new BigDecimal("15000.00");
            } else if (row <= 4) {
                seatClass = SeatClass.ECONOMY_EXTRA_LEGROOM;
                fare      = new BigDecimal("8500.00");
            } else {
                seatClass = SeatClass.ECONOMY;
                fare      = new BigDecimal("5000.00");
            }

            for (int col = 1; col <= columns; col++) {
                Seat seat = new Seat();
                seat.setSeatRow(String.valueOf(row));
                seat.setSeatcolumn(col);
                seat.setSeatClass(seatClass);
                seat.setFare(fare);
                seat.setAvailable(true);
                seat.setPassengerAge(PassengerAge.ADULT);
                seat.setFlight(flight);
                seatRepository.save(seat);
            }
        }
        log.atLevel(Level.INFO).log("Seats are generated for the flight: "+flight.getFlightNumber());
    }

    public void createFlight(FlightRequestDto dto) {
        Route route = routeRepository.findById(dto.routeId())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));

        User owner = userRepository.findById(dto.ownerId())
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        if (owner.getRole() != Role.FLIGHT_OWNER) {
            throw new RuntimeException("User is not a flight owner");
        }

        Flight flight = new Flight();
        flight.setFlightNumber(dto.flightNumber());
        flight.setName(dto.name());
        flight.setRoute(route);
        flight.setOwner(owner);
        flight.setSeatRows(dto.seatRows());
        flight.setSeatColumns(dto.seatColumns());
        flight.setAvailableSeats(dto.seatRows() * dto.seatColumns());

        flightRepository.save(flight);
        log.atLevel(Level.INFO).log("Flight Created successfully !");
        generateSeats(flight);
    }

    public void updateFlight(long id, FlightRequestDto dto) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));

        Route route = routeRepository.findById(dto.routeId())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));

        User owner = userRepository.findById(dto.ownerId())
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        flight.setFlightNumber(dto.flightNumber());
        flight.setName(dto.name());
        flight.setRoute(route);
        flight.setOwner(owner);
        flight.setStatus(FlightStatus.SCHEDULED);

        flightRepository.save(flight);
        log.atLevel(Level.INFO).log("Updated Flight: " + flight.getFlightNumber());

    }


    public void deleteFlight(long id) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));
        seatRepository.deleteByFlightId(id);
        flightRepository.delete(flight);
        log.atLevel(Level.WARN).log("Deleted Flight: "+flight.getFlightNumber());
    }

    public void markCompleted(long flightId, String name) {
        User owner = (User) userService.loadUserByUsername(name);

        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));

        if (!flight.getOwner().getUsername().equals(name)){
            throw new NoAccessException("Unauthorized !!!");
        }

        flight.setStatus(FlightStatus.COMPLETED);


        List<Seat> seats = seatRepository.findByFlightId(flightId);
        seats.forEach(seat -> seat.setAvailable(true));
        seatRepository.saveAll(seats);

        flight.setAvailableSeats(flight.getSeatRows()*flight.getSeatColumns());

        flightRepository.save(flight);
        log.atLevel(Level.INFO).log("Flight has been marked completed !!");
    }

    public AdminDashboardStatsDto getDashboardStats() {
        Long totalAirports = airportRepository.count();
        Long totalRoutes = routeRepository.count();
        Long totalFlights = flightRepository.count();
        Long totalUsers = userRepository.count();
        Long totalCancellations = cancellationRepository.count();

        return new AdminDashboardStatsDto(
                totalAirports,
                totalRoutes,
                totalFlights,
                totalUsers,
                totalCancellations
        );
    }
}
