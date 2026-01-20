package com.crs.model.service;
import java.util.List;
import com.crs.model.dto.HotelSearchResponseDTO;
import com.crs.model.dto.HotelDTO;
import com.crs.model.dto.RoomDTO;
import com.crs.model.entity.Room.RoomType;

public interface HotelRoomService {
    HotelDTO addHotel(HotelDTO hotelDTO);
    HotelDTO updateHotel(Integer hotelId, HotelDTO hotelDTO);
    void deleteHotel(Integer hotelId);
    HotelDTO getHotelById(Integer hotelId);
    List<HotelDTO> getAllHotels();

    RoomDTO addRoomToHotel(Integer hotelId, RoomDTO roomDTO);
    RoomDTO updateRoom(Integer roomId, RoomDTO roomDTO);
    void deleteRoom(Integer roomId);
    RoomDTO getRoomById(Integer roomId);
    List<RoomDTO> getRoomsByHotel(Integer hotelId);

    boolean existsByHotelId(Integer hotelId);

    List<String> getHotelSuggestions(String query);
    List<HotelSearchResponseDTO> searchHotels(String query);
    List<RoomDTO> getRoomsByHotelAndType(Integer hotelId, RoomType roomType);
}
