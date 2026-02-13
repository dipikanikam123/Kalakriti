package com.dipika.kalakriti2.service;

import com.dipika.kalakriti2.entity.Art;
import com.dipika.kalakriti2.repository.ArtRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ArtService {

    @Autowired
    private ArtRepository artRepository;

    // Get all artworks
    public List<Art> getAllArts() {
        return artRepository.findAll();
    }

    // Get artwork by ID
    public Optional<Art> getArtById(Long id) {
        return artRepository.findById(id);
    }

    // Save or update artwork
    public Art saveArt(Art art) {
        return artRepository.save(art);
    }

    // Delete artwork by ID
    public void deleteArt(Long id) {
        artRepository.deleteById(id);
    }

    // Get artworks by category
    public List<Art> getArtsByCategory(String category) {
        return artRepository.findByCategory(category);
    }

    // Additional business logic can be added here (like filtering by price, tags, etc.)
}
