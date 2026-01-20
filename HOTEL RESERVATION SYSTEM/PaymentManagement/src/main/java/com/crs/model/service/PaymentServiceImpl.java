package com.crs.model.service;

import com.crs.feign.ReservationClient;
import com.crs.feign.RoomClient;
import com.crs.model.dto.InitiatePaymentDto;
import com.crs.model.dto.PaymentResponseDto;
import com.crs.model.dto.ProcessPaymentDto;
import com.crs.model.entity.Payment;
import com.crs.model.entity.Payment.PaymentStatus;
import com.crs.model.exception.CustomException;
import com.crs.model.repository.PaymentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ReservationClient reservationClient;

    @Autowired
    private RoomClient RoomClient;

    @Override
    public PaymentResponseDto initiatePayment(InitiatePaymentDto dto) {

        Payment payment;
        if (paymentRepository.existsByReservationId(dto.getReservationId())) {
            payment = getPaymentByReservationId(dto.getReservationId());
        } else {
            payment = new Payment();
        }

        LocalDate checkIn = dto.getCheckInDate();
        LocalDate checkOut = dto.getCheckOutDate();
        Double price = (RoomClient.getRoomById(dto.getRoomId())).getPricePerNight();
        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);

        Double totalAmount = price * nights;

        payment.setReservationId(dto.getReservationId());
        payment.setCustomerId(dto.getCustomerId());
        payment.setAmount(totalAmount);
        payment.setPaymentMethod(null);
        payment.setPaymentStatus(Payment.PaymentStatus.INCOMPLETE);
        payment.setPaymentDate(LocalDateTime.now());
        

        Payment savedPayment = paymentRepository.save(payment);

        return new PaymentResponseDto(
                savedPayment.getPaymentId(),
                savedPayment.getReservationId(),
                savedPayment.getCustomerId(),
                savedPayment.getAmount(),
                savedPayment.getPaymentMethod(),
                savedPayment.getPaymentStatus(),
                savedPayment.getPaymentDate(),
                "Payment initiated successfully"
        );
    }

    @Override
    public PaymentResponseDto processPayment(ProcessPaymentDto dto) {

        Payment payment = getPaymentByReservationId(dto.getReservationId());

        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setPaymentStatus(dto.getPaymentStatus());
        Payment updatedPayment = paymentRepository.save(payment);

        reservationClient.updateReservationStatusBasedOnPayment(dto.getReservationId());

        return new PaymentResponseDto(
                updatedPayment.getPaymentId(),
                updatedPayment.getReservationId(),
                updatedPayment.getCustomerId(),
                updatedPayment.getAmount(),
                updatedPayment.getPaymentMethod(),
                updatedPayment.getPaymentStatus(),
                updatedPayment.getPaymentDate(),
                "Payment processed successfully"
        );
    }

    @Override
    public PaymentResponseDto getPaymentById(int paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new CustomException("Payment not found with ID: " + paymentId));

        return mapToDto(payment, null);
    }

    @Override
    public Payment getPaymentByReservationId(Integer reservationId) {
        Payment payment = paymentRepository.findByReservationId(reservationId);
        if (payment == null) {
            throw new CustomException("Payment not found for reservation ID: " + reservationId);
        }
        return payment;
    }

    @Override
    public Set<PaymentResponseDto> getAllPayments() {
        List<Payment> payments = paymentRepository.findAll();
        Set<PaymentResponseDto> dtos = new LinkedHashSet<>();
        for (Payment payment : payments) {
            dtos.add(mapToDto(payment, null));
        }
        return dtos;
    }

    private PaymentResponseDto mapToDto(Payment payment, String message) {
        return new PaymentResponseDto(
                payment.getPaymentId(),
                payment.getReservationId(),
                payment.getCustomerId(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getPaymentStatus(),
                payment.getPaymentDate(),
                message
        );
    }

    @Override
    public PaymentStatus getPaymentStatusByReservationId(Integer reservationId) {
        Payment payment = paymentRepository.findByReservationId(reservationId);
        if (payment == null) {
            throw new RuntimeException("Payment with reservation ID " + reservationId + " not found.");
        }
        return payment.getPaymentStatus();
    }
    
    @Override
    public void deletePaymentByReservationId(Integer reservationId) {
        Payment payment = getPaymentByReservationId(reservationId);
        if(payment.getPaymentStatus() == PaymentStatus.SUCCESS) {
            payment.setPaymentStatus(PaymentStatus.REFUNDED);
        } else if (payment.getPaymentStatus() == PaymentStatus.PENDING) {
            payment.setPaymentStatus(PaymentStatus.INCOMPLETE);
        }
        paymentRepository.save(payment);
        return;
    }
}