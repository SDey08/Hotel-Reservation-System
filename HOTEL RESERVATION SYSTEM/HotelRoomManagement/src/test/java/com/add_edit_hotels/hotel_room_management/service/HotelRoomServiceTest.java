package com.add_edit_hotels.hotel_room_management.service;
import com.crs.model.dto.HotelDTO;
import com.crs.model.dto.RoomDTO;
import com.crs.model.entity.Hotel;
import com.crs.model.entity.Room;
import com.crs.model.entity.Room.RoomStatus;
import com.crs.model.entity.Room.RoomType;
import com.crs.model.exception.CustomException;
import com.crs.model.repository.HotelRepository;
import com.crs.model.repository.RoomRepository;
import com.crs.model.service.HotelRoomServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class HotelRoomServiceTest {

    @Mock
    private HotelRepository hotelRepository;

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private HotelRoomServiceImpl hotelRoomService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    // ================= HOTEL TESTS =================

    @Test
    void testAddHotelSuccess() {
        HotelDTO dto = HotelDTO.builder()
                .name("Test Hotel")
                .location("City")
                .contactNumber("1234567890")
                .rating(4.5)
                .build();

        when(hotelRepository.existsByNameAndLocation(dto.getName(), dto.getLocation())).thenReturn(false);
        when(hotelRepository.save(any(Hotel.class))).thenAnswer(i -> i.getArguments()[0]);

        HotelDTO saved = hotelRoomService.addHotel(dto);

        assertNotNull(saved);
        assertEquals("Test Hotel", saved.getName());
        verify(hotelRepository, times(1)).save(any(Hotel.class));
    }

    @Test
    void testAddHotelDuplicate() {
        HotelDTO dto = new HotelDTO();
        dto.setName("Test Hotel");
        dto.setLocation("City");

        when(hotelRepository.existsByNameAndLocation(dto.getName(), dto.getLocation())).thenReturn(true);

        CustomException ex = assertThrows(CustomException.class, () -> hotelRoomService.addHotel(dto));
        assertEquals("Hotel with same name and location already exists", ex.getMessage());
    }

    @Test
    void testGetHotelByIdSuccess() {
        Hotel hotel = new Hotel();
        hotel.setHotelId(1);
        hotel.setName("Sample Hotel");

        when(hotelRepository.findById(1)).thenReturn(Optional.of(hotel));

        HotelDTO result = hotelRoomService.getHotelById(1);

        assertNotNull(result);
        assertEquals("Sample Hotel", result.getName());
    }

    @Test
    void testGetHotelByIdNotFound() {
        when(hotelRepository.findById(1)).thenReturn(Optional.empty());

        CustomException ex = assertThrows(CustomException.class, () -> hotelRoomService.getHotelById(1));
        assertEquals("Hotel not found with ID: 1", ex.getMessage());
    }

    @Test
    void testUpdateHotelSuccess() {
        Hotel existing = new Hotel();
        existing.setHotelId(1);
        existing.setName("Old Name");

        HotelDTO dto = new HotelDTO();
        dto.setName("New Name");
        dto.setLocation("City");

        when(hotelRepository.findById(1)).thenReturn(Optional.of(existing));
        when(hotelRepository.save(existing)).thenReturn(existing);

        HotelDTO updated = hotelRoomService.updateHotel(1, dto);

        assertEquals("New Name", updated.getName());
    }

    @Test
    void testDeleteHotelSuccess() {
        Hotel hotel = new Hotel();
        hotel.setHotelId(1);

        when(hotelRepository.findById(1)).thenReturn(Optional.of(hotel));

        assertDoesNotThrow(() -> hotelRoomService.deleteHotel(1));
        verify(hotelRepository, times(1)).delete(hotel);
    }

    @Test
    void testDeleteHotelNotFound() {
        when(hotelRepository.findById(1)).thenReturn(Optional.empty());

        CustomException ex = assertThrows(CustomException.class, () -> hotelRoomService.deleteHotel(1));
        assertEquals("Hotel not found with ID: 1", ex.getMessage());
    }

    @Test
    void testGetAllHotels() {
        Hotel hotel = new Hotel();
        hotel.setHotelId(1);
        hotel.setName("Hotel1");

        when(hotelRepository.findAll()).thenReturn(Collections.singletonList(hotel));

        List<HotelDTO> hotels = hotelRoomService.getAllHotels();
        assertEquals(1, hotels.size());
        assertEquals("Hotel1", hotels.get(0).getName());
    }

    @Test
    void testExistsByHotelId() {
        when(hotelRepository.existsByHotelId(1)).thenReturn(true);
        assertTrue(hotelRoomService.existsByHotelId(1));
    }

    // ================= ROOM TESTS =================

    @Test
    void testAddRoomToHotelSuccess() {
        Hotel hotel = new Hotel();
        hotel.setHotelId(1);
        hotel.setRooms(new ArrayList<>());

        RoomDTO dto = RoomDTO.builder()
                .roomType(RoomType.SINGLE)
                .pricePerNight(BigDecimal.valueOf(100))
                .status(RoomStatus.AVAILABLE)
                .build();

        when(hotelRepository.findById(1)).thenReturn(Optional.of(hotel));
        when(hotelRepository.save(any(Hotel.class))).thenReturn(hotel);

        RoomDTO saved = hotelRoomService.addRoomToHotel(1, dto);

        assertNotNull(saved);
        assertEquals(RoomType.SINGLE, saved.getRoomType());
        assertEquals(1, hotel.getRooms().size());
    }

    @Test
    void testUpdateRoomSuccess() {
        Hotel hotel = new Hotel();
        hotel.setHotelId(1);

        Room existing = new Room();
        existing.setRoomId(1);
        existing.setHotel(hotel);
        existing.setStatus(RoomStatus.AVAILABLE);
        existing.setRoomType(RoomType.SINGLE);

        RoomDTO dto = RoomDTO.builder()
                .roomType(RoomType.DOUBLE)
                .pricePerNight(BigDecimal.valueOf(200))
                .status(RoomStatus.MAINTENANCE)
                .hotelId(1)
                .build();

        when(roomRepository.findByRoomId(1)).thenReturn(Optional.of(existing));
        when(hotelRepository.findById(1)).thenReturn(Optional.of(hotel));
        when(roomRepository.save(existing)).thenReturn(existing);

        RoomDTO updated = hotelRoomService.updateRoom(1, dto);
        assertEquals(RoomType.DOUBLE, updated.getRoomType());
        assertEquals(RoomStatus.MAINTENANCE, updated.getStatus());
    }

    @Test
    void testDeleteRoomSuccess() {
        Room room = new Room();
        room.setRoomId(1);

        when(roomRepository.findByRoomId(1)).thenReturn(Optional.of(room));

        assertDoesNotThrow(() -> hotelRoomService.deleteRoom(1));
        verify(roomRepository, times(1)).delete(room);
    }

    @Test
    void testGetRoomByIdSuccess() {
        Room room = new Room();
        room.setRoomId(1);
        room.setRoomType(RoomType.SINGLE);

        when(roomRepository.findByRoomId(1)).thenReturn(Optional.of(room));

        RoomDTO dto = hotelRoomService.getRoomById(1);
        assertEquals(RoomType.SINGLE, dto.getRoomType());
    }

    @Test
    void testGetRoomsByHotel() {
        Room room = new Room();
        room.setRoomId(1);

        when(roomRepository.findByHotel_HotelId(1)).thenReturn(Collections.singletonList(room));

        List<RoomDTO> rooms = hotelRoomService.getRoomsByHotel(1);
        assertEquals(1, rooms.size());
    }

    @Test
    void testGetRoomsByHotelAndType() {
        Room room = new Room();
        room.setRoomId(1);
        room.setRoomType(RoomType.SINGLE);
        room.setStatus(RoomStatus.AVAILABLE);
        Hotel hotel = new Hotel();
        hotel.setHotelId(1);
        room.setHotel(hotel);

        when(roomRepository.findByHotel_HotelIdAndRoomTypeAndStatus(1, RoomType.SINGLE, RoomStatus.AVAILABLE))
                .thenReturn(Collections.singletonList(room));

        List<RoomDTO> rooms = hotelRoomService.getRoomsByHotelAndType(1, RoomType.SINGLE);
        assertEquals(1, rooms.size());
        assertEquals(RoomType.SINGLE, rooms.get(0).getRoomType());
    }

    // ================= SEARCH / SUGGESTIONS =================

    @Test
    void testGetHotelSuggestions() {
        Hotel h1 = new Hotel();
        h1.setName("Holiday Inn");
        Hotel h2 = new Hotel();
        h2.setName("Hotel ABC");

        when(hotelRepository.findByNameContainingIgnoreCase("Ho")).thenReturn(Arrays.asList(h1, h2));

        List<String> suggestions = hotelRoomService.getHotelSuggestions("Ho");
        assertEquals(2, suggestions.size());
        assertTrue(suggestions.contains("Holiday Inn"));
    }

}