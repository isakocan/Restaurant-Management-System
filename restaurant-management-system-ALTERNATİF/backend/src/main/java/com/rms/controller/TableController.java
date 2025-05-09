package com.rms.controller;

import com.rms.model.RestaurantTable;
import com.rms.model.TableStatus;
import com.rms.service.TableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * Masa controller'ı.
 * Masa CRUD işlemlerini yönetir.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tables")
public class TableController {
    @Autowired
    private TableService tableService;

    /**
     * Tüm masaları listeler
     * @return Masalar listesi
     */
    @GetMapping
    public List<RestaurantTable> getAllTables() {
        return tableService.getAllTables();
    }

    /**
     * ID'ye göre masa getirir
     * @param id Masa ID
     * @return Masa
     */
    @GetMapping("/{id}")
    public RestaurantTable getTableById(@PathVariable Long id) {
        return tableService.getTableById(id);
    }

    /**
     * Duruma göre masaları listeler
     * @param status Masa durumu (AVAILABLE/OCCUPIED)
     * @return Masalar listesi
     */
    @GetMapping("/status")
    public List<RestaurantTable> getTablesByStatus(@RequestParam TableStatus status) {
        return tableService.getTablesByStatus(status);
    }

    /**
     * Yeni masa oluşturur
     * @param table Masa bilgileri
     * @return Oluşturulan masa
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public RestaurantTable createTable(@Valid @RequestBody RestaurantTable table) {
        return tableService.createTable(table);
    }

    /**
     * Masayı günceller
     * @param id Masa ID
     * @param table Yeni masa bilgileri
     * @return Güncellenen masa
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public RestaurantTable updateTable(@PathVariable Long id, @Valid @RequestBody RestaurantTable table) {
        return tableService.updateTable(id, table);
    }

    /**
     * Masa durumunu günceller
     * @param id Masa ID
     * @param status Yeni masa durumu
     * @return Güncellenen masa
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public RestaurantTable updateTableStatus(@PathVariable Long id, @RequestParam TableStatus status) {
        return tableService.updateTableStatus(id, status);
    }

    /**
     * Masayı siler
     * @param id Masa ID
     * @return Başarı mesajı
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTable(@PathVariable Long id) {
        tableService.deleteTable(id);
        return ResponseEntity.ok().build();
    }
}