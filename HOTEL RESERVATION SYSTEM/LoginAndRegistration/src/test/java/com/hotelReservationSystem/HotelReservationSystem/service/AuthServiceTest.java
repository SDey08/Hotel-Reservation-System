package com.hotelReservationSystem.HotelReservationSystem.service;

import com.crs.model.dto.LoginRequestDto;
import com.crs.model.dto.LoginResponseDto;
import com.crs.model.entity.Admin;
import com.crs.model.entity.Customer;
import com.crs.model.entity.User;
import com.crs.model.repository.AdminRepository;
import com.crs.model.repository.CustomerRepository;
import com.crs.model.repository.UserRepository;
import com.crs.model.service.AuthServiceImpl;
import com.crs.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authManager;

    @InjectMocks
    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void registerCustomer_ShouldSaveUserAndCustomer() {
        Customer customer = new Customer();
        customer.setEmail("cust@example.com");
        customer.setPassword("plain123");

        when(passwordEncoder.encode("plain123")).thenReturn("encoded");

        String result = authService.registerCustomer(customer);

        assertEquals("Customer registered successfully", result);
        verify(userRepository).save(any(User.class));
        verify(customerRepository).save(any(Customer.class));
    }

    @Test
    void registerAdmin_ShouldSaveUserAndAdmin() {
        Admin admin = new Admin();
        admin.setEmail("admin@example.com");
        admin.setPassword("plain123");

        when(passwordEncoder.encode("plain123")).thenReturn("encoded");

        String result = authService.registerAdmin(admin);

        assertEquals("Admin registered successfully", result);
        verify(userRepository).save(any(User.class));
        verify(adminRepository).save(any(Admin.class));
    }

    @Test
    void login_ShouldReturnTokenAndDetails() {
        LoginRequestDto request = new LoginRequestDto();
        request.setEmail("user@example.com");
        request.setPassword("pass");

        User user = new User();
        user.setEmail("user@example.com");
        user.setPassword("encoded");
        user.setRole(User.Role.CUSTOMER);

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("jwt-token");

        LoginResponseDto response = authService.login(request);

        verify(authManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        assertEquals("jwt-token", response.getToken());
        assertEquals("user@example.com", response.getEmail());
        assertEquals("CUSTOMER", response.getRole());
    }

    @Test
    void getAllCustomers_ShouldReturnList() {
        when(customerRepository.findAll()).thenReturn(List.of(new Customer()));
        assertEquals(1, authService.getAllCustomers().size());
    }

    @Test
    void getAdminByEmail_ShouldReturnAdmin() {
        Admin admin = new Admin();
        admin.setEmail("admin@example.com");

        when(adminRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(admin));

        Admin result = authService.getAdminByEmail("admin@example.com");
        assertEquals("admin@example.com", result.getEmail());
    }

    @Test
    void getCustomerByEmail_ShouldReturnCustomer() {
        Customer cust = new Customer();
        cust.setEmail("cust@example.com");

        when(customerRepository.findByEmail("cust@example.com")).thenReturn(Optional.of(cust));

        Customer result = authService.getCustomerByEmail("cust@example.com");
        assertEquals("cust@example.com", result.getEmail());
    }
}