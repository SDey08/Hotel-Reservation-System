package com.crs.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HotelResponseDto {
    private Integer hotelId;
    private String name;
    private String location;
    private String contactNumber;
    private double rating;
    private String hotelImgUrl;
}