package com.crs.model.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int customerId;

    @NotBlank(message = "Name cannot be blank")
    private String name;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be exactly 8 characters long")
    private String password;

    @NotBlank(message = "Address is required")
    private String address;

    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
    @NotBlank(message = "Phone no. is required")
    private String phone;

    @Pattern(regexp = "^[0-9]{12}$", message = "Aadhar number must be 12 digits")
    @NotBlank(message = "Aadhar Number is required")
    @Column(unique = true)
    private String aadharNumber;

    @Pattern(regexp = "^[0-9]{6}$", message = "Pin code must be 6 digits")
    @NotBlank(message = "PIN code is required")
    private String pin_code;
}
