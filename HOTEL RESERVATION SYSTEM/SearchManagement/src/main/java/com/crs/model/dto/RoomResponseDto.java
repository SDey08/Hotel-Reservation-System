package com.crs.model.dto;

import java.math.BigDecimal;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomResponseDto {
    private Integer roomId;
    private RoomType roomType;
    private BigDecimal pricePerNight;
    private String roomImgUrl;

    public enum RoomType {
        SINGLE, DOUBLE, SUITE, DELUXE
    }
}

