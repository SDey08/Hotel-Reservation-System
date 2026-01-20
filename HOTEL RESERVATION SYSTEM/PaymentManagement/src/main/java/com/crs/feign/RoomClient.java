package com.crs.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.crs.model.dto.RoomDTO;

@FeignClient(name = "hotel-room-service",url="http://localhost:8081")
public interface RoomClient {

    @GetMapping("/rooms/{roomId}")
    RoomDTO getRoomById(@PathVariable Integer roomId);
    
}