package com.hotelReservationSystem.HotelReservationSystem.service;

import com.crs.controller.SearchController;
import com.crs.feign.HotelRoomClient;
import com.crs.model.dto.HotelResponseDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SearchControllerTest {

    @Mock
    private HotelRoomClient hotelRoomClient;

    @InjectMocks
    private SearchController searchController;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetSuggestions() {
        List<String> mockSuggestions = Arrays.asList("Hotel A", "Hotel B");
        when(hotelRoomClient.getSuggestions("Ho")).thenReturn(mockSuggestions);

        List<String> result = searchController.getSuggestions("Ho");

        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.contains("Hotel A"));

        verify(hotelRoomClient, times(1)).getSuggestions("Ho");
    }

    @Test
    void testSearchHotels() {
        HotelResponseDto hotel = HotelResponseDto.builder()
                .hotelId(1)
                .name("Hotel A")
                .location("NY")
                .contactNumber("1234567890")
                .rating(4.5)
                .hotelImgUrl("img.url")
                .build();

        when(hotelRoomClient.searchHotels("A")).thenReturn(List.of(hotel));

        List<HotelResponseDto> result = searchController.search("A");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Hotel A", result.get(0).getName());

        verify(hotelRoomClient, times(1)).searchHotels("A");
    }

    @Test
    void testGetSuggestionsEmpty() {
        when(hotelRoomClient.getSuggestions("xyz")).thenReturn(List.of());

        List<String> result = searchController.getSuggestions("xyz");

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(hotelRoomClient, times(1)).getSuggestions("xyz");
    }

    @Test
    void testSearchHotelsEmpty() {
        when(hotelRoomClient.searchHotels("xyz")).thenReturn(List.of());

        List<HotelResponseDto> result = searchController.search("xyz");

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(hotelRoomClient, times(1)).searchHotels("xyz");
    }
}