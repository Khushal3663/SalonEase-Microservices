package com.khushal.mapper;

import com.khushal.dto.BookingDTO;
import com.khushal.dto.SalonDTO;
import com.khushal.dto.ServiceDTO;
import com.khushal.dto.UserDTO;
import com.khushal.model.Booking;

import java.util.Set;

public class BookingMapper {
    public static BookingDTO toBookingDTO(Booking booking, Set<ServiceDTO> services, SalonDTO salonDTO, UserDTO user) {
        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.setId(booking.getId());
        bookingDTO.setCustomerId(booking.getCustomerId());
        bookingDTO.setSalonId(booking.getSalonId());
        bookingDTO.setStatus(booking.getStatus());
        bookingDTO.setStartTime(booking.getStartTime());
        bookingDTO.setEndTime(booking.getEndTime());
        bookingDTO.setServiceIds(booking.getServiceIds());
        bookingDTO.setTotalPrice(booking.getTotalPrice());

        bookingDTO.setSalon(salonDTO);
        bookingDTO.setServices(services);
        bookingDTO.setCustomer(user);

        return bookingDTO;
    }
}
