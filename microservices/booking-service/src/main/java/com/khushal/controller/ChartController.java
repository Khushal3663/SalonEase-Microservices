package com.khushal.controller;

import com.khushal.dto.SalonDTO;
import com.khushal.model.Booking;
import com.khushal.service.BookingChartService;
import com.khushal.service.BookingService;
import com.khushal.service.client.SalonFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bookings/chart")
public class ChartController {
    private final BookingChartService bookingChartService;
    private final BookingService bookingService;
    private final SalonFeignClient salonFeignClient;

    @GetMapping("/earnings")
    public ResponseEntity<List<Map<String, Object>>> getEarningsChartData(@RequestHeader("Authorization") String jwt) throws Exception {
        SalonDTO salon = salonFeignClient.getSalonByOwnerId(jwt).getBody();
        if(salon == null){
            throw new Exception("salon not found");
        }
        List<Booking> bookings = bookingService.getBookingsBySalon(salon.getId());

//        Generate chart data
        List<Map<String, Object>> chartData = bookingChartService.generateEarningsChartData(bookings);

        return ResponseEntity.ok(chartData);
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<Map<String, Object>>> getBookingsChartData(@RequestHeader("Authorization") String jwt) throws Exception {
        SalonDTO salon = salonFeignClient.getSalonByOwnerId(jwt).getBody();
        if(salon == null){
            throw new Exception("salon not found");
        }
        List<Booking> bookings = bookingService.getBookingsBySalon(salon.getId());

//        Generate chart data
        List<Map<String, Object>> chartData = bookingChartService.generateBookingCountChartData(bookings);

        return ResponseEntity.ok(chartData);
    }

}
