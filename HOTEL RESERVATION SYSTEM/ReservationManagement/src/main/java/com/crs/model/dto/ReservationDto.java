package com.crs.model.dto;

import lombok.*;

import java.time.LocalDate;

import com.crs.model.entity.Reservation.RoomType;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDto {
    private Integer reservationId;
    private Integer customerId;
    private Integer hotelId;
    private Integer roomId;
    private RoomType roomType;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int noOfGuests;
}
