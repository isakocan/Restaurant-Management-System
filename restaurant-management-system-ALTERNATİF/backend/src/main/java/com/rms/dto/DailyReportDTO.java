package com.rms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * Günlük rapor DTO sınıfı.
 * Günlük satış raporu verilerini taşır.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyReportDTO {
    private LocalDate date;
    private List<MenuItemSalesDTO> itemSales;
    private int totalOrderCount;
    private double totalRevenue;
}