package com.khushal.controller;

import com.khushal.domain.BookingStatus;
import com.khushal.domain.PaymentMethod;
import com.khushal.dto.*;
import com.khushal.mapper.BookingMapper;
import com.khushal.model.Booking;
import com.khushal.model.SalonReport;
import com.khushal.service.BookingService;
import com.khushal.service.client.PaymentFeignClient;
import com.khushal.service.client.SalonFeignClient;
import com.khushal.service.client.ServiceOfferingFeignClient;
import com.khushal.service.client.UserFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;
    private final SalonFeignClient salonFeignClient;
    private final UserFeignClient userFeignClient;
    private final ServiceOfferingFeignClient serviceOfferingFeignClient;
    private final PaymentFeignClient paymentFeignClient;

    @PostMapping
    public ResponseEntity<PaymentLinkResponse> createBooking(
            @RequestParam Long salonId,
            @RequestParam PaymentMethod paymentMethod,
            @RequestBody BookingRequest bookingRequest,
            @RequestHeader("Authorization") String jwt
            ) throws Exception {

        UserDTO userDTO = userFeignClient.getUserProfile(jwt).getBody();

        SalonDTO salonDTO = salonFeignClient.getSalonById(salonId).getBody();

        Set<ServiceDTO> serviceDTOSet = serviceOfferingFeignClient.getServicesByIds(bookingRequest.getServiceIds()).getBody();

        if(serviceDTOSet.isEmpty()){
            throw new Exception("Service not found.");
        }

        Booking booking = bookingService.createBooking(bookingRequest, userDTO, salonDTO, serviceDTOSet);

        try {
            BookingDTO bookingDTO = BookingMapper.toBookingDTO(booking, serviceDTOSet, salonDTO, userDTO);
            PaymentLinkResponse paymentLinkResponse =
                    paymentFeignClient.createPaymentLink(bookingDTO, paymentMethod, jwt).getBody();

            return ResponseEntity.ok(paymentLinkResponse);

        } catch (Exception e) {
            // rollback booking if payment fails
            bookingService.deleteBooking(booking.getId());
            throw new Exception("Payment failed. Booking reverted.");
        }
    }

    @GetMapping("/customer")
    public ResponseEntity<Set<BookingDTO>> getBookingsByCustomer(@RequestHeader("Authorization") String jwt) throws Exception {
        ResponseEntity<UserDTO> response = userFeignClient.getUserProfile(jwt);
        UserDTO userDTO = response.getBody();
        if(userDTO == null) {
            throw new Exception("User not logged in");
        }
        List<Booking> bookings = bookingService.getBookingsByCustomer(userDTO.getId());
        return ResponseEntity.ok(getBookingDTO(bookings));
    }

    @GetMapping("/salon")
    public ResponseEntity<Set<BookingDTO>> getBookingsBySalon(@RequestHeader("Authorization") String jwt) throws Exception {
        SalonDTO salonDTO = salonFeignClient.getSalonByOwnerId(jwt).getBody();
        List<Booking> bookings = bookingService.getBookingsBySalon(salonDTO.getId());
        return ResponseEntity.ok(getBookingDTO(bookings));
    }

    private Set<BookingDTO> getBookingDTO(List<Booking> bookings){

        if (bookings.isEmpty()) return Collections.emptySet();

        // 1. Collect all unique IDs across the entire list of bookings
        Set<Long> salonIds = bookings.stream().map(Booking::getSalonId).collect(Collectors.toSet());
        Set<Long> customerIds = bookings.stream().map(Booking::getCustomerId).collect(Collectors.toSet());
        // Service IDs are usually a list within a booking, so we flatten them
        Set<Long> allServiceIds = bookings.stream()
                .flatMap(b -> b.getServiceIds().stream())
                .distinct()
                .collect(Collectors.toSet());

        // 2. Fetch data in BULK for One call per service, regardless of how many bookings there are!
        Map<Long, SalonDTO> salonMap = salonFeignClient.getSalonsInBulk(new ArrayList<>(salonIds)).getBody()
                .stream().collect(Collectors.toMap(SalonDTO::getId, s -> s));

        Map<Long, UserDTO> userMap = userFeignClient.getUsersInBulk(new ArrayList<>(customerIds)).getBody()
                .stream().collect(Collectors.toMap(UserDTO::getId, u -> u));

        Set<ServiceDTO> allServices = serviceOfferingFeignClient.getServicesByIds(allServiceIds).getBody();

        // 3. Map everything together in memory
        return bookings.stream().map(booking -> {
            // Filter the 'allServices' set to only include ones for THIS booking
            Set<ServiceDTO> bookingServices = allServices.stream()
                    .filter(s -> booking.getServiceIds().contains(s.getId()))
                    .collect(Collectors.toSet());

            return BookingMapper.toBookingDTO(
                    booking,
                    bookingServices,
                    salonMap.get(booking.getSalonId()),
                    userMap.get(booking.getCustomerId())
            );
        }).collect(Collectors.toSet());
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long bookingId) throws Exception {
        Booking booking = bookingService.getBookingById(bookingId);
        Set<ServiceDTO> services =serviceOfferingFeignClient.getServicesByIds(booking.getServiceIds()).getBody();
        SalonDTO salon  = salonFeignClient.getSalonById(booking.getSalonId()).getBody();
        UserDTO customer = userFeignClient.getUserById(booking.getCustomerId()).getBody();
        return ResponseEntity.ok(BookingMapper.toBookingDTO(booking, services, salon, customer));
    }

    @PutMapping("/{bookingId}/status")
    public ResponseEntity<BookingDTO> updateBookingStatus(@PathVariable Long bookingId, @RequestParam BookingStatus status) throws Exception {
        Booking booking = bookingService.updateBooking(bookingId, status);
        Set<ServiceDTO> services =serviceOfferingFeignClient.getServicesByIds(booking.getServiceIds()).getBody();
        SalonDTO salon  = salonFeignClient.getSalonById(booking.getSalonId()).getBody();
        UserDTO customer = userFeignClient.getUserById(booking.getCustomerId()).getBody();
        return ResponseEntity.ok(BookingMapper.toBookingDTO(booking, services, salon, customer));
    }

    @GetMapping("/slots/salon/{salonId}/date/{date}")
    public ResponseEntity<List<BookingSlotDTO>> getBookedSlots(@PathVariable Long salonId, @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) throws Exception {
        List<Booking> bookings = bookingService.getBookingsByDate(date, salonId);
        List<BookingSlotDTO> slotDTOs = bookings.stream()
                .map(booking -> {
                    BookingSlotDTO bookingSlotDTO = new BookingSlotDTO();
                    bookingSlotDTO.setStartTime(booking.getStartTime());
                    bookingSlotDTO.setEndTime(booking.getEndTime());
                    return bookingSlotDTO;
                })
                .toList();

        return ResponseEntity.ok(slotDTOs);
    }

    @GetMapping("/report")
    public ResponseEntity<SalonReport> getSalonReport(@RequestHeader("Authorization") String jwt) throws Exception {
        SalonDTO salonDTO = salonFeignClient.getSalonByOwnerId(jwt).getBody();
        SalonReport salonReport = bookingService.getSalonReport(salonDTO.getId());

        return ResponseEntity.ok(salonReport);
    }

//    @PostMapping("/bulk")
//    public ResponseEntity<List<BookingDTO>> getAllBookingsInBulk(@RequestBody List<Long> ids){
//        if(ids == null || ids.isEmpty()){
//            return ResponseEntity.ok(Collections.EMPTY_LIST);
//        }
//
//        return ResponseEntity.ok(bookingService.getAllBookingsByIds(ids).stream()
//                .map(booking -> BookingMapper.toBookingDTO(booking)));
//
//    }
}
