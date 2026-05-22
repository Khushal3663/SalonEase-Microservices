package com.khushal.payload.dto;

import com.khushal.domain.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class SignUpDTO {
    private String fullName;
    private String email;
    private String phone;
    private String password;
    private String username;
    private UserRole role;
}
