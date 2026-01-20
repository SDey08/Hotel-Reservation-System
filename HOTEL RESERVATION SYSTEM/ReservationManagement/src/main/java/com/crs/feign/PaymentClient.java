package com.crs.feign; 

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.crs.model.dto.InitiatePaymentDto;
import com.crs.model.entity.Reservation.PaymentStatus;

@FeignClient(name = "PaymentService", url = "http://localhost:8084")
public interface PaymentClient {

    @GetMapping("/payments/status/{reservationId}")
    PaymentStatus getPaymentStatusByReservationId(@PathVariable("reservationId") Integer reservationId);

    @PostMapping("/payments/initiate")
    void initiatePayment(@RequestBody InitiatePaymentDto initiatePaymentDto);

    @DeleteMapping("/payments/delete/{reservationId}") 
    public String deletePaymentByReservationId(@PathVariable Integer reservationId);

}

