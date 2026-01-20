package com.crs.model.dto;
import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HotelDTO {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer hotelId;
    private String name;
    private String location;
    private String contactNumber;
    private Double rating;
    private String hotelImgUrl;
    private List<RoomDTO> rooms;
}
