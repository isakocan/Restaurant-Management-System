package com.rms.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Sipariş entity sınıfı.
 * Bir masaya yapılan siparişi temsil eder.
 */
@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private Long tableId;

    private Long staffId;

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime orderTime;

    private LocalDateTime paymentTime;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Double totalAmount = 0.0;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.orderTime = LocalDateTime.now();
    }
    
    /**
     * Sipariş toplam tutarını hesaplar
     */
    public void calculateTotal() {
        this.totalAmount = orderItems.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }
}