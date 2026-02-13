package com.dipika.kalakriti2.config;

import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.dipika.kalakriti2.entity.UserEntity;
import com.dipika.kalakriti2.repository.UserRepository;
import com.dipika.kalakriti2.service.JwtUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // Check if user exists
        Optional<UserEntity> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isEmpty()) {
            // Create new user
            UserEntity newUser = new UserEntity();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setPassword(""); // No password for OAuth users
            newUser.setRole("USER");
            // Set provider if you have such a field, e.g. newUser.setProvider("GOOGLE");
            
            userRepository.save(newUser);
        }

        // Generate JWT
        String token = jwtUtil.generateToken(email);

        // Check for returnTo parameter
        String returnTo = request.getParameter("returnTo");
        
        // Build redirect URL
        String redirectUrl = "http://localhost:5173/login?token=" + token;
        if (returnTo != null && !returnTo.isEmpty()) {
            redirectUrl += "&returnTo=" + returnTo;
        }

        // Redirect to Frontend with Token (and returnTo if present)
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
