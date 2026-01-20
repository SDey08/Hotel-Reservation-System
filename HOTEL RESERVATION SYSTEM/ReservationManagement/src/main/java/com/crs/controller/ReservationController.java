package com.crs.controller;

import com.crs.model.dto.EditReservationRequestDto;
import com.crs.model.dto.ReservationDto;
import com.crs.model.dto.ReserveRoomRequestDto;
import com.crs.model.entity.Reservation;
import com.crs.model.service.ReservationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/reservation")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    // --------------------------
    // CUSTOMER methods
    // --------------------------

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/book")
    public ResponseEntity<Reservation> reserveRoom(
            @RequestBody ReserveRoomRequestDto request) {

        return ResponseEntity.ok(reservationService.reserveRoom(request));
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PutMapping("/edit/{id}")
    public ResponseEntity<Reservation> editReservation(
            @PathVariable("id") Integer reservationId,
            @RequestBody EditReservationRequestDto dto) {

        return ResponseEntity.ok(reservationService.editReservation(reservationId, dto));
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @DeleteMapping("/cancel/{reservationId}")
    public ResponseEntity<String> cancelReservation(
            @PathVariable Integer reservationId) {
        reservationService.cancelReservation(reservationId);
        return ResponseEntity.ok("Reservation cancelled successfully");
    }

    // --------------------------
    // Public or Mixed Access
    // --------------------------

    @GetMapping("/all")
    public ResponseEntity<List<Reservation>> getAllReservations() {
        List<Reservation> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(reservations);
    }

    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    @GetMapping("/{reservationId}")
    public ResponseEntity<?> getReservationById(
            @PathVariable Integer reservationId) {
        return ResponseEntity.ok(reservationService.getReservationById(reservationId));
    }

    @GetMapping("/available/{reservationId}")
    public ResponseEntity<Boolean> isRoomAvailable(@PathVariable Integer reservationId) {
        return ResponseEntity.ok(reservationService.isRoomAvailable(reservationId));
    }
    
    @GetMapping("/searchByHotelAndDate")
    public ResponseEntity<List<ReservationDto>> searchReservationsByHotelAndDate(
            @RequestParam Integer hotelId,
            @RequestParam LocalDate date) {

        List<ReservationDto> reservations = reservationService.getReservationsByHotelAndDate(hotelId, date);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/customer/{customerId}/status/{status}")
    public ResponseEntity<List<Reservation>> getByCustomerIdAndStatus(
            @PathVariable Integer customerId,
            @PathVariable Reservation.Status status) {
        List<Reservation> filteredReservations = reservationService.getReservationsByCustomerIdAndStatus(customerId, status);
        return ResponseEntity.ok(filteredReservations);
    }

    @PostMapping("/updateStatus/{reservationId}")
    public ResponseEntity<String> updateReservationStatusBasedOnPayment(@PathVariable Integer reservationId) {
        reservationService.updateReservationStatusBasedOnPayment(reservationId);
        return ResponseEntity.ok("Reservation status updated based on payment status");
    }

}