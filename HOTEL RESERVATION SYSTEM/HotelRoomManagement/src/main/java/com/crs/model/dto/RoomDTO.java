package com.crs.model.dto;

import lombok.*;

import java.math.BigDecimal;

import com.crs.model.entity.Room.RoomStatus;
import com.crs.model.entity.Room.RoomType;
import jakarta.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomDTO {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer roomId;
    private RoomType roomType;
    private BigDecimal pricePerNight;
    private RoomStatus status;
    private Integer hotelId; 
    private String roomImgUrl;
}