package com.ark.AviClear.service;

import com.ark.AviClear.dto.AuthResponse;
import com.ark.AviClear.dto.UserRequest;
import com.ark.AviClear.entity.Role;
import com.ark.AviClear.entity.User;
import com.ark.AviClear.repository.UserRepository;
import com.ark.AviClear.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(String username, String password, Role role) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        userRepository.save(user);
        String token = jwtUtil.generateToken(username);
        return new AuthResponse(token, username, role.name());
    }

    public AuthResponse login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        String token = jwtUtil.generateToken(username);
        return new AuthResponse(token, username, user.getRole().name());
    }


}
