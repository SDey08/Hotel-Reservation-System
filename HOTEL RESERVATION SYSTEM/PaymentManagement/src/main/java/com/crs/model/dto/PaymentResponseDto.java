package com.crs.model.dto;

import com.crs.model.entity.Payment.PaymentMethod;
import com.crs.model.entity.Payment.PaymentStatus;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDto {
    private int paymentId;          
    private Integer reservationId;    
    private Integer customerId;       
    private Double amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private LocalDateTime paymentDate;
    private String message;
}