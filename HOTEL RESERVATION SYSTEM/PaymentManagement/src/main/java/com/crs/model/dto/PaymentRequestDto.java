package com.crs.model.dto;

import java.time.LocalDate;

import com.crs.model.entity.Payment.PaymentMethod;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDto {
    @NotNull(message = "Reservation ID is required")
    private Integer reservationId;   
    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
    @Min(value=1,message="Payment amount cannot be 0")
    private double amount;
    private LocalDate paymentDate;
}