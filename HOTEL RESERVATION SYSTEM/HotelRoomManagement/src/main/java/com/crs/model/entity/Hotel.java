package com.crs.model.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hotel_id")
    private Integer hotelId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    @Column(name = "contact_number", length = 15, nullable = false)
    private String contactNumber;

    private Double rating;

    private String hotelImgUrl;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Room> rooms;
}