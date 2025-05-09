package com.rms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

/**
 * Sipariş öğesi entity sınıfı.
 * Bir siparişteki her bir menü öğesi ve miktarını temsil eder.
 */
@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;

    @NotNull
    @Column(nullable = false)
    private Long menuItemId;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Integer quantity;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Double price;
    
    // Sipariş öğesi oluşturulduğu andaki menü öğesi adı (menü güncellendiğinde kayıt için)
    private String menuItemName;
}