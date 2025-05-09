package com.rms.model;

/**
 * Sipariş durumlarını tanımlar.
 * PENDING: Sipariş verildi ama henüz personel tarafından işleme alınmadı
 * PROCESSING: Sipariş personel tarafından alındı ve işleniyor
 * COMPLETED: Sipariş tamamlandı ve ödeme alındı
 * CANCELLED: Sipariş iptal edildi
 */
public enum OrderStatus {
    PENDING,     // Beklemede
    PROCESSING,  // İşleniyor 
    COMPLETED,   // Tamamlandı
    CANCELLED    // İptal edildi
}