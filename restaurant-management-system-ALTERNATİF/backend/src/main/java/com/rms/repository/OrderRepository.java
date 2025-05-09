package com.rms.repository;

import com.rms.model.Order;
import com.rms.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Sipariş repository interface'i.
 * Sipariş veritabanı işlemleri için JPA metodları sağlar.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    /**
     * Masa ID'sine göre siparişleri listeler
     * @param tableId Masa ID
     * @return Siparişler listesi
     */
    List<Order> findByTableId(Long tableId);
    
    /**
     * Masa ID'sine ve duruma göre siparişleri listeler
     * @param tableId Masa ID
     * @param status Sipariş durumu
     * @return Siparişler listesi
     */
    List<Order> findByTableIdAndStatus(Long tableId, OrderStatus status);
    
    /**
     * Personel ID'sine göre siparişleri listeler
     * @param staffId Personel ID
     * @return Siparişler listesi
     */
    List<Order> findByStaffId(Long staffId);
    
    /**
     * Personel ID'sine ve duruma göre siparişleri listeler
     * @param staffId Personel ID
     * @param status Sipariş durumu
     * @return Siparişler listesi
     */
    List<Order> findByStaffIdAndStatus(Long staffId, OrderStatus status);
    
    /**
     * Duruma göre siparişleri listeler
     * @param status Sipariş durumu
     * @return Siparişler listesi
     */
    List<Order> findByStatus(OrderStatus status);
    
    /**
     * Belirli bir tarih aralığındaki siparişleri listeler
     * @param start Başlangıç tarihi
     * @param end Bitiş tarihi
     * @return Siparişler listesi
     */
    List<Order> findByOrderTimeBetween(LocalDateTime start, LocalDateTime end);
    
    /**
     * Belirli bir tarih aralığında ve durumda olan siparişleri listeler
     * @param start Başlangıç tarihi
     * @param end Bitiş tarihi
     * @param status Sipariş durumu
     * @return Siparişler listesi
     */
    List<Order> findByOrderTimeBetweenAndStatus(LocalDateTime start, LocalDateTime end, OrderStatus status);
}