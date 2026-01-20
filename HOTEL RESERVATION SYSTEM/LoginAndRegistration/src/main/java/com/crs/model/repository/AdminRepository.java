package com.crs.model.repository;

import com.crs.model.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Integer> {
    Optional<Admin> findByEmail(String email);
    boolean existsById(int adminId);
}
