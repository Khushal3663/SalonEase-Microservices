package com.khushal.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.khushal.model.Salon;

public interface SalonRepository extends JpaRepository<Salon, Long> {
	Optional<Salon> findByOwnerId(Long id);

	@Query("select s from Salon s where " + "(lower(s.city) like lower(concat('%', :keyword, '%') )) OR "
			+ "(lower(s.name) like lower(concat('%', :keyword,'%'))) OR"
			+ "(lower(s.address) like lower(concat('%', :keyword,'%')))")
	List<Salon> searchSaloons(@Param("keyword") String keyword);
}
