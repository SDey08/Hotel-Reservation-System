package com.crs.model.dto;

import com.crs.model.entity.Reservation.RoomType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EditReservationRequestDto {

    @NotNull
    private Integer hotelId;

    @NotNull
    private Integer roomId;

    @NotNull
    private RoomType roomType;

    @NotNull
    @FutureOrPresent(message="CheckInDate must be in present or in the future")
    private LocalDate checkInDate;

    @NotNull
    @Future(message="CheckOutDate must be in future")
    private LocalDate checkOutDate;

    @NotNull
    @Min(value=1,message="No. of guests must be greater than 0")
    private int noOfGuests;
}
