package com.springboot.SimplyFly.dto;

public record AdminDashboardStatsDto(
        Long totalAirports,
        Long totalRoutes,
        Long totalFlights,
        Long totalUsers,
        Long totalCancellations
) {
}
