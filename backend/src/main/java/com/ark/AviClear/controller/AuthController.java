package com.ark.AviClear.controller;

import com.ark.AviClear.dto.AuthResponse;
import com.ark.AviClear.dto.UserRequest;
import com.ark.AviClear.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody UserRequest userRequest) {
        AuthResponse response = authService.register(
                userRequest.getUsername(), userRequest.getPassword(), userRequest.getRole());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody UserRequest userRequest) {
        AuthResponse response = authService.login(
                userRequest.getUsername(), userRequest.getPassword());
        return ResponseEntity.ok(response);
    }

}
