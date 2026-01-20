package com.crs.model.service;
import java.util.List;
import com.crs.model.dto.LoginRequestDto;
import com.crs.model.dto.LoginResponseDto;
import com.crs.model.entity.Admin;
import com.crs.model.entity.Customer;

public interface AuthService {
    String registerCustomer(Customer customer);
    String registerAdmin(Admin admin);
    LoginResponseDto login(LoginRequestDto request);
    List<Customer> getAllCustomers();
    boolean customerExistsById(Integer customerId);
    boolean adminExistsById(Integer adminId);
    Admin getAdminByEmail(String email);
    Customer getCustomerByEmail(String email);
}