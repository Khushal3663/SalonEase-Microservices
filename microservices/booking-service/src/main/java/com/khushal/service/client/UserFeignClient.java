package com.khushal.service.client;

import com.khushal.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient("USER-SERVICE")
public interface UserFeignClient {
    @GetMapping("/api/users/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) throws Exception;

    @GetMapping("/api/users/profile")
    public ResponseEntity<UserDTO> getUserProfile(@RequestHeader("Authorization") String jwt) throws Exception;

    @PostMapping("/api/users/bulk")
    public ResponseEntity<List<UserDTO>> getUsersInBulk(@RequestBody List<Long> ids);
}
