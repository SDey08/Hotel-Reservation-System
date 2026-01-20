package com.crs.model.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationDto {

    private Integer reservationId;

    @NotNull(message = "Customer ID cannot be null")
    @Positive(message = "Customer ID must be positive")
    private Integer customerId;

    @NotNull(message = "Hotel ID cannot be null")
    @Positive(message = "Hotel ID must be positive")
    private Integer hotelId;

    @NotNull(message = "Room ID cannot be null")
    @Positive(message = "Room ID must be positive")
    private Integer roomId;

    @NotNull(message = "Check-in date is required")
    @FutureOrPresent(message = "Check-in date must be today or in the future")
    private LocalDate checkInDate;

    @NotNull(message = "Check-out date is required")
    @Future(message = "Check-out date must be in the future")
    private LocalDate checkOutDate;
}

