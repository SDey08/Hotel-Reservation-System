package com.crs.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crs.model.entity.Hotel;

import java.util.List;
public interface HotelRepository extends JpaRepository<Hotel, Integer> {
    boolean existsByNameAndLocation(String name, String location);
    
    List<Hotel> findByLocationContainingIgnoreCase(String location);

    List<Hotel> findByNameContainingIgnoreCase(String name);

    boolean existsByHotelId(int hotelId);
}