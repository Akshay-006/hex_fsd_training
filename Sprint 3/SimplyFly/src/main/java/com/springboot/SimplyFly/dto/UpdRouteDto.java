package com.springboot.SimplyFly.dto;

import java.time.LocalDateTime;

public record UpdRouteDto(
        LocalDateTime departureDate,
        LocalDateTime arrivalDate
) {
}
