package com.rms.service.impl;

import com.rms.model.*;
import com.rms.repository.MenuItemRepository;
import com.rms.repository.OrderRepository;
import com.rms.repository.TableRepository;
import com.rms.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Sipariş service implementasyonu.
 * Sipariş işlemlerinin uygulamasını içerir.
 */
@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final TableRepository tableRepository;
    private final MenuItemRepository menuItemRepository;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository, TableRepository tableRepository, MenuItemRepository menuItemRepository) {
        this.orderRepository = orderRepository;
        this.tableRepository = tableRepository;
        this.menuItemRepository = menuItemRepository;
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sipariş bulunamadı: " + id));
    }

    @Override
    public List<Order> getOrdersByTableId(Long tableId) {
        return orderRepository.findByTableId(tableId);
    }

    @Override
    public List<Order> getOrdersByStaffId(Long staffId) {
        return orderRepository.findByStaffId(staffId);
    }

    @Override
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    @Override
    public List<Order> getOrdersByDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        return orderRepository.findByOrderTimeBetween(startOfDay, endOfDay);
    }

    @Override
    @Transactional
    public Order createOrder(Order order) {
        // Sipariş zamanını şimdiki zaman olarak ayarla
        order.setOrderTime(LocalDateTime.now());
        
        // Sipariş durumunu PENDING olarak ayarla
        order.setStatus(OrderStatus.PENDING);
        
        // İlgili masayı dolu olarak işaretle
        RestaurantTable table = tableRepository.findById(order.getTableId())
                .orElseThrow(() -> new EntityNotFoundException("Masa bulunamadı: " + order.getTableId()));
        table.setStatus(TableStatus.OCCUPIED);
        tableRepository.save(table);
        
        // Sipariş öğeleri için menü öğesi bilgilerini ayarla
        for (OrderItem item : order.getOrderItems()) {
            MenuItem menuItem = menuItemRepository.findById(item.getMenuItemId())
                    .orElseThrow(() -> new EntityNotFoundException("Menü öğesi bulunamadı: " + item.getMenuItemId()));
            
            item.setPrice(menuItem.getPrice());
            item.setMenuItemName(menuItem.getName());
            item.setOrder(order);
        }
        
        // Toplam tutarı hesapla
        order.calculateTotal();
        
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order updateOrder(Long id, Order updatedOrder) {
        Order existingOrder = getOrderById(id);
        
        // Sadece PENDING veya PROCESSING durumundaki siparişler güncellenebilir
        if (existingOrder.getStatus() == OrderStatus.COMPLETED || existingOrder.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Tamamlanmış veya iptal edilmiş siparişler güncellenemez");
        }
        
        // Mevcut sipariş öğelerini temizle
        existingOrder.getOrderItems().clear();
        
        // Yeni sipariş öğelerini ekle
        for (OrderItem item : updatedOrder.getOrderItems()) {
            MenuItem menuItem = menuItemRepository.findById(item.getMenuItemId())
                    .orElseThrow(() -> new EntityNotFoundException("Menü öğesi bulunamadı: " + item.getMenuItemId()));
            
            item.setPrice(menuItem.getPrice());
            item.setMenuItemName(menuItem.getName());
            item.setOrder(existingOrder);
            existingOrder.getOrderItems().add(item);
        }
        
        // Toplam tutarı yeniden hesapla
        existingOrder.calculateTotal();
        
        return orderRepository.save(existingOrder);
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long id, OrderStatus status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        
        // Eğer sipariş tamamlandıysa, ödeme zamanını ayarla ve masayı boşalt
        if (status == OrderStatus.COMPLETED) {
            order.setPaymentTime(LocalDateTime.now());
            
            RestaurantTable table = tableRepository.findById(order.getTableId())
                    .orElseThrow(() -> new EntityNotFoundException("Masa bulunamadı: " + order.getTableId()));
            table.setStatus(TableStatus.AVAILABLE);
            tableRepository.save(table);
        }
        
        return orderRepository.save(order);
    }

    @Override
    public Order assignStaffToOrder(Long id, Long staffId) {
        Order order = getOrderById(id);
        
        // Sadece PENDING durumundaki siparişlere personel atanabilir
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalStateException("Sadece bekleyen siparişlere personel atanabilir");
        }
        
        order.setStaffId(staffId);
        order.setStatus(OrderStatus.PROCESSING);
        
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order completeOrder(Long id) {
        Order order = getOrderById(id);
        
        // Sipariş durumunu COMPLETED olarak güncelle
        order.setStatus(OrderStatus.COMPLETED);
        order.setPaymentTime(LocalDateTime.now());
        
        // İlgili masayı boşalt
        RestaurantTable table = tableRepository.findById(order.getTableId())
                .orElseThrow(() -> new EntityNotFoundException("Masa bulunamadı: " + order.getTableId()));
        table.setStatus(TableStatus.AVAILABLE);
        tableRepository.save(table);
        
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public void cancelOrder(Long id) {
        Order order = getOrderById(id);
        
        // Sipariş durumunu CANCELLED olarak güncelle
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        
        // İlgili masayı boşalt
        RestaurantTable table = tableRepository.findById(order.getTableId())
                .orElseThrow(() -> new EntityNotFoundException("Masa bulunamadı: " + order.getTableId()));
        table.setStatus(TableStatus.AVAILABLE);
        tableRepository.save(table);
    }
}