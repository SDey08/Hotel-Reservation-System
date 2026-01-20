package com.crs.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.crs.model.entity.Payment.PaymentMethod;
import com.crs.model.entity.Payment.PaymentStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProcessPaymentDto {
    private Integer reservationId;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
}

