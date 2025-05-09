package com.rms.model;

/**
 * Masa durumlarını tanımlar.
 * AVAILABLE: Masa boş ve kullanılabilir
 * OCCUPIED: Masa dolu, müşteri tarafından kullanımda
 */
public enum TableStatus {
    AVAILABLE,  // Boş
    OCCUPIED    // Dolu
}