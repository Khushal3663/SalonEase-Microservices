package com.khushal.mapper;

import com.khushal.model.Salon;
import com.khushal.payload.dto.SalonDTO;

public class SalonMapper {
	public static SalonDTO mapTODTO(Salon salon) {
		SalonDTO salonDTO = new SalonDTO();
		salonDTO.setId(salon.getId());
		salonDTO.setName(salon.getName());
		salonDTO.setAddress(salon.getAddress());
		salonDTO.setEmail(salon.getEmail());
		salonDTO.setCity(salon.getCity());
		salonDTO.setImages(salon.getImages());
		salonDTO.setCloseTime(salon.getCloseTime());
		salonDTO.setOpenTime(salon.getOpenTime());
		salonDTO.setPhoneNumber(salon.getPhoneNumber());
		salonDTO.setOwnerId(salon.getOwnerId());

		return salonDTO;
	}
}
