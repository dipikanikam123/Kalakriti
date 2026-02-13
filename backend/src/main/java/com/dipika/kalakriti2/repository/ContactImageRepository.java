package com.dipika.kalakriti2.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dipika.kalakriti2.entity.ContactImage;

public interface ContactImageRepository extends JpaRepository<ContactImage, Long> {

	ContactImage findByContactId(Long contactId);
	
}
