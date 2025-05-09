package com.rms.controller;

import com.rms.model.Order;
import com.rms.model.OrderStatus;
import com.rms.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.List;

/**
 * Sipariş controller'ı.
 * Sipariş CRUD işlemlerini yönetir.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    /**
     * Tüm siparişleri listeler
     * @return Siparişler listesi
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    /**
     * ID'ye göre sipariş getirir
     * @param id Sipariş ID
     * @return Sipariş
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public Order getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    /**
     * Masa ID'sine göre siparişleri listeler
     * @param tableId Masa ID
     * @return Siparişler listesi
     */
    @GetMapping("/table/{tableId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<Order> getOrdersByTableId(@PathVariable Long tableId) {
        return orderService.getOrdersByTableId(tableId);
    }

    /**
     * Personel ID'sine göre siparişleri listeler
     * @param staffId Personel ID
     * @return Siparişler listesi
     */
    @GetMapping("/staff/{staffId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<Order> getOrdersByStaffId(@PathVariable Long staffId) {
        return orderService.getOrdersByStaffId(staffId);
    }

    /**
     * Duruma göre siparişleri listeler
     * @param status Sipariş durumu
     * @return Siparişler listesi
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<Order> getOrdersByStatus(@PathVariable OrderStatus status) {
        return orderService.getOrdersByStatus(status);
    }

    /**
     * Belirli bir güne ait siparişleri listeler
     * @param date Tarih
     * @return Siparişler listesi
     */
    @GetMapping("/date/{date}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<Order> getOrdersByDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return orderService.getOrdersByDate(date);
    }

    /**
     * Yeni sipariş oluşturur
     * @param order Sipariş bilgileri
     * @return Oluşturulan sipariş
     */
    @PostMapping
    public Order createOrder(@Valid @RequestBody Order order) {
        return orderService.createOrder(order);
    }

    /**
     * Siparişi günceller
     * @param id Sipariş ID
     * @param order Yeni sipariş bilgileri
     * @return Güncellenen sipariş
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public Order updateOrder(@PathVariable Long id, @Valid @RequestBody Order order) {
        return orderService.updateOrder(id, order);
    }

    /**
     * Sipariş durumunu günceller
     * @param id Sipariş ID
     * @param status Yeni sipariş durumu
     * @return Güncellenen sipariş
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public Order updateOrderStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        return orderService.updateOrderStatus(id, status);
    }

    /**
     * Personel ID'sini siparişe atar
     * @param id Sipariş ID
     * @param staffId Personel ID
     * @return Güncellenen sipariş
     */
    @PutMapping("/{id}/assign/{staffId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public Order assignStaffToOrder(@PathVariable Long id, @PathVariable Long staffId) {
        return orderService.assignStaffToOrder(id, staffId);
    }

    /**
     * Siparişi tamamlar ve ödeme işlemini gerçekleştirir
     * @param id Sipariş ID
     * @return Tamamlanan sipariş
     */
    @PutMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public Order completeOrder(@PathVariable Long id) {
        return orderService.completeOrder(id);
    }

    /**
     * Siparişi iptal eder
     * @param id Sipariş ID
     * @return Başarı mesajı
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        orderService.cancelOrder(id);
        return ResponseEntity.ok().build();
    }
}