package com.rms.service.impl;

import com.rms.dto.DailyReportDTO;
import com.rms.dto.MenuItemSalesDTO;
import com.rms.model.Order;
import com.rms.model.OrderItem;
import com.rms.model.OrderStatus;
import com.rms.repository.OrderRepository;
import com.rms.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Rapor service implementasyonu.
 * Rapor oluşturma işlemlerinin uygulamasını içerir.
 */
@Service
public class ReportServiceImpl implements ReportService {

    private final OrderRepository orderRepository;

    @Autowired
    public ReportServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public DailyReportDTO getDailyReport(LocalDate date) {
        // Günün başlangıç ve bitiş zamanlarını ayarla
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        
        // Tamamlanan siparişleri getir
        List<Order> completedOrders = orderRepository.findByOrderTimeBetweenAndStatus(
                startOfDay, endOfDay, OrderStatus.COMPLETED);
        
        // Menü öğesi satışları için harita oluştur
        Map<Long, MenuItemSalesDTO> itemSalesMap = new HashMap<>();
        
        // Toplam gelir ve sipariş sayısını hesapla
        double totalRevenue = 0;
        
        // Her sipariş için
        for (Order order : completedOrders) {
            totalRevenue += order.getTotalAmount();
            
            // Her sipariş öğesi için
            for (OrderItem item : order.getOrderItems()) {
                Long menuItemId = item.getMenuItemId();
                
                // Menü öğesi satış verisi daha önce eklenmişse güncelle, değilse yeni ekle
                if (itemSalesMap.containsKey(menuItemId)) {
                    MenuItemSalesDTO salesDTO = itemSalesMap.get(menuItemId);
                    salesDTO.setQuantitySold(salesDTO.getQuantitySold() + item.getQuantity());
                    salesDTO.setTotalRevenue(salesDTO.getTotalRevenue() + (item.getPrice() * item.getQuantity()));
                } else {
                    MenuItemSalesDTO salesDTO = new MenuItemSalesDTO();
                    salesDTO.setMenuItemId(menuItemId);
                    salesDTO.setMenuItemName(item.getMenuItemName());
                    salesDTO.setCategory("");  // Kategori bilgisi doğrudan OrderItem'da yok
                    salesDTO.setQuantitySold(item.getQuantity());
                    salesDTO.setTotalRevenue(item.getPrice() * item.getQuantity());
                    salesDTO.setUnitPrice(item.getPrice());
                    
                    itemSalesMap.put(menuItemId, salesDTO);
                }
            }
        }
        
        // Menü öğesi satış verilerini listeye dönüştür
        List<MenuItemSalesDTO> itemSales = new ArrayList<>(itemSalesMap.values());
        
        // Sonuç DTO'yu oluştur
        DailyReportDTO reportDTO = new DailyReportDTO();
        reportDTO.setDate(date);
        reportDTO.setItemSales(itemSales);
        reportDTO.setTotalOrderCount(completedOrders.size());
        reportDTO.setTotalRevenue(totalRevenue);
        
        return reportDTO;
    }

    @Override
    public List<MenuItemSalesDTO> getMenuItemSales(LocalDate startDate, LocalDate endDate) {
        // Tarih aralığının başlangıç ve bitiş zamanlarını ayarla
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);
        
        // Tamamlanan siparişleri getir
        List<Order> completedOrders = orderRepository.findByOrderTimeBetweenAndStatus(
                startDateTime, endDateTime, OrderStatus.COMPLETED);
        
        // Menü öğesi satışları için harita oluştur
        Map<Long, MenuItemSalesDTO> itemSalesMap = new HashMap<>();
        
        // Her sipariş için
        for (Order order : completedOrders) {
            // Her sipariş öğesi için
            for (OrderItem item : order.getOrderItems()) {
                Long menuItemId = item.getMenuItemId();
                
                // Menü öğesi satış verisi daha önce eklenmişse güncelle, değilse yeni ekle
                if (itemSalesMap.containsKey(menuItemId)) {
                    MenuItemSalesDTO salesDTO = itemSalesMap.get(menuItemId);
                    salesDTO.setQuantitySold(salesDTO.getQuantitySold() + item.getQuantity());
                    salesDTO.setTotalRevenue(salesDTO.getTotalRevenue() + (item.getPrice() * item.getQuantity()));
                } else {
                    MenuItemSalesDTO salesDTO = new MenuItemSalesDTO();
                    salesDTO.setMenuItemId(menuItemId);
                    salesDTO.setMenuItemName(item.getMenuItemName());
                    salesDTO.setCategory("");  // Kategori bilgisi doğrudan OrderItem'da yok
                    salesDTO.setQuantitySold(item.getQuantity());
                    salesDTO.setTotalRevenue(item.getPrice() * item.getQuantity());
                    salesDTO.setUnitPrice(item.getPrice());
                    
                    itemSalesMap.put(menuItemId, salesDTO);
                }
            }
        }
        
        // Menü öğesi satış verilerini listeye dönüştür ve toplam gelire göre azalan sırada döndür
        return itemSalesMap.values().stream()
                .sorted((a, b) -> Double.compare(b.getTotalRevenue(), a.getTotalRevenue()))
                .collect(Collectors.toList());
    }
}