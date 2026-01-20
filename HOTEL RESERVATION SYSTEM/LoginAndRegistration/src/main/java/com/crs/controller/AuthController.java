package com.crs.controller;

import com.crs.model.dto.LoginRequestDto;
import com.crs.model.dto.LoginResponseDto;
import com.crs.model.service.AuthService;
import com.crs.model.entity.Admin;
import com.crs.model.entity.Customer;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    
    // PUBLIC ENDPOINTS (no auth required)
    @PostMapping("/register/customer")
    public ResponseEntity<String> registerCustomer(@RequestBody @Valid Customer customer) {
        authService.registerCustomer(customer);
        return ResponseEntity.ok("Customer registered successfully");
    }

    @PostMapping("/register/admin")
    public ResponseEntity<String> registerAdmin(@RequestBody @Valid Admin admin) {
        authService.registerAdmin(admin);
        return ResponseEntity.ok("Admin registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody @Valid LoginRequestDto loginRequest) {
        LoginResponseDto response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/customer/profile/{email}")
    public ResponseEntity<Customer> getCustomerProfile(@PathVariable String email) {
        Customer profile = authService.getCustomerByEmail(email);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/admin/profile/{email}")
    public ResponseEntity<Admin> getAdminProfile(@PathVariable String email) {
        Admin profile = authService.getAdminByEmail(email);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        List<Customer> customers = authService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }
}