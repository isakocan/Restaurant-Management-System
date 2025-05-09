package com.rms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * Kayıt isteği DTO sınıfı.
 * Kullanıcı kaydı için gerekli bilgileri taşır.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank
    @Size(min = 3, max = 50)
    private String fullName;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
    
    private String role;
}