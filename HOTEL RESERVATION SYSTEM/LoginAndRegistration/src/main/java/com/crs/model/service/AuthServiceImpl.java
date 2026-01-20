package com.crs.model.service;

import com.crs.model.dto.LoginRequestDto;
import com.crs.model.dto.LoginResponseDto;
import com.crs.model.entity.User;
import com.crs.model.repository.UserRepository;
import com.crs.security.JwtService;
import com.crs.model.entity.Admin;
import com.crs.model.entity.Customer;
import com.crs.model.repository.AdminRepository;
import com.crs.model.repository.CustomerRepository;
import java.util.List;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authManager;
    @Override
    @Transactional
    public String registerCustomer(Customer customer) {
        String encodedPassword = passwordEncoder.encode(customer.getPassword());
    
        User user = new User();
        user.setEmail(customer.getEmail());
        user.setPassword(encodedPassword);
        user.setRole(User.Role.CUSTOMER);
        userRepository.save(user);
    
        customer.setPassword(encodedPassword);
        customerRepository.save(customer);
    
        return "Customer registered successfully";
    }
    
    @Override
    @Transactional
    public String registerAdmin(Admin admin) {
        String encodedPassword = passwordEncoder.encode(admin.getPassword());
    
        User user = new User();
        user.setEmail(admin.getEmail());
        user.setPassword(encodedPassword);
        user.setRole(User.Role.ADMIN);
        userRepository.save(user);
    
        admin.setPassword(encodedPassword);
        adminRepository.save(admin);
    
        return "Admin registered successfully";
    }
    

    @Override
    public LoginResponseDto login(LoginRequestDto request) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user);

        return new LoginResponseDto(token, user.getEmail(), user.getRole().name(), "Login successful");
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public boolean customerExistsById(Integer customerId) {
        return customerRepository.existsById(customerId);
    }

    @Override
    public boolean adminExistsById(Integer adminId) {
        return adminRepository.existsById(adminId);
    }
    
    @Override
    public Admin getAdminByEmail(String email) {
        return adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    }

    @Override
    public Customer getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }
}