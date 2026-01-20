package com.hotelReservationSystem.HotelReservationSystem.service;

import com.crs.feign.ReservationClient;
import com.crs.feign.RoomClient;
import com.crs.model.dto.*;
import com.crs.model.entity.Payment;
import com.crs.model.entity.Payment.PaymentMethod;
import com.crs.model.entity.Payment.PaymentStatus;
import com.crs.model.exception.CustomException;
import com.crs.model.repository.PaymentRepository;
import com.crs.model.service.PaymentServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private ReservationClient reservationClient;

    @Mock
    private RoomClient roomClient;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    private Payment testPayment;
    private InitiatePaymentDto initiatePaymentDto;
    private ProcessPaymentDto processPaymentDto;
    private RoomDTO roomDTO;

    @BeforeEach
    void setUp() {
        testPayment = Payment.builder()
                .paymentId(1)
                .reservationId(1)
                .customerId(1)
                .amount(200.0)
                .paymentMethod(PaymentMethod.CARD)
                .paymentStatus(PaymentStatus.SUCCESS)
                .paymentDate(LocalDateTime.now())
                .build();

        initiatePaymentDto = new InitiatePaymentDto();
        initiatePaymentDto.setReservationId(1);
        initiatePaymentDto.setCustomerId(1);
        initiatePaymentDto.setRoomId(1);
        initiatePaymentDto.setCheckInDate(LocalDate.now());
        initiatePaymentDto.setCheckOutDate(LocalDate.now().plusDays(2));

        processPaymentDto = new ProcessPaymentDto();
        processPaymentDto.setReservationId(1);
        processPaymentDto.setPaymentMethod(PaymentMethod.CARD);
        processPaymentDto.setPaymentStatus(PaymentStatus.SUCCESS);

        roomDTO = new RoomDTO();
        roomDTO.setRoomId(1);
        roomDTO.setPricePerNight(100.0);
    }

    @Test
    void testInitiatePayment_NewPayment() {
        Payment incompletePayment = Payment.builder()
                .paymentId(1)
                .reservationId(1)
                .customerId(1)
                .amount(200.0)
                .paymentStatus(PaymentStatus.INCOMPLETE)
                .build();

        when(paymentRepository.existsByReservationId(1)).thenReturn(false);
        when(roomClient.getRoomById(1)).thenReturn(roomDTO);
        when(paymentRepository.save(any(Payment.class))).thenReturn(incompletePayment);

        PaymentResponseDto result = paymentService.initiatePayment(initiatePaymentDto);

        assertNotNull(result);
        assertEquals(1, result.getPaymentId());
        assertEquals(200.0, result.getAmount());
        assertEquals(PaymentStatus.INCOMPLETE, result.getPaymentStatus());
        assertEquals("Payment initiated successfully", result.getMessage());
    }

    @Test
    void testInitiatePayment_ExistingPayment() {
        when(paymentRepository.existsByReservationId(1)).thenReturn(true);
        when(paymentRepository.findByReservationId(1)).thenReturn(testPayment);
        when(roomClient.getRoomById(1)).thenReturn(roomDTO);
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        PaymentResponseDto result = paymentService.initiatePayment(initiatePaymentDto);

        assertNotNull(result);
        assertEquals(1, result.getPaymentId());
        assertEquals("Payment initiated successfully", result.getMessage());
    }

    @Test
    void testGetPaymentById_AdminAccess() {
        when(paymentRepository.findById(1)).thenReturn(Optional.of(testPayment));

        PaymentResponseDto result = paymentService.getPaymentById(1);

        assertNotNull(result);
        assertEquals(1, result.getPaymentId());
        assertEquals(1, result.getReservationId());
    }

    @Test
    void testGetPaymentById_AccessDenied() {
        CustomException exception = assertThrows(CustomException.class, () ->
                paymentService.getPaymentById(1));

        assertEquals("Access Denied: Only admins or customers can view payment details.", exception.getMessage());
    }

    @Test
    void testGetPaymentById_NotFound() {
        when(paymentRepository.findById(999)).thenReturn(Optional.empty());

        CustomException exception = assertThrows(CustomException.class, () ->
                paymentService.getPaymentById(999));

        assertEquals("Payment not found with ID: 999", exception.getMessage());
    }

    @Test
    void testGetPaymentByReservationId_Success() {
        when(paymentRepository.findByReservationId(1)).thenReturn(testPayment);

        Payment result = paymentService.getPaymentByReservationId(1);

        assertNotNull(result);
        assertEquals(1, result.getPaymentId());
        assertEquals(1, result.getReservationId());
    }

    @Test
    void testGetPaymentByReservationId_NotFound() {
        when(paymentRepository.findByReservationId(999)).thenReturn(null);

        CustomException exception = assertThrows(CustomException.class, () ->
                paymentService.getPaymentByReservationId(999));

        assertEquals("Payment not found for reservation ID: 999", exception.getMessage());
    }

    @Test
    void testGetAllPayments_AdminAccess() {
        when(paymentRepository.findAll()).thenReturn(Collections.singletonList(testPayment));

        Set<PaymentResponseDto> result = paymentService.getAllPayments();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.stream().anyMatch(p -> p.getPaymentId() == 1));
    }

    @Test
    void testGetAllPayments_AccessDenied() {
        CustomException exception = assertThrows(CustomException.class, () ->
                paymentService.getAllPayments());

        assertEquals("Access Denied: Only admins can view all payments.", exception.getMessage());
    }

    @Test
    void testGetPaymentStatusByReservationId_Success() {
        when(paymentRepository.findByReservationId(1)).thenReturn(testPayment);

        PaymentStatus result = paymentService.getPaymentStatusByReservationId(1);

        assertEquals(PaymentStatus.SUCCESS, result);
    }

    @Test
    void testGetPaymentStatusByReservationId_NotFound() {
        when(paymentRepository.findByReservationId(999)).thenReturn(null);

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                paymentService.getPaymentStatusByReservationId(999));

        assertEquals("Payment with reservation ID 999 not found.", exception.getMessage());
    }

    @Test
    void testDeletePaymentByReservationId_SuccessPayment() {
        Payment successPayment = Payment.builder()
                .paymentId(1)
                .reservationId(1)
                .paymentStatus(PaymentStatus.SUCCESS)
                .build();

        when(paymentRepository.findByReservationId(1)).thenReturn(successPayment);
        when(paymentRepository.save(any(Payment.class))).thenReturn(successPayment);

        paymentService.deletePaymentByReservationId(1);

        verify(paymentRepository).save(successPayment);
        assertEquals(PaymentStatus.REFUNDED, successPayment.getPaymentStatus());
    }

    @Test
    void testDeletePaymentByReservationId_PendingPayment() {
        Payment pendingPayment = Payment.builder()
                .paymentId(1)
                .reservationId(1)
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        when(paymentRepository.findByReservationId(1)).thenReturn(pendingPayment);
        when(paymentRepository.save(any(Payment.class))).thenReturn(pendingPayment);

        paymentService.deletePaymentByReservationId(1);

        verify(paymentRepository).save(pendingPayment);
        assertEquals(PaymentStatus.INCOMPLETE, pendingPayment.getPaymentStatus());
    }
}
