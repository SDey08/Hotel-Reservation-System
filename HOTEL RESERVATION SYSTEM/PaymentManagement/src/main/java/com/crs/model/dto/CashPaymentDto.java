package com.crs.model.dto;

import jakarta.validation.constraints.NotNull;
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
public class CashPaymentDto {

    @NotNull(message = "Reservation ID is required")
    private Integer reservationId;

    @NotNull(message = "Customer ID is required")
    private Integer customerId;

    @NotNull(message = "Amount is required")
    private Double amount;
}
