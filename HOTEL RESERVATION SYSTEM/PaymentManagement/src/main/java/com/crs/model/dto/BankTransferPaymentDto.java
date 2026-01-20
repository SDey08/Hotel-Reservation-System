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
public class BankTransferPaymentDto {

    @NotNull(message = "Reservation ID is required")
    private Integer reservationId;

    @NotNull(message = "Customer ID is required")
    private Integer customerId;

    @NotNull(message = "Amount is required")
    private Double amount;

    @NotNull(message = "IFSC code is required")
    @Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$", message = "Invalid IFSC code format")
    private String ifsc;

    @NotNull(message = "Account number is required")
    @Pattern(regexp = "^\\d{9,18}$", message = "Account number must be 9 to 18 digits")
    private String accountNumber;
}
