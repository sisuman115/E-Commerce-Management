package com.ecommerce.ecommerce_management.controller;

import com.ecommerce.ecommerce_management.dto.AddressRequest;
import com.ecommerce.ecommerce_management.dto.AddressResponse;
import com.ecommerce.ecommerce_management.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PostMapping
    public ResponseEntity<AddressResponse> addAddress(
            @Valid @RequestBody AddressRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        AddressResponse response =
                addressService.addAddress(email, request);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getMyAddresses(
            Authentication authentication) {

        String email = authentication.getName();

        List<AddressResponse> addresses =
                addressService.getMyAddresses(email);

        return ResponseEntity.ok(addresses);
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Long addressId,
            @Valid @RequestBody AddressRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        AddressResponse response =
                addressService.updateAddress(email, addressId, request);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<String> deleteAddress(
            @PathVariable Long addressId,
            Authentication authentication) {

        String email = authentication.getName();

        addressService.deleteAddress(email, addressId);

        return ResponseEntity.ok("Address deleted successfully");
    }

    @PutMapping("/{addressId}/default")
    public ResponseEntity<AddressResponse> setDefaultAddress(
            @PathVariable Long addressId,
            Authentication authentication) {

        String email = authentication.getName();

        AddressResponse response =
                addressService.setDefaultAddress(email, addressId);

        return ResponseEntity.ok(response);
    }
}