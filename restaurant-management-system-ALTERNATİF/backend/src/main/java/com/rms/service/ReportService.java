package com.rms.service;

import com.rms.dto.DailyReportDTO;
import com.rms.dto.MenuItemSalesDTO;

import java.time.LocalDate;
import java.util.List;

/**
 * Rapor service interface'i.
 * Rapor oluşturma işlemleri için metodlar tanımlar.
 */
public interface ReportService {
    
    /**
     * Belirli bir güne ait satış raporu oluşturur
     * @param date Tarih
     * @return Günlük rapor DTO
     */
    DailyReportDTO getDailyReport(LocalDate date);
    
    /**
     * Belirli bir tarih aralığına ait menü öğesi satışlarını listeler
     * @param startDate Başlangıç tarihi
     * @param endDate Bitiş tarihi
     * @return Menü öğesi satışları listesi
     */
    List<MenuItemSalesDTO> getMenuItemSales(LocalDate startDate, LocalDate endDate);
}