package com.crs.model.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardPaymentDto {

    @NotNull(message = "Reservation ID is required")
    private Integer reservationId;

    @NotNull(message = "Customer ID is required")
    private Integer customerId;

    @NotNull(message = "Amount is required")
    private Double amount;

    @NotNull(message = "Card number is required")
    @Pattern(regexp = "^\\d{13,19}$", message = "Card number must be 13 to 19 digits")
    private String cardNumber;

    @NotNull(message = "CVV is required")
    @Pattern(regexp = "^\\d{3,4}$", message = "CVV must be 3 or 4 digits")
    private String cvv;

    @NotNull(message = "Expiry date is required")
    @Pattern(regexp = "^(0[1-9]|1[0-2])/\\d{2}$", message = "Expiry date must be in MM/YY format")
    private String expiryDate;
}

