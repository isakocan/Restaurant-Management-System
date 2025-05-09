package com.rms.controller;

import com.rms.dto.DailyReportDTO;
import com.rms.dto.MenuItemSalesDTO;
import com.rms.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Rapor controller'ı.
 * Raporlama işlemlerini yönetir.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reports")
public class ReportController {
    @Autowired
    private ReportService reportService;

    /**
     * Belirli bir güne ait satış raporu oluşturur
     * @param date Tarih
     * @return Günlük rapor DTO
     */
    @GetMapping("/daily/{date}")
    @PreAuthorize("hasRole('ADMIN')")
    public DailyReportDTO getDailyReport(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return reportService.getDailyReport(date);
    }

    /**
     * Belirli bir tarih aralığına ait menü öğesi satışlarını listeler
     * @param startDate Başlangıç tarihi
     * @param endDate Bitiş tarihi
     * @return Menü öğesi satışları listesi
     */
    @GetMapping("/menu-items")
    @PreAuthorize("hasRole('ADMIN')")
    public List<MenuItemSalesDTO> getMenuItemSales(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return reportService.getMenuItemSales(startDate, endDate);
    }
}