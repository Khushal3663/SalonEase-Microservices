package com.khushal.service;

import com.khushal.model.ServiceOffering;
import com.khushal.payload.dto.CategoryDTO;
import com.khushal.payload.dto.SalonDTO;
import com.khushal.payload.dto.ServiceDTO;

import java.util.Set;

public interface ServiceOfferingService {

	ServiceOffering createService(SalonDTO salonDto, ServiceDTO serviceDTO, CategoryDTO categoryDTO);

	ServiceOffering updateService(Long serviceId, ServiceOffering service) throws Exception;

	Set<ServiceOffering> getAllServiceBySalonId(Long salonId, Long categoryId);

	Set<ServiceOffering> getServicesByIds(Set<Long> ids); // multiple ids

	ServiceOffering getServiceById(Long id) throws Exception;

}
