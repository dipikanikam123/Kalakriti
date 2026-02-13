package com.dipika.kalakriti2.controller;

import java.util.Map;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dipika.kalakriti2.entity.UserEntity;
import com.dipika.kalakriti2.repository.UserRepository;
import com.dipika.kalakriti2.service.JwtUtil;



@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class LoginConto {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginConto(UserRepository userRepo,
                      PasswordEncoder passwordEncoder,
                      JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserEntity user) {

        // basic validation
        if (user.getName() == null || user.getName().trim().isEmpty()
                || user.getEmail() == null || user.getEmail().trim().isEmpty()
                || user.getPassword() == null || user.getPassword().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", "name, Email and Password are required"));
        }

        String email = user.getEmail().toLowerCase().trim();
        String name = user.getName().trim();

        // email already exists
        if (userRepo.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email already exists"));
        }

        // username already exists
        Optional<UserEntity> existingUser =
                userRepo.findByname(name);
        if (existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Username already exists"));
        }

        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(user.getPassword().trim()));

        userRepo.save(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "User registered successfully"));
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserEntity user) {

        if (user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email and Password are required"));
        }

        String email = user.getEmail().toLowerCase().trim();
        String password = user.getPassword().trim();

        return userRepo.findByEmail(email)
                .map(dbUser -> {

                    if (passwordEncoder.matches(password, dbUser.getPassword())) {

                        String token = jwtUtil.generateToken(dbUser.getEmail());

                        return ResponseEntity.ok(
                                Map.of(
                                        "message", "Login successful",
                                        "token", token,
                                        "name", dbUser.getName()
                                )
                        );
                    } else {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Map.of("error", "Invalid password"));
                    }
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found")));
    }
//    @Data
//    @AllArgsConstructor
//    static class AuthResponse {
//        private String token;
//        private User user;
//    }
//    
}


//
//package com.dipika.kalakriti2.controller;
//
//import java.util.Map;
//import java.util.Optional;
//
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.dipika.kalakriti2.entity.UserEntity;
//import com.dipika.kalakriti2.repository.UserRepository;
//import com.dipika.kalakriti2.service.JwtUtil;
//
//@RestController
//@RequestMapping("/api")
//@CrossOrigin(origins = "http://localhost:5173")
//public class LoginConto {
//
//    private final UserRepository userRepo;
//    private final PasswordEncoder passwordEncoder;
//    private final JwtUtil jwtUtil;
//
//    public LoginConto(UserRepository userRepo,
//                      PasswordEncoder passwordEncoder,
//                      JwtUtil jwtUtil) {
//        this.userRepo = userRepo;
//        this.passwordEncoder = passwordEncoder;
//        this.jwtUtil = jwtUtil;
//    }
//
//    // ================= REGISTER =================
//    @PostMapping("/register")
//    public ResponseEntity<?> register(@RequestBody UserEntity user) {
//
//        if (user.getName() == null || user.getName().trim().isEmpty()
//                || user.getEmail() == null || user.getEmail().trim().isEmpty()
//                || user.getPassword() == null || user.getPassword().trim().isEmpty()) {
//            return ResponseEntity.badRequest()
//                    .body(Map.of("error", "Name, Email, and Password are required"));
//        }
//
//        String email = user.getEmail().toLowerCase().trim();
//        String name = user.getName().trim();
//
//        if (userRepo.existsByEmail(email)) {
//            return ResponseEntity.status(HttpStatus.CONFLICT)
//                    .body(Map.of("error", "Email already exists"));
//        }
//
//        if (userRepo.existsByName(name)) {
//            return ResponseEntity.status(HttpStatus.CONFLICT)
//                    .body(Map.of("error", "Username already exists"));
//        }
//
//        user.setEmail(email);
//        user.setName(name);
//        user.setPassword(passwordEncoder.encode(user.getPassword().trim()));
//
//        userRepo.save(user);
//
//        return ResponseEntity.status(HttpStatus.CREATED)
//                .body(Map.of("message", "User registered successfully"));
//    }
//
//    // ================= LOGIN =================
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody UserEntity user) {
//
//        if (user.getEmail() == null || user.getPassword() == null) {
//            return ResponseEntity.badRequest()
//                    .body(Map.of("error", "Email and Password are required"));
//        }
//
//        String email = user.getEmail().toLowerCase().trim();
//        String password = user.getPassword().trim();
//
//        Optional<UserEntity> dbUserOpt = userRepo.findByEmail(email);
//
//        if (dbUserOpt.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body(Map.of("error", "User not found"));
//        }
//
//        UserEntity dbUser = dbUserOpt.get();
//
//        if (!passwordEncoder.matches(password, dbUser.getPassword())) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body(Map.of("error", "Invalid password"));
//        }
//
//        String token = jwtUtil.generateToken(dbUser.getEmail());
//
//        return ResponseEntity.ok(Map.of(
//                "message", "Login successful",
//                "token", token,
//                "name", dbUser.getName()
//        ));
//    }
//}
