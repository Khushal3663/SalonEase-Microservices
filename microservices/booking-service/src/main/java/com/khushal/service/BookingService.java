package com.khushal.service;

import com.khushal.domain.BookingStatus;
import com.khushal.dto.BookingRequest;
import com.khushal.dto.SalonDTO;
import com.khushal.dto.ServiceDTO;
import com.khushal.dto.UserDTO;
import com.khushal.model.Booking;
import com.khushal.model.PaymentOrder;
import com.khushal.model.SalonReport;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public interface BookingService {
    Booking createBooking(
            BookingRequest booking,
            UserDTO user,
            SalonDTO salon,
            Set<ServiceDTO> serviceDTOSet) throws Exception;

    List<Booking> getBookingsByCustomer(Long customerId);

    List<Booking> getBookingsBySalon(Long salonId);

    Booking getBookingById(Long id) throws Exception;

    Booking updateBooking(Long bookingId, BookingStatus status) throws Exception;

    List<Booking> getBookingsByDate(LocalDate date, Long salonId);

    SalonReport getSalonReport(Long salonId);

    void deleteBooking(Long id);

    Booking bookingSuccess(PaymentOrder order) throws Exception;

    List<Booking> getAllBookingsByIds(List<Long> ids);
}
