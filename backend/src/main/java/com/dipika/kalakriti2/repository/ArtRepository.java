package com.dipika.kalakriti2.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dipika.kalakriti2.entity.Art;

public interface ArtRepository extends JpaRepository<Art, Long> {

	List<Art> findByCategory(String category);
    
}
