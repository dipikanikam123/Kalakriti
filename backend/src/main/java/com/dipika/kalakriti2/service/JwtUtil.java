package com.dipika.kalakriti2.service;

import java.util.Date;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

@Service
public class JwtUtil {

    // Secret key (should ideally come from application.properties or env variable)
    private static final String SECRET_KEY = "MySuperSecretKeyForJWTGeneration123!"; 

    // Token validity: 24 hours
    private static final long EXPIRATION_TIME = 24 * 60 * 60 * 1000; 

    // Convert SECRET_KEY to SecretKey object
    private static final SecretKey KEY = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // ================= GENERATE TOKEN =================
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(KEY, SignatureAlgorithm.HS256)  // ✅ modern way
                .compact();
    }

    // ================= VALIDATE TOKEN =================
    public boolean validateToken(String token, String email) {
        String tokenEmail = extractEmail(token);
        return (tokenEmail.equals(email) && !isTokenExpired(token));
    }

    // ================= EXTRACT EMAIL =================
    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    // ================= CHECK EXPIRATION =================
    public boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    // ================= PARSE CLAIMS =================
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(KEY)  // ✅ use SecretKey object
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
