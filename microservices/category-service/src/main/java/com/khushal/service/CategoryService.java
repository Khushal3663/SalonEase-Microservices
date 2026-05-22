package com.khushal.service;

import com.khushal.model.Category;
import com.khushal.payload.dto.SalonDTO;

import java.util.Set;

public interface CategoryService {

	Category saveCategory(Category category, SalonDTO salonDTO);

	Set<Category> getAllCategoriesBySalon(Long id);

	Category getCategoryById(Long id) throws Exception;

	void deleteCategoryById(Long id, Long salonId) throws Exception;

	Category getCategoryByIdAndSalonId(Long id, Long salonId) throws Exception;
}
