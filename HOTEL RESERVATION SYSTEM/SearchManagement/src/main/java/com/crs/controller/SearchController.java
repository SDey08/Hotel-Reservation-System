package com.crs.controller;

import com.crs.feign.HotelRoomClient;
import com.crs.model.dto.HotelResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/search")
public class SearchController {

    @Autowired
    private HotelRoomClient hotelRoomClient;

    public SearchController(HotelRoomClient hotelRoomClient) {
        this.hotelRoomClient = hotelRoomClient;
    }

    @GetMapping("/suggestions")
    public List<String> getSuggestions(@RequestParam String query) {
        return hotelRoomClient.getSuggestions(query);
    }

    @GetMapping
    public List<HotelResponseDto> search(@RequestParam String query) {
        return hotelRoomClient.searchHotels(query);
    }
}
