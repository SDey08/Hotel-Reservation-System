package com.crs.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reservationId;

    private Integer customerId;

    private Integer roomId;

    private Integer hotelId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RoomType roomType;

    @Column(nullable = false)
    private LocalDate checkInDate;

    @Column(nullable = false)
    private LocalDate checkOutDate;

    @Column(nullable = false)
    private LocalDateTime reservationDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus;

    @Min(value=1,message="No. of guests must be greater than 0")
    int noOfGuests;

    public enum Status {
        INCOMPLETE, BOOKED, CANCELLED, COMPLETED
    }

    public enum RoomType {
        SINGLE, DOUBLE, SUITE, DELUXE
    }

    public enum PaymentStatus{
        INCOMPLETE, PENDING, SUCCESS, FAILED, REFUNDED
    }
}