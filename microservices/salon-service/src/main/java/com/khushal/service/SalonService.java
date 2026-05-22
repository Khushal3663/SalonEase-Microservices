package com.khushal.service;

import com.khushal.model.Salon;
import com.khushal.payload.dto.SalonDTO;
import com.khushal.payload.dto.UserDTO;

import java.util.List;

public interface SalonService {
	Salon createSalon(SalonDTO salon, UserDTO user);

	Salon updateSalon(SalonDTO salon, UserDTO user, Long salonId) throws Exception;

	List<Salon> getAllSalons();

	Salon getSalonById(Long salonId) throws Exception;

	Salon getSalonByOwnerId(Long ownerId) throws Exception;

	List<Salon> searchSalonByCity(String city);

	List<SalonDTO> getSalonsByIds(List<Long> ids);

}
