package com.crs.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.crs.model.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    
    Payment findByReservationId(Integer reservationId);

    boolean existsByReservationId(Integer reservationId);

}