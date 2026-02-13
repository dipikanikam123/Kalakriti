//package com.dipika.kalakriti2.controller;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.dipika.kalakriti2.entity.Art;
//import com.dipika.kalakriti2.entity.ExploreEntity;
//import com.dipika.kalakriti2.repository.ArtRepository;
//import com.dipika.kalakriti2.service.ExploreService;
//
//
//@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
//@RestController
//@RequestMapping("/api/explore")
//
//public class ExploreConto {
//
//
//	@Autowired
//    private ExploreService exploreService;
//
//    @GetMapping
//    public ResponseEntity<List<ExploreEntity>> getAllExplore() {
//        List<ExploreEntity> list = exploreService.getAllArtworks();
//        return ResponseEntity.ok(list);
//    }
//
//    @GetMapping("/category/{category}")
//    public List<ExploreEntity> getByCategory(@PathVariable String category) {
//        return exploreService.getByCategory(category);
//    }
//
//    @PostMapping
//    public ExploreEntity addArtwork(@RequestBody ExploreEntity explore) {
//        return exploreService.save(explore);
//    }
//    
//
//}
//
//
