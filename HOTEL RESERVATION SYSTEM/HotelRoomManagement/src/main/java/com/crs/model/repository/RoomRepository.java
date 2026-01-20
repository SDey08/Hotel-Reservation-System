package com.crs.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crs.model.entity.Hotel;
import com.crs.model.entity.Room;

import java.util.List;
import java.util.Optional;


public interface RoomRepository extends JpaRepository<Room, Integer> {
    List<Room> findByHotel_HotelIdAndRoomTypeAndStatus(Integer hotelId, Room.RoomType roomType, Room.RoomStatus RoomStatus);
    List<Room> findByHotel_HotelId(Integer hotelId);
    Optional<Room> findByRoomId(Integer roomId);
    Optional<Room> findByRoomTypeAndHotel(Room.RoomType roomType, Hotel hotel);
    List<Room> findByHotel_HotelIdAndStatus(Integer hotelId, Room.RoomStatus status);
}
