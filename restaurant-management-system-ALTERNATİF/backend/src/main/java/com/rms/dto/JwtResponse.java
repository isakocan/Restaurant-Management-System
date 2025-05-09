package com.rms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * JWT yanıt DTO sınıfı.
 * Başarılı giriş sonrası döndürülen bilgileri taşır.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String fullName;
    private List<String> roles;

    public JwtResponse(String token, Long id, String username, String fullName, List<String> roles) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.roles = roles;
    }
}