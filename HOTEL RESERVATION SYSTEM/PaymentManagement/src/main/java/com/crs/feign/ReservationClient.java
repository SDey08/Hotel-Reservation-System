package com.crs.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;


@FeignClient(name = "ReservationService", url = "http://localhost:8082")
public interface ReservationClient {

    @PostMapping("/reservation/updateStatus/{reservationId}")
    public String updateReservationStatusBasedOnPayment(@PathVariable("reservationId") Integer reservationId);
}
