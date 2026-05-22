package com.khushal.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
	
	@GetMapping("/home")
	public String HomeControllerHandler() {
		return "user microservices for salon Booking System";
	}
}
