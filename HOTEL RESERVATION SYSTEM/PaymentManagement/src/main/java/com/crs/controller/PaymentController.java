package com.crs.controller;

import com.crs.model.dto.InitiatePaymentDto;
import com.crs.model.dto.PaymentResponseDto;
import com.crs.model.dto.ProcessPaymentDto;
import com.crs.model.entity.Payment;
import com.crs.model.entity.Payment.PaymentStatus;
import com.crs.model.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/initiate")
    public PaymentResponseDto initiatePayment(@RequestBody InitiatePaymentDto dto) {
        return paymentService.initiatePayment(dto);
    }

    @PostMapping("/process")
    public PaymentResponseDto processPayment(@RequestBody ProcessPaymentDto dto) {
        return paymentService.processPayment(dto);
    }

    @GetMapping("/{paymentId}")
    public PaymentResponseDto getPaymentById(@PathVariable int paymentId) {
        return paymentService.getPaymentById(paymentId);
    }

    @GetMapping("/reservation/{reservationId}")
    public Payment getPaymentsByReservationId(@PathVariable Integer reservationId) {
        return paymentService.getPaymentByReservationId(reservationId);
    }

    @GetMapping("/admin/All")
    @PreAuthorize("hasRole('ADMIN')")
    public Set<PaymentResponseDto> getAllPayments() {
        return paymentService.getAllPayments();
    }
    
    @GetMapping("/status/{reservationId}")
    public PaymentStatus getPaymentStatusByReservationId(@PathVariable Integer reservationId) {
        return paymentService.getPaymentStatusByReservationId(reservationId);
    }

    @DeleteMapping("/delete/{reservationId}")
    public String deletePaymentByReservationId(@PathVariable Integer reservationId) {
        paymentService.deletePaymentByReservationId(reservationId);
        return "Payment cancelled successfully.";
    }

}