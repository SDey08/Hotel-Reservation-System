package com.hotelReservationSystem.HotelReservationSystem.service;

import com.crs.feign.HotelClient;
import com.crs.feign.PaymentClient;
import com.crs.model.dto.EditReservationRequestDto;
import com.crs.model.dto.ReserveRoomRequestDto;
import com.crs.model.dto.RoomDto;
import com.crs.model.entity.Reservation;
import com.crs.model.entity.Reservation.RoomType;
import com.crs.model.entity.Reservation.Status;
import com.crs.model.entity.Reservation.PaymentStatus;
import com.crs.model.repository.ReservationRepository;
import com.crs.model.service.ReservationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private HotelClient hotelClient;


    @Mock
    private PaymentClient paymentClient;

    @InjectMocks
    private ReservationServiceImpl reservationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testReserveRoom_Success() {
        ReserveRoomRequestDto request = ReserveRoomRequestDto.builder()
                .customerId(10)
                .hotelId(20)
                .roomType(RoomType.DELUXE)
                .checkInDate(LocalDate.now().plusDays(1))
                .checkOutDate(LocalDate.now().plusDays(3))
                .noOfGuests(2)
                .build();

        List<RoomDto> availableRooms = List.of(
                RoomDto.builder().roomId(101).build()
        );

        when(hotelClient.getRoomsByHotelAndType(20, RoomType.DELUXE)).thenReturn(availableRooms);
        when(reservationRepository.existsByHotelIdAndRoomIdAndDateRange(anyInt(), anyInt(), any(), any())).thenReturn(false);
        when(reservationRepository.save(any(Reservation.class))).thenAnswer(i -> i.getArguments()[0]);

        Reservation result = reservationService.reserveRoom(request);

        assertNotNull(result);
        assertEquals(10, result.getCustomerId());
        assertEquals(Status.INCOMPLETE, result.getStatus());
        verify(paymentClient, times(1)).initiatePayment(any());
    }

    @Test
    void testEditReservation_Success() {
        EditReservationRequestDto request = EditReservationRequestDto.builder()
                .hotelId(20)
                .roomType(RoomType.DELUXE)
                .checkInDate(LocalDate.now().plusDays(2))
                .checkOutDate(LocalDate.now().plusDays(4))
                .roomId(101)
                .noOfGuests(2)
                .build();

        Reservation existing = Reservation.builder()
                .reservationId(1)
                .hotelId(20)
                .customerId(10)
                .status(Status.INCOMPLETE)
                .build();

        List<RoomDto> availableRooms = List.of(
                RoomDto.builder().roomId(101).build()
        );

        when(reservationRepository.findById(1)).thenReturn(Optional.of(existing));
        when(hotelClient.getRoomsByHotelAndType(20, RoomType.DELUXE)).thenReturn(availableRooms);
        when(reservationRepository.existsByHotelIdAndRoomIdAndDateRange(anyInt(), anyInt(), any(), any())).thenReturn(false);
        when(reservationRepository.save(any(Reservation.class))).thenAnswer(i -> i.getArguments()[0]);

        Reservation result = reservationService.editReservation(1, request);

        assertNotNull(result);
        assertEquals(1, result.getReservationId());
        verify(paymentClient, times(1)).initiatePayment(any());
    }

    @Test
    void testUpdateReservationStatusBasedOnPayment_Success() {
        Reservation existing = Reservation.builder()
                .reservationId(1)
                .status(Status.INCOMPLETE)
                .paymentStatus(PaymentStatus.INCOMPLETE)
                .build();

        when(reservationRepository.findById(1)).thenReturn(Optional.of(existing));
        when(paymentClient.getPaymentStatusByReservationId(1)).thenReturn(PaymentStatus.SUCCESS);
        when(reservationRepository.save(any(Reservation.class))).thenAnswer(i -> i.getArguments()[0]);

        assertDoesNotThrow(() -> reservationService.updateReservationStatusBasedOnPayment(1));

        assertEquals(PaymentStatus.SUCCESS, existing.getPaymentStatus());
        assertEquals(Status.BOOKED, existing.getStatus());
    }
}