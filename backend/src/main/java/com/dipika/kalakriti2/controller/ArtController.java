package com.dipika.kalakriti2.controller;

import com.dipika.kalakriti2.entity.Art;
import com.dipika.kalakriti2.service.ArtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/art")
@CrossOrigin(origins = "*")  // allows requests from any frontend
public class ArtController {

    @Autowired
    private ArtService artService;

    // 🔹 Get all artworks
    @GetMapping
    public ResponseEntity<List<Art>> getAllArts() {
        List<Art> arts = artService.getAllArts();
        if (arts.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content if list empty
        }
        return ResponseEntity.ok(arts); // 200 OK with list
    }

    // 🔹 Get artwork by ID
    @GetMapping("/{id}")
    public ResponseEntity<Art> getArtById(@PathVariable Long id) {
        return artService.getArtById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Get artworks by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Art>> getArtsByCategory(@PathVariable String category) {
        List<Art> arts = artService.getArtsByCategory(category);
        if (arts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(arts);
    }

    // 🔹 Add a new artwork (optional)
    @PostMapping
    public ResponseEntity<Art> addArt(@RequestBody Art art) {
        Art savedArt = artService.saveArt(art);
        return ResponseEntity.status(201).body(savedArt); // 201 Created
    }
   
}

