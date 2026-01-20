package com.crs.feign;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.crs.model.dto.RoomDto;
import com.crs.model.entity.Reservation.RoomType;

@FeignClient(name = "hotel-room-service", url = "http://localhost:8081")
public interface HotelClient {

    @GetMapping("/hotelmanager/rooms/hotel/{hotelId}/type/{roomType}")
    List<RoomDto> getRoomsByHotelAndType(
            @PathVariable("hotelId") Integer hotelId,
            @PathVariable("roomType") RoomType roomType
    );
}