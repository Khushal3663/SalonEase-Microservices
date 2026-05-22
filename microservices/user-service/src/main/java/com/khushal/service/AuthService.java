package com.khushal.service;

import com.khushal.payload.dto.AuthResponse;
import com.khushal.payload.dto.SignUpDTO;

public interface AuthService {
    AuthResponse login(String username, String password) throws Exception;
    AuthResponse signup(SignUpDTO signUpDTO) throws Exception;
    AuthResponse getAccessTokenFromRefreshToken(String refreshToken) throws Exception;
}
