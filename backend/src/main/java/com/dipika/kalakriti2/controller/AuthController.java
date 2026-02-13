package com.dipika.kalakriti2.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import com.dipika.kalakriti2.entity.UserEntity;
import com.dipika.kalakriti2.repository.UserRepository;
import com.dipika.kalakriti2.dto.GoogleAuth;
import com.dipika.kalakriti2.service.GoogleAuthService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import org.springframework.security.crypto.password.PasswordEncoder;



@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private GoogleAuthService googleAuthService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.dipika.kalakriti2.service.JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ---------------- Google Login ----------------
    @PostMapping("/google")
    public Map<String, Object> googleLogin(@RequestBody GoogleAuth request) throws Exception {
        GoogleIdToken.Payload payload = googleAuthService.verify(request.getToken());

        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String picture = (String) payload.get("picture");
        String googleId = payload.getSubject();

        // Check if user exists
        Optional<UserEntity> userOpt = userRepository.findByEmail(email);
        UserEntity user;
        if(userOpt.isPresent()) {
            user = userOpt.get();
        } else {
            // Save new user
            user = new UserEntity();
            user.setName(name);
            user.setEmail(email);
            user.setRole("USER"); // default role
            userRepository.save(user);
        }

        String token = jwtUtil.generateToken(email);

        Map<String, Object> response = new HashMap<>();
        response.put("email", email);
        response.put("name", name);
        response.put("picture", picture);
        response.put("googleId", googleId);
        response.put("role", user.getRole());
        response.put("id", user.getId()); // Ensure ID is sent if UserEntity has it
        response.put("token", token);
        response.put("message", "Google login successful");
        
        return response;
    }
    
    // ---------------- Standard Login ----------------
    @PostMapping("/login")
    public org.springframework.http.ResponseEntity<?> login(@RequestBody com.dipika.kalakriti2.dto.LoginRequest request) {

        System.out.println("Login Request received: " + request.getEmail());
        System.out.println("Password received: " + request.getPassword());


        // ✅ ADMIN LOGIN (Hardcoded Check)
        if ("info@kalakriti.com".equals(request.getEmail()) && "kalakriti".equals(request.getPassword())) {
            String token = jwtUtil.generateToken("info@kalakriti.com"); 

            return org.springframework.http.ResponseEntity.ok(Map.of(
                    "role", "ADMIN",
                    "token", token,
                    "message", "Admin login successful"
            ));
        }

        // ✅ USER LOGIN
        Optional<UserEntity> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isPresent()) {
            UserEntity user = userOpt.get();

            if (user.getPassword() != null && passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                String token = jwtUtil.generateToken(user.getEmail());

                return org.springframework.http.ResponseEntity.ok(Map.of(
                        "role", (user.getRole() != null ? user.getRole() : "USER"), // Handle null role
                        "email", user.getEmail(),
                        "name", user.getName(),
                        "id", user.getId(),
                        "phone", user.getPhone() != null ? user.getPhone() : "",
                        "address", user.getAddress() != null ? user.getAddress() : "",
                        "token", token,
                        "message", "User login successful"
                ));
            }
        }

        return org.springframework.http.ResponseEntity.status(401)
                .body(Map.of("message", "Invalid credentials"));
    }
   

    // ---------------- Signup ----------------
    @PostMapping("/signup")
    public org.springframework.http.ResponseEntity<?> registerUser(@RequestBody UserEntity user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return org.springframework.http.ResponseEntity.badRequest().body(Map.of("message", "Email is already taken!"));
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER"); // Default role
        userRepository.save(user);

        return org.springframework.http.ResponseEntity.ok(Map.of("message", "User registered successfully!"));
    }


    // ---------------- Get Current User ----------------
    @GetMapping("/me")
    public org.springframework.http.ResponseEntity<?> getCurrentUser(org.springframework.security.core.Authentication authentication) {
        String email = authentication.getName();

        // Handle Hardcoded Admin
        if ("info@kalakriti.com".equals(email)) {
             return org.springframework.http.ResponseEntity.ok(Map.of(
                "name", "Admin",
                "email", "info@kalakriti.com",
                "role", "ADMIN",
                "id", 0
            ));
        }

        Optional<UserEntity> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            UserEntity user = userOpt.get();
            return org.springframework.http.ResponseEntity.ok(Map.of(
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole() != null ? user.getRole() : "USER",
                "id", user.getId(),
                "phone", user.getPhone() != null ? user.getPhone() : "",
                "address", user.getAddress() != null ? user.getAddress() : ""
            ));
        }
        return org.springframework.http.ResponseEntity.status(404).body(Map.of("message", "User not found"));
    }

}



