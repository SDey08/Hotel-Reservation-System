package com.crs.model.service;
import com.crs.model.dto.ReservationDto;
import com.crs.model.dto.EditReservationRequestDto;
import com.crs.model.dto.ReserveRoomRequestDto;
import com.crs.model.entity.Reservation;

import java.time.LocalDate;
import java.util.List;

public interface ReservationService {

    Reservation reserveRoom(ReserveRoomRequestDto request);

    Reservation editReservation(Integer reservationId, EditReservationRequestDto request);

    void cancelReservation(Integer reservationId);

    List<Reservation> getAllReservations();

    List<Reservation> getReservationsByCustomerIdAndStatus(Integer customerId, Reservation.Status status);

    ReservationDto getReservationById(Integer reservationId);

    List<ReservationDto> getReservationsByHotelAndDate(Integer hotelId, LocalDate date);

    boolean isRoomAvailable(Integer reservationId);

    void updateReservationStatusBasedOnPayment(Integer reservationId);

    void updateCompletedReservations();
}
