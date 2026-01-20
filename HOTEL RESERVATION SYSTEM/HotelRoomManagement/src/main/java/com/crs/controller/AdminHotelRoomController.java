package com.crs.controller;
import com.crs.model.dto.HotelDTO;
import com.crs.model.dto.HotelSearchResponseDTO;
import com.crs.model.dto.RoomDTO;
import com.crs.model.entity.Room;
import com.crs.model.service.HotelRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/hotelmanager")
public class AdminHotelRoomController {

    @Autowired
    private HotelRoomService hotelRoomService;

    @GetMapping("/hotels")
    public List<HotelDTO> getAllHotels() {
        return hotelRoomService.getAllHotels();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/auth/hotels")
    public ResponseEntity<?> addHotel(@RequestBody HotelDTO hotelDTO) {
        return ResponseEntity.ok(hotelRoomService.addHotel(hotelDTO));
    }

    @GetMapping("/hotels/{id}")
    public HotelDTO getHotelById(@PathVariable Integer id) {
        return hotelRoomService.getHotelById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/auth/hotels/{id}")
    public ResponseEntity<?> updateHotel(@PathVariable Integer id,
                                         @RequestBody HotelDTO hotelDTO) {
        HotelDTO updatedHotel = hotelRoomService.updateHotel(id, hotelDTO);
        return ResponseEntity.ok(updatedHotel);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/auth/hotels/{id}")
    public void deleteHotel(@PathVariable Integer id) {
        hotelRoomService.deleteHotel(id);
    }


    @GetMapping("/exists/{hotelId}") 
    public ResponseEntity<Boolean> existsHotelById(@PathVariable int hotelId) {
        boolean exists = hotelRoomService.existsByHotelId(hotelId);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/rooms/hotel/{hotelId}")
    public List<RoomDTO> getRoomsByHotel(@PathVariable Integer hotelId) {
        System.out.println("Fetching rooms for hotel ID: " + hotelId);
        return hotelRoomService.getRoomsByHotel(hotelId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/auth/rooms/hotel/{hotelId}")
    public ResponseEntity<?> addRoomToHotel(@PathVariable Integer hotelId,
                                            @RequestBody RoomDTO roomDTO) {
        existsHotelById(hotelId);
        return ResponseEntity.ok(hotelRoomService.addRoomToHotel(hotelId, roomDTO));
    }

    @GetMapping("/rooms/{roomId}") 
    public RoomDTO getRoomById(@PathVariable Integer roomId) {
        return hotelRoomService.getRoomById(roomId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/auth/rooms/{roomId}")
    public ResponseEntity<?> updateRoom(@PathVariable Integer roomId,
                                        @RequestBody RoomDTO roomDTO) {
        RoomDTO updatedRoom = hotelRoomService.updateRoom(roomId, roomDTO);
        return ResponseEntity.ok(updatedRoom);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/auth/rooms/{roomId}")
    public void deleteRoom(@PathVariable Integer roomId) {
        hotelRoomService.deleteRoom(roomId);
    }

    // Public Search APIs (no role required)
    @GetMapping("/hotels/suggestions")
    public List<String> getHotelSuggestions(@RequestParam String query) {
        return hotelRoomService.getHotelSuggestions(query);
    }

    @GetMapping("/hotels/search")
    public List<HotelSearchResponseDTO> searchHotels(@RequestParam String query) {
        return hotelRoomService.searchHotels(query);
    }

    @GetMapping("/rooms/hotel/{hotelId}/type/{roomType}") 
    public List<RoomDTO> getRoomsByHotelAndType(@PathVariable Integer hotelId,
                                                @PathVariable Room.RoomType roomType) {
        return hotelRoomService.getRoomsByHotelAndType(hotelId, roomType);
    }
}
