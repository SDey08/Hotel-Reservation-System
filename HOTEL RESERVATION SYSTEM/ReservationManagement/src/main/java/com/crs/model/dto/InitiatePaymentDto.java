package com.crs.model.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
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
