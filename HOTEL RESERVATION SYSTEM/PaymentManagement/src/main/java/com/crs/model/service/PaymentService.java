package com.crs.model.service;

import com.crs.model.dto.InitiatePaymentDto;
import com.crs.model.dto.PaymentResponseDto;
import com.crs.model.dto.ProcessPaymentDto;
import com.crs.model.entity.Payment;
import com.crs.model.entity.Payment.PaymentStatus;

import java.util.Set;

import org.springframework.web.bind.annotation.RequestBody;

public interface PaymentService {

    PaymentResponseDto initiatePayment(@RequestBody InitiatePaymentDto dto);

    PaymentResponseDto processPayment(ProcessPaymentDto dto);

    PaymentResponseDto getPaymentById(int paymentId);

    Payment getPaymentByReservationId(Integer reservationId);

    Set<PaymentResponseDto> getAllPayments();

    PaymentStatus getPaymentStatusByReservationId(Integer reservationId);

    void deletePaymentByReservationId(Integer reservationId);
    
}