package com.khushal.controller;

import com.khushal.model.Category;
import com.khushal.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
	private final CategoryService categoryService;

	@GetMapping("/salon/{salonId}")
	public ResponseEntity<Set<Category>> getCategoriesBySalon(@PathVariable Long salonId) {
		Set<Category> categories = categoryService.getAllCategoriesBySalon(salonId);
		return ResponseEntity.ok(categories);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Category> getCategoryById(@PathVariable Long id) throws Exception {
		Category category = categoryService.getCategoryById(id);
		return ResponseEntity.ok(category);
	}
}
