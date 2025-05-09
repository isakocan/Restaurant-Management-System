package com.rms.controller;

import com.rms.dto.JwtResponse;
import com.rms.dto.LoginRequest;
import com.rms.dto.MessageResponse;
import com.rms.dto.SignupRequest;
import com.rms.model.Role;
import com.rms.model.User;
import com.rms.security.jwt.JwtUtils;
import com.rms.security.services.UserDetailsImpl;
import com.rms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.stream.Collectors;

/**
 * Kimlik doğrulama controller'ı.
 * Kullanıcı girişi ve kayıt işlemlerini yönetir.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserService userService;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    /**
     * Kullanıcı girişi
     * @param loginRequest Giriş bilgileri
     * @return JWT token ve kullanıcı bilgileri
     */
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        return ResponseEntity.ok(new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getFullName(),
                userDetails.getAuthorities().stream()
                        .map(item -> item.getAuthority())
                        .collect(Collectors.toList())
        ));
    }

    /**
     * Yeni kullanıcı kaydı
     * @param signUpRequest Kayıt bilgileri
     * @return Başarı mesajı
     */
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        // Kullanıcı adının benzersiz olduğunu kontrol et
        try {
            userService.getUserByUsername(signUpRequest.getUsername());
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Bu kullanıcı adı zaten kullanılıyor!"));
        } catch (Exception e) {
            // Kullanıcı bulunamadı, kayıt işlemine devam et
        }

        // Yeni kullanıcı oluştur
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setFullName(signUpRequest.getFullName());
        
        // Rolü ayarla
        if ("admin".equals(signUpRequest.getRole())) {
            user.setRole(Role.ROLE_ADMIN);
        } else {
            user.setRole(Role.ROLE_STAFF);
        }

        userService.createUser(user);

        return ResponseEntity.ok(new MessageResponse("Kullanıcı başarıyla kaydedildi!"));
    }
}