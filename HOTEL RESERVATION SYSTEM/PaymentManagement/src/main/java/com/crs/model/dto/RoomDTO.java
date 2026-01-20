package com.crs.model.dto;

import lombok.*;
@Data
public class RoomDTO {
    private Integer roomId;
    private String roomType;
    private Double pricePerNight;
    private String status;
    private Integer hotelId;
    private String roomImgUrl;
}
