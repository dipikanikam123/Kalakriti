package com.dipika.kalakriti2.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.dipika.kalakriti2.entity.UserEntity;
import com.dipika.kalakriti2.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepo;

    // GET all users
    @GetMapping
    public List<UserEntity> getAllUsers() {
        return userRepo.findAll();
    }

    // UPDATE user (Phone, Address)
    @PutMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserEntity userDetails) {
        return userRepo.findById(id).map(user -> {
            if(userDetails.getPhone() != null) user.setPhone(userDetails.getPhone());
            if(userDetails.getAddress() != null) user.setAddress(userDetails.getAddress());
            // Can add more fields if needed
            
            userRepo.save(user);
            return org.springframework.http.ResponseEntity.ok("User updated successfully ✅");
        }).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }
}


