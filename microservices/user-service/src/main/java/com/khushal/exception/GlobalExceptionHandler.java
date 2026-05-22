package com.khushal.exception;

import com.khushal.payload.response.ExceptionResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ExceptionResponse> ExceptionHandler(Exception ex, WebRequest req) {
		String message = ex.getMessage();
		HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

		// Detect Keycloak's 409 Conflict (User already exists)
		if (message.contains("409") || message.contains("User exists") || message.contains("same email")) {
			message = "An account with this email address already exists.";
			status = HttpStatus.CONFLICT; // 409
		}

		// Detect Keycloak's 400 Bad Request (wrong credentails)
		if (message.contains("400")) {
			message = "Wrong credentials. Please provide right values.";
			status = HttpStatus.BAD_REQUEST; // 400
		}
		// Detect 401 Unauthorized
		else if (message.contains("401") || message.contains("credentials")) {
			message = "Invalid email or password.";
			status = HttpStatus.UNAUTHORIZED; // 401
		}

		ExceptionResponse response = new ExceptionResponse(
				message,
				req.getDescription(false),
				LocalDateTime.now()
		);

		return ResponseEntity.status(status).body(response);
	}
}
