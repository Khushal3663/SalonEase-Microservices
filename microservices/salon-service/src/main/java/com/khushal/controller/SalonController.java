package com.khushal.controller;

import com.khushal.mapper.SalonMapper;
import com.khushal.model.Salon;
import com.khushal.payload.dto.SalonDTO;
import com.khushal.payload.dto.UserDTO;
import com.khushal.service.SalonService;
import com.khushal.service.client.UserFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/salons")
@RequiredArgsConstructor
public class SalonController {

	private final SalonService salonservice;
	private final UserFeignClient userFeignClient;

	@PostMapping
	public ResponseEntity<SalonDTO> createSalon(@RequestBody SalonDTO salonDTO, @RequestHeader("Authorization") String jwt) throws Exception {
		UserDTO userDTO = userFeignClient.getUserProfile(jwt).getBody();

		Salon salon = salonservice.createSalon(salonDTO, userDTO);
		SalonDTO salonDTO1 = SalonMapper.mapTODTO(salon);

		return ResponseEntity.ok(salonDTO1);
	}

	@PatchMapping("/{salonId}")
	public ResponseEntity<SalonDTO> updateSalon(@PathVariable Long salonId, @RequestBody SalonDTO salonDTO, @RequestHeader("Authorization") String jwt)
			throws Exception {
		UserDTO userDTO = userFeignClient.getUserProfile(jwt).getBody();

		Salon salon = salonservice.updateSalon(salonDTO, userDTO, salonId);
		SalonDTO salonDTO1 = SalonMapper.mapTODTO(salon);
		return ResponseEntity.ok(salonDTO1);
	}

	@GetMapping
	public ResponseEntity<List<SalonDTO>> getAllSalons() {
		List<Salon> salons = salonservice.getAllSalons();

		List<SalonDTO> salonDTOs = salons.stream().map(salon -> {
			SalonDTO salonDTO = SalonMapper.mapTODTO(salon);
			return salonDTO;
		}).collect(Collectors.toList());

		return ResponseEntity.ok(salonDTOs);
	}

	@GetMapping("/{salonId}")
	public ResponseEntity<SalonDTO> getSalonById(@PathVariable Long salonId) throws Exception {

		Salon salon = salonservice.getSalonById(salonId);
		SalonDTO salonDTO = SalonMapper.mapTODTO(salon);

		return ResponseEntity.ok(salonDTO);
	}

//	http://localhost:5002/api/salons/search?city=mumbai
	@GetMapping("/search")
	public ResponseEntity<List<SalonDTO>> searchSalons(@RequestParam("city") String city) {
		List<Salon> salons = salonservice.searchSalonByCity(city);

		List<SalonDTO> salonDTOs = salons.stream().map(salon -> {
			SalonDTO salonDTO = SalonMapper.mapTODTO(salon);
			return salonDTO;
		}).collect(Collectors.toList());

		return ResponseEntity.ok(salonDTOs);
	}

	@GetMapping("/owner")
	public ResponseEntity<SalonDTO> getSalonByOwnerId(@RequestHeader("Authorization") String jwt) throws Exception {
		UserDTO userDTO = userFeignClient.getUserProfile(jwt).getBody();

		if(userDTO == null) {
			throw new Exception("user not found from jwt");
		}

		Salon salon = salonservice.getSalonByOwnerId(userDTO.getId());
		SalonDTO salonDTO = SalonMapper.mapTODTO(salon);

		return ResponseEntity.ok(salonDTO);
	}

	@PostMapping("/bulk")
	public ResponseEntity<List<SalonDTO>> getAllSalonsInBulk(@RequestBody List<Long> ids){
		if (ids == null || ids.isEmpty()) {
			return ResponseEntity.ok(Collections.emptyList());
		}
		return ResponseEntity.ok(salonservice.getSalonsByIds(ids));
	}
}
