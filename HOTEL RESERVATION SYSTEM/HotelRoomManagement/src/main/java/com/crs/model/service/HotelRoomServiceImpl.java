package com.crs.model.service;
import com.crs.model.dto.HotelSearchResponseDTO;
import com.crs.model.dto.HotelDTO;
import com.crs.model.dto.RoomDTO;
import com.crs.model.entity.Hotel;
import com.crs.model.entity.Room;
import com.crs.model.entity.Room.RoomStatus;
import com.crs.model.entity.Room.RoomType;
import com.crs.model.exception.CustomException;
import com.crs.model.repository.HotelRepository;
import com.crs.model.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class HotelRoomServiceImpl implements HotelRoomService {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    // ================= HOTEL =================
    @Override
    public HotelDTO addHotel(HotelDTO hotelDTO) {
        boolean exists = hotelRepository.existsByNameAndLocation(hotelDTO.getName(), hotelDTO.getLocation());
        if (exists) {
            throw new CustomException("Hotel with same name and location already exists");
        }
    
        Hotel hotel = new Hotel();
        hotel.setHotelId(hotelDTO.getHotelId());
        hotel.setName(hotelDTO.getName());
        hotel.setLocation(hotelDTO.getLocation());
        hotel.setContactNumber(hotelDTO.getContactNumber());
        hotel.setRating(hotelDTO.getRating());
        hotel.setHotelImgUrl(hotelDTO.getHotelImgUrl());
    
        if (hotelDTO.getRooms() != null && !hotelDTO.getRooms().isEmpty()) {
            List<Room> rooms = hotelDTO.getRooms().stream().map(roomDTO -> {
                Room room = new Room();
                room.setRoomId(roomDTO.getRoomId());
                room.setRoomType(roomDTO.getRoomType());
                room.setPricePerNight(roomDTO.getPricePerNight());
                room.setStatus(roomDTO.getStatus());
                room.setRoomImgUrl(roomDTO.getRoomImgUrl());
                room.setHotel(hotel); 
                return room;
            }).collect(Collectors.toList());
            hotel.setRooms(rooms);
        }
    
        Hotel saved = hotelRepository.save(hotel);
        return toHotelDTO(saved);
    }
    
    @Override
    public HotelDTO updateHotel(Integer hotelId, HotelDTO updatedDTO) {
        Hotel existing = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new CustomException("Hotel not found with ID: " + hotelId));

        existing.setName(updatedDTO.getName());
        existing.setLocation(updatedDTO.getLocation());
        existing.setContactNumber(updatedDTO.getContactNumber());
        existing.setRating(updatedDTO.getRating());
        existing.setHotelImgUrl(updatedDTO.getHotelImgUrl());
        Hotel updated = hotelRepository.save(existing);
        return toHotelDTO(updated);
    }

    @Override
    public void deleteHotel(Integer hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new CustomException("Hotel not found with ID: " + hotelId));
        hotelRepository.delete(hotel);
    }

    @Override
    public HotelDTO getHotelById(Integer hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new CustomException("Hotel not found with ID: " + hotelId));
        return toHotelDTO(hotel);
    }

    @Override
    public List<HotelDTO> getAllHotels() {
        return hotelRepository.findAll()
                .stream()
                .map(this::toHotelDTO)
                .collect(Collectors.toList());
    }

    // ================= ROOM =================

    @Override
public RoomDTO addRoomToHotel(Integer hotelId, RoomDTO roomDTO) {
    Hotel hotel = hotelRepository.findById(hotelId)
            .orElseThrow(() -> new CustomException("Hotel not found with ID: " + hotelId));

    Room room = new Room();
    room.setRoomId(roomDTO.getRoomId());
    room.setRoomType(roomDTO.getRoomType());
    room.setPricePerNight(roomDTO.getPricePerNight());
    room.setStatus(roomDTO.getStatus());
    room.setRoomImgUrl(roomDTO.getRoomImgUrl());
    room.setHotel(hotel);

    // Add to hotel's room list to ensure bidirectional sync
    if (hotel.getRooms() == null) {
        hotel.setRooms(new ArrayList<>());
    }
    hotel.getRooms().add(room);
    hotelRepository.save(hotel); 
    return toRoomDTO(room); 
}


    @Override
    public RoomDTO updateRoom(Integer roomId, RoomDTO roomDTO) {
        Room existingRoom = roomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new CustomException("Room not found with ID: " + roomId));

        existingRoom.setRoomType(roomDTO.getRoomType());
        existingRoom.setPricePerNight(roomDTO.getPricePerNight());
        existingRoom.setStatus(roomDTO.getStatus());
        existingRoom.setRoomImgUrl(roomDTO.getRoomImgUrl());

        if (roomDTO.getHotelId() != null) {
            Hotel hotel = hotelRepository.findById(roomDTO.getHotelId())
                    .orElseThrow(() -> new CustomException("Hotel not found with ID: " + roomDTO.getHotelId()));
            existingRoom.setHotel(hotel);
        }

        Room updated = roomRepository.save(existingRoom);
        return toRoomDTO(updated);
    }

    @Override
    public void deleteRoom(Integer roomId) {
        Room room = roomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new CustomException("Room not found with ID: " + roomId));
        roomRepository.delete(room);
    }

    @Override
    public RoomDTO getRoomById(Integer roomId) {
        Room room = roomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new CustomException("Room not found with ID: " + roomId));
        return toRoomDTO(room);
    }

    @Override
    public List<RoomDTO> getRoomsByHotel(Integer hotelId) {
        return roomRepository.findByHotel_HotelId(hotelId)
                .stream()
                .map(this::toRoomDTO)
                .collect(Collectors.toList());
    }

    // ================== PRIVATE CONVERTERS ==================

    private HotelDTO toHotelDTO(Hotel hotel) {
        HotelDTO dto = new HotelDTO();
        dto.setHotelId(hotel.getHotelId());
        dto.setName(hotel.getName());
        dto.setLocation(hotel.getLocation());
        dto.setContactNumber(hotel.getContactNumber());
        dto.setRating(hotel.getRating());
        dto.setHotelImgUrl(hotel.getHotelImgUrl());
    
        if (hotel.getRooms() != null) {
            List<RoomDTO> roomDTOs = hotel.getRooms().stream()
                .map(this::toRoomDTO)
                .collect(Collectors.toList());
            dto.setRooms(roomDTOs);
        } else {
            dto.setRooms(new ArrayList<>()); 
        }
    
        return dto;
    }
    
    private RoomDTO toRoomDTO(Room room) {
        RoomDTO dto = new RoomDTO();
        dto.setRoomId(room.getRoomId());
        dto.setRoomType(room.getRoomType());
        dto.setPricePerNight(room.getPricePerNight());
        dto.setStatus(room.getStatus());
        dto.setHotelId(room.getHotel() != null ? room.getHotel().getHotelId() : null);
        dto.setRoomImgUrl(room.getRoomImgUrl());
        return dto;
    }

    @Override
    public boolean existsByHotelId(Integer hotelId) {
        return hotelRepository.existsByHotelId(hotelId);
    }
    
    @Override
    public List<String> getHotelSuggestions(String query) {
        return hotelRepository.findByNameContainingIgnoreCase(query).stream()
                .map(Hotel::getName)
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    public List<HotelSearchResponseDTO> searchHotels(String query) {
        List<Hotel> hotelsByName = hotelRepository.findByNameContainingIgnoreCase(query);
        List<Hotel> hotelsByLocation = hotelRepository.findByLocationContainingIgnoreCase(query);

        return Stream.concat(hotelsByName.stream(), hotelsByLocation.stream())
                .distinct()
                .map(this::toHotelSearchResponseDTO)
                .collect(Collectors.toList());
    }

    private HotelSearchResponseDTO toHotelSearchResponseDTO(Hotel hotel) {
        return HotelSearchResponseDTO.builder()
                .hotelId(hotel.getHotelId())
                .name(hotel.getName())
                .location(hotel.getLocation())
                .contactNumber(hotel.getContactNumber())
                .rating(hotel.getRating())
                .hotelImgUrl(hotel.getHotelImgUrl())
                .build();
    }
    
    @Override
    public List<RoomDTO> getRoomsByHotelAndType(Integer hotelId, RoomType roomType) {
        return roomRepository.findByHotel_HotelIdAndRoomTypeAndStatus(hotelId, roomType, RoomStatus.AVAILABLE)
        .stream()
        .map(room -> RoomDTO.builder()
                .roomId(room.getRoomId())
                .roomType(room.getRoomType())
                .pricePerNight(room.getPricePerNight())
                .status(room.getStatus())
                .hotelId(room.getHotel().getHotelId())
                .roomImgUrl(room.getRoomImgUrl())
                .build()
        )
        .collect(Collectors.toList());
    }
}
