package com.khushal.controller;

import com.khushal.model.Category;
import com.khushal.payload.dto.SalonDTO;
import com.khushal.service.CategoryService;
import com.khushal.service.client.SalonFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories/salon-owner")
public class SalonCategoryController {
	private final CategoryService categoryService;
	private final SalonFeignClient  salonFeignClient;

	@PostMapping()
	public ResponseEntity<Category> createCategory(@RequestBody Category category, @RequestHeader("Authorization") String jwt) throws Exception {
		SalonDTO salonDTO = salonFeignClient.getSalonByOwnerId(jwt).getBody();
		Category savedCategory = categoryService.saveCategory(category, salonDTO);
		return ResponseEntity.ok(savedCategory);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteCategory(@PathVariable Long id, @RequestHeader("Authorization") String jwt) throws Exception {
		SalonDTO salonDTO = salonFeignClient.getSalonByOwnerId(jwt).getBody();
		categoryService.deleteCategoryById(id, salonDTO.getId());
		return ResponseEntity.ok("Category deleted successfully");
	}

	@GetMapping("/salon/{salonId}/category/{id}")
	public ResponseEntity<Category> getCategoryByIdAndSalonId(@PathVariable("salonId") Long salonId,
															  @PathVariable("id") Long id) throws Exception {
		Category category = categoryService.getCategoryByIdAndSalonId(id, salonId);
		return ResponseEntity.ok(category);
	}
}
