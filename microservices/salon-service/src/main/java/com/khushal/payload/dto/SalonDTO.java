package com.khushal.payload.dto;

import java.time.LocalTime;
import java.util.List;

import lombok.Data;

@Data
public class SalonDTO {
	private Long id;

	private String name;

	private List<String> images;

	private String address;

	private String email;

	private String city;

	private String phoneNumber;

	private Long ownerId;

	private LocalTime openTime;

	private LocalTime closeTime;
}
