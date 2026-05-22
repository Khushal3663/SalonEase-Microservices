package com.khushal.service;

import com.khushal.mapper.SalonMapper;
import com.khushal.model.Salon;
import com.khushal.payload.dto.SalonDTO;
import com.khushal.payload.dto.UserDTO;
import com.khushal.repository.SalonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalonServiceImpl implements SalonService {

	private final SalonRepository salonRepository;

	@Override
	public Salon createSalon(SalonDTO req, UserDTO user) {
		// TODO Auto-generated method stub

		Salon salon = new Salon();

		salon.setName(req.getName());
		salon.setAddress(req.getAddress());
		salon.setCity(req.getCity());
		salon.setEmail(req.getEmail());
		salon.setImages(req.getImages());
		salon.setOwnerId(user.getId());
		salon.setOpenTime(req.getOpenTime());
		salon.setCloseTime(req.getCloseTime());
		salon.setPhoneNumber(req.getPhoneNumber());

		return salonRepository.save(salon);
	}

	@Override
	public Salon updateSalon(SalonDTO salonDTO, UserDTO user, Long salonId) throws Exception {

		Optional<Salon> opt = salonRepository.findById(salonId);

		if (opt.isEmpty() || !salonDTO.getOwnerId().equals(user.getId())) {
			throw new Exception("Salon not exist with id " + salonId);
		}

		Salon existingSalon = opt.get();

		existingSalon.setName(salonDTO.getName());
		existingSalon.setAddress(salonDTO.getAddress());
		existingSalon.setCity(salonDTO.getCity());
		existingSalon.setPhoneNumber(salonDTO.getPhoneNumber());
		existingSalon.setEmail(salonDTO.getEmail());
		existingSalon.setImages(salonDTO.getImages());
		existingSalon.setOwnerId(user.getId());
		existingSalon.setOpenTime(salonDTO.getOpenTime());
		existingSalon.setCloseTime(salonDTO.getCloseTime());

		return salonRepository.save(existingSalon);
	}

	@Override
	public List<Salon> getAllSalons() {
		return salonRepository.findAll();
	}

	@Override
	public Salon getSalonById(Long salonId) throws Exception {
		Salon salon = salonRepository.findById(salonId).orElse(null);

		if (salon == null) {
			throw new Exception("salon not exist");
		}
		return salon;
	}

	@Override
	public Salon getSalonByOwnerId(Long ownerId) throws Exception {
		Salon salon = salonRepository.findByOwnerId(ownerId).orElse(null);

		if (salon == null) {
			throw new Exception("salon not exist");
		}
		return salon;
	}

	@Override
	public List<Salon> searchSalonByCity(String city) {
		return salonRepository.searchSaloons(city);
	}

	@Override
	public List<SalonDTO> getSalonsByIds(List<Long> ids) {
		List<Salon> salons = salonRepository.findAllById(ids);

		return salons.stream()
				.map(SalonMapper::mapTODTO)
				.collect(Collectors.toList());
	}

}
