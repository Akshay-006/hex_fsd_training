package com.springboot.SimplyFly.mapper;

import com.springboot.SimplyFly.dto.SeatRespDto;
import com.springboot.SimplyFly.dto.SeatResponseDto;
import com.springboot.SimplyFly.model.Seat;

public class SeatMapper {

    public static SeatRespDto mapToDto(Seat seat){
        return new SeatRespDto(
                seat.getSeatRow(),
                seat.getSeatcolumn(),
                seat.getFare(),
                seat.getPassengerAge(),
                seat.getSeatClass(),
                seat.isAvailable()
        );
    }

    public static SeatResponseDto mapToSeatDto(Seat seat){
        return new SeatResponseDto(
                seat.getId(),
                seat.getSeatRow(),
                seat.getSeatcolumn(),
                seat.getSeatClass(),
                seat.getFare(),
                seat.isAvailable(),
                seat.getPassengerAge()
        );
    }


}
