package com.dipika.kalakriti2.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    // You might need a UserDetailsService to load full user data if not contained in token
    // For now, assuming you might verify against DB or just trust the token claims if stateless
    // Let's check if there is a CustomUserDetailsService. 
    // If not, we can create a simple principal or add UserDetailsService later.
    // For this step, I'll assume we need to just validate and set context.
    
    // Changing to OncePerRequestFilter for better control
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractEmail(jwt);
            } catch (Exception e) {
                // Token invalid or expired
                logger.error("JWT Token validation failed: " + e.getMessage());
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Here we ideally load user from DB to verify existence and get roles
            // UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            
            // For now, let's validate token integrity
            if (jwtUtil.validateToken(jwt, username)) {
                // If valid, set authentication
                // Note: We need authorities (roles) here. 
                // If JwtUtil extracts them, great. If not, we might need to fetch them.
                
                // Placeholder: Creating a simple authenticated token
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username, null, java.util.Collections.emptyList()); // Empty authorities for now
                
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        chain.doFilter(request, response);
    }
}
