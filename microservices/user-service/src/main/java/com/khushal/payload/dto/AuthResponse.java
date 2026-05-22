package com.khushal.payload.dto;

import com.khushal.domain.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String jwt;
    private String refreshToken;
    private String message;
    private String title;
    private UserRole role;
}
