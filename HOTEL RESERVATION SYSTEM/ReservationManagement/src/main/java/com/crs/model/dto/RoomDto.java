package com.crs.model.dto;


import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomDto {

    private Integer roomId;
    private String roomType;
    private BigDecimal pricePerNight;
    private String status;
    private Integer hotelId;
    private String roomImgUrl;
} 
