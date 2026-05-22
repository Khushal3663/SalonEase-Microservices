package com.khushal.service.impl;

import com.khushal.model.User;
import com.khushal.payload.dto.AuthResponse;
import com.khushal.payload.dto.SignUpDTO;
import com.khushal.payload.dto.TokenResponse;
import com.khushal.repository.UserRepository;
import com.khushal.service.AuthService;
import com.khushal.service.KeycloakService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final KeycloakService keycloakService;

    @Override
    public AuthResponse login(String username, String password) throws Exception {
        TokenResponse tokenResponse = keycloakService.getAdminAccessToken(
                username,
                password,
                "password",
                null);

        User user = userRepository.findByUsername(username);

        return AuthResponse.builder()
                .jwt(tokenResponse.getAccessToken())
                .refreshToken(tokenResponse.getRefreshToken())
                .role(user != null ? user.getRole() : null)
                .message("Login Successfully")
                .build();
    }

    @Override
    public AuthResponse signup(SignUpDTO req) throws Exception {
        keycloakService.createUser(req);

        User user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(req.getPassword());
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        user.setRole(req.getRole());
        user.setFullName(req.getFullName());
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        TokenResponse tokenResponse = keycloakService.getAdminAccessToken(
                req.getUsername(),
                req.getPassword(),
                "password",
                null);

        return AuthResponse.builder()
                .jwt(tokenResponse.getAccessToken())
                .refreshToken(tokenResponse.getRefreshToken())
                .message("Login Successfully")
                .build();
    }

    @Override
    public AuthResponse getAccessTokenFromRefreshToken(String refreshToken) throws Exception {
        TokenResponse tokenResponse = keycloakService.getAdminAccessToken(
                null,
                null,
                "refresh_token",
                refreshToken);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setRefreshToken(tokenResponse.getRefreshToken());
        authResponse.setJwt(tokenResponse.getAccessToken());
        authResponse.setMessage("Login Successfully");

        return authResponse;
    }
}
