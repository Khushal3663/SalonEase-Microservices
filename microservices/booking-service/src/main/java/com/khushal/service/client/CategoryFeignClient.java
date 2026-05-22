package com.khushal.service.client;

import com.khushal.dto.CategoryDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(contextId = "bookingCategoryClient", value = "CATEGORY-SERVICE")
public interface CategoryFeignClient {

    @GetMapping("/api/categories/salon-owner/salon/{salonId}/category/{id}")
    public ResponseEntity<CategoryDTO> getCategoryByIdAndSalonId(@PathVariable("id") Long id, @PathVariable("salonId") Long salonId) throws Exception;
}
