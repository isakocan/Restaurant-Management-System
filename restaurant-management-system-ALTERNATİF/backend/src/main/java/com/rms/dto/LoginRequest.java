package com.rms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

/**
 * Giriş isteği DTO sınıfı.
 * Kullanıcı girişi için gerekli bilgileri taşır.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String password;
}