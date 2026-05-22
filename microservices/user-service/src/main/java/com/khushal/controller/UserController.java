package com.khushal.controller;

import com.khushal.model.User;
import com.khushal.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	@PostMapping("/api/users")
	public ResponseEntity<User> createUser(@RequestBody @Valid User user) {
		User createdUser = userService.createUser(user);
		return new ResponseEntity<User>(createdUser, HttpStatus.CREATED);
	}

	@GetMapping("/api/users")
	public ResponseEntity<List<User>> getUsers() {
		List<User> users = userService.getAllUsers();
		return new ResponseEntity<>(users, HttpStatus.OK);
	}

	@GetMapping("/api/users/{id}")
	public ResponseEntity<User> getUserById(@PathVariable Long id) throws Exception {
		User existingUser = userService.getUserById(id);
		return new ResponseEntity<>(existingUser, HttpStatus.OK);
	}

	@PutMapping("/api/users/{id}")
	public ResponseEntity<User> updateUserById(@RequestBody User user, @PathVariable Long id) throws Exception {
		User updatedUser = userService.
				updateUser(id, user);
		return new ResponseEntity<>(updatedUser, HttpStatus.OK);
	}

	@DeleteMapping("/api/users/{id}")
	public ResponseEntity<String> deleteUserById(@PathVariable Long id) throws Exception {
		userService.deleteUser(id);
		return new ResponseEntity<>("User deleted is successfully", HttpStatus.ACCEPTED);
	}

	@GetMapping("/api/users/profile")
	public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String jwt) throws Exception {
		User user = userService.getUserFromJwt(jwt);
		return new ResponseEntity<User>(user, HttpStatus.OK);
	}

	@PostMapping("/api/users/bulk")
	public ResponseEntity<List<User>> getUsersInBulk(@RequestBody List<Long> ids) {
		if (ids == null || ids.isEmpty()) {
			return ResponseEntity.ok(Collections.emptyList());
		}
		return ResponseEntity.ok(userService.getUsersByIds(ids));
	}

}
