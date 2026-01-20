package com.crs.model.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InitiatePaymentDto {

    private Integer reservationId;
    private Integer customerId;
    private Integer roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;

}
