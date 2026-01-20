package com.crs.feign;

import com.crs.model.dto.HotelResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "hotel-room-management", url = "http://localhost:8081")
public interface HotelRoomClient {

    @GetMapping("hotelmanager/hotels/suggestions")
    List<String> getSuggestions(@RequestParam String query);

    @GetMapping("hotelmanager/hotels/search")
    List<HotelResponseDto> searchHotels(@RequestParam String query);
}

