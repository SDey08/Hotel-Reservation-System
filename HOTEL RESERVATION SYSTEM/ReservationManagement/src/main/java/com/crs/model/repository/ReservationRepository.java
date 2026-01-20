package com.crs.model.repository;
import com.crs.model.entity.Reservation;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.*;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {

  @Query("""
    SELECT CASE WHEN COUNT(r) > 0 THEN TRUE ELSE FALSE END
    FROM Reservation r
    WHERE r.hotelId = :hotelId
      AND r.roomId = :roomId
      AND r.status = 'BOOKED'
      AND r.checkInDate < :checkOutDate
      AND r.checkOutDate > :checkInDate
""")
    boolean existsByHotelIdAndRoomIdAndDateRange(
            @Param("hotelId") Integer hotelId,
            @Param("roomId") Integer roomId,
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate
    );

    List<Reservation> findByStatus(Reservation.Status status);

    List<Reservation> findByCustomerIdAndStatus(Integer customerId, Reservation.Status status);
    
    @Query("""
      SELECT r 
      FROM Reservation r 
      WHERE r.hotelId = :hotelId 
        AND r.checkInDate <= :date
        AND r.checkOutDate >= :date
        AND r.status = 'BOOKED'
""")
    List<Reservation> findByHotelIdAndDate(
            @Param("hotelId") Integer hotelId, 
            @Param("date") LocalDate date
    );

}