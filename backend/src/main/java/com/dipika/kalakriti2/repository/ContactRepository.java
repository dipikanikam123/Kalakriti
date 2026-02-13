package com.dipika.kalakriti2.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dipika.kalakriti2.entity.ContactMessage;

public interface ContactRepository extends JpaRepository<ContactMessage, Long>{
    java.util.List<ContactMessage> findByEmail(String email);
}
