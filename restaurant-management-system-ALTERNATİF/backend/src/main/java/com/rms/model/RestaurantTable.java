package com.rms.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * Restoran masası entity sınıfı.
 * Restoran içindeki her bir masayı ve durumunu temsil eder.
 */
@Entity
@Table(name = "tables")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Integer number;

    @Enumerated(EnumType.STRING)
    private TableStatus status = TableStatus.AVAILABLE;
    
    // Masanın restoran içindeki konumu (düzende gösterilmesi için)
    private Integer posX;
    private Integer posY;
}