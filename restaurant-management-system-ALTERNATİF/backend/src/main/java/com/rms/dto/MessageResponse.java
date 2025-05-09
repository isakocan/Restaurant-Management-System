package com.rms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Mesaj yanıt DTO sınıfı.
 * Basit mesaj yanıtlarını taşır.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private String message;
}