package com.rms.model;

/**
 * Sistemdeki kullanıcı rollerini tanımlar.
 * ROLE_ADMIN: Yönetici kullanıcı - Tüm sistem yönetimi, rapor görüntüleme
 * ROLE_STAFF: Çalışan kullanıcı - Sipariş alma ve yönetme
 * ROLE_CUSTOMER: Müşteri rolü - Sadece temel sipariş verme işlevleri
 */
public enum Role {
    ROLE_ADMIN,    // Yönetici
    ROLE_STAFF,    // Çalışan
    ROLE_CUSTOMER  // Müşteri (Gelecekte kullanılabilir)
}