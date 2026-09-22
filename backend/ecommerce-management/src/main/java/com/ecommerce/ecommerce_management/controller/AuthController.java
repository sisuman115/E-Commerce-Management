package com.ecommerce.ecommerce_management.controller;

import com.ecommerce.ecommerce_management.dto.LoginRequest;
import com.ecommerce.ecommerce_management.dto.LoginResponse;
import com.ecommerce.ecommerce_management.dto.UserRequest;
import com.ecommerce.ecommerce_management.dto.UserResponse;
import com.ecommerce.ecommerce_management.service.AuthService;
import com.ecommerce.ecommerce_management.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AuthService authService;

    public AuthController(
            UserService userService,
            AuthService authService) {

        this.userService = userService;
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody UserRequest request) {

        UserResponse userResponse = userService.registerUser(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(userResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }
}