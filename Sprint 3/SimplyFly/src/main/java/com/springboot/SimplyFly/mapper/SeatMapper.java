package com.springboot.SimplyFly.mapper;

import com.springboot.SimplyFly.dto.SeatRespDto;
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


}
