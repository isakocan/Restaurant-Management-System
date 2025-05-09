package com.rms.service;

import com.rms.model.Order;
import com.rms.model.OrderStatus;

import java.time.LocalDate;
import java.util.List;

/**
 * Sipariş service interface'i.
 * Sipariş işlemleri için metodlar tanımlar.
 */
public interface OrderService {
    
    /**
     * Tüm siparişleri listeler
     * @return Siparişler listesi
     */
    List<Order> getAllOrders();
    
    /**
     * ID'ye göre sipariş getirir
     * @param id Sipariş ID
     * @return Sipariş
     */
    Order getOrderById(Long id);
    
    /**
     * Masa ID'sine göre siparişleri listeler
     * @param tableId Masa ID
     * @return Siparişler listesi
     */
    List<Order> getOrdersByTableId(Long tableId);
    
    /**
     * Personel ID'sine göre siparişleri listeler
     * @param staffId Personel ID
     * @return Siparişler listesi
     */
    List<Order> getOrdersByStaffId(Long staffId);
    
    /**
     * Duruma göre siparişleri listeler
     * @param status Sipariş durumu
     * @return Siparişler listesi
     */
    List<Order> getOrdersByStatus(OrderStatus status);
    
    /**
     * Belirli bir güne ait siparişleri listeler
     * @param date Tarih
     * @return Siparişler listesi
     */
    List<Order> getOrdersByDate(LocalDate date);
    
    /**
     * Yeni sipariş oluşturur
     * @param order Sipariş bilgileri
     * @return Oluşturulan sipariş
     */
    Order createOrder(Order order);
    
    /**
     * Siparişi günceller
     * @param id Sipariş ID
     * @param order Yeni sipariş bilgileri
     * @return Güncellenen sipariş
     */
    Order updateOrder(Long id, Order order);
    
    /**
     * Sipariş durumunu günceller
     * @param id Sipariş ID
     * @param status Yeni sipariş durumu
     * @return Güncellenen sipariş
     */
    Order updateOrderStatus(Long id, OrderStatus status);
    
    /**
     * Personel ID'sini siparişe atar
     * @param id Sipariş ID
     * @param staffId Personel ID
     * @return Güncellenen sipariş
     */
    Order assignStaffToOrder(Long id, Long staffId);
    
    /**
     * Siparişi tamamlar ve ödeme işlemini gerçekleştirir
     * @param id Sipariş ID
     * @return Tamamlanan sipariş
     */
    Order completeOrder(Long id);
    
    /**
     * Siparişi iptal eder
     * @param id Sipariş ID
     */
    void cancelOrder(Long id);
}