package com.khushal.controller;

import com.khushal.model.ServiceOffering;
import com.khushal.payload.dto.CategoryDTO;
import com.khushal.payload.dto.SalonDTO;
import com.khushal.payload.dto.ServiceDTO;
import com.khushal.service.ServiceOfferingService;
import com.khushal.service.client.CategoryFeignClient;
import com.khushal.service.client.SalonFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/service-offering")
@RequiredArgsConstructor
public class SalonServiceOfferingController {
    private final ServiceOfferingService serviceOfferingService;
    private final SalonFeignClient salonFeignClient;
    private final CategoryFeignClient categoryFeignClient;

    @PostMapping("/salon-owner")
    public ResponseEntity<ServiceOffering> createService(@RequestBody ServiceDTO serviceDTO, @RequestHeader("Authorization") String jwt) throws Exception {
        SalonDTO salonDTO = salonFeignClient.getSalonByOwnerId(jwt).getBody();
        if(salonDTO==null){
            return ResponseEntity.badRequest().build();
        }
        CategoryDTO categoryDTO = categoryFeignClient.getCategoryByIdAndSalonId(serviceDTO.getCategoryId(),salonDTO.getId()).getBody();

        ServiceOffering serviceOffering = serviceOfferingService.createService(salonDTO, serviceDTO, categoryDTO);
        return ResponseEntity.ok(serviceOffering);
    }

    @PutMapping("/salon-owner/{id}")
    public ResponseEntity<ServiceOffering> updateService(@PathVariable Long id, @RequestBody ServiceOffering serviceOffering) throws Exception {
        ServiceOffering updatedService = serviceOfferingService.updateService(id, serviceOffering);
        return ResponseEntity.ok(updatedService);
    }
}
