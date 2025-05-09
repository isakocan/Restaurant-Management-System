package com.rms.controller;

import com.rms.model.MenuItem;
import com.rms.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * Menü öğesi controller'ı.
 * Menü öğeleri CRUD işlemlerini yönetir.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/menu")
public class MenuItemController {
    @Autowired
    private MenuItemService menuItemService;

    /**
     * Tüm menü öğelerini listeler
     * @return Menü öğeleri listesi
     */
    @GetMapping
    public List<MenuItem> getAllMenuItems() {
        return menuItemService.getAllMenuItems();
    }

    /**
     * ID'ye göre menü öğesi getirir
     * @param id Menü öğesi ID
     * @return Menü öğesi
     */
    @GetMapping("/{id}")
    public MenuItem getMenuItemById(@PathVariable Long id) {
        return menuItemService.getMenuItemById(id);
    }

    /**
     * Kategoriye göre menü öğelerini listeler
     * @param category Kategori adı
     * @return Menü öğeleri listesi
     */
    @GetMapping("/category/{category}")
    public List<MenuItem> getMenuItemsByCategory(@PathVariable String category) {
        return menuItemService.getMenuItemsByCategory(category);
    }

    /**
     * Tüm kategorileri listeler
     * @return Kategori adları listesi
     */
    @GetMapping("/categories")
    public List<String> getAllCategories() {
        return menuItemService.getAllCategories();
    }

    /**
     * Yeni menü öğesi oluşturur
     * @param menuItem Menü öğesi bilgileri
     * @return Oluşturulan menü öğesi
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public MenuItem createMenuItem(@Valid @RequestBody MenuItem menuItem) {
        return menuItemService.createMenuItem(menuItem);
    }

    /**
     * Menü öğesini günceller
     * @param id Menü öğesi ID
     * @param menuItem Yeni menü öğesi bilgileri
     * @return Güncellenen menü öğesi
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public MenuItem updateMenuItem(@PathVariable Long id, @Valid @RequestBody MenuItem menuItem) {
        return menuItemService.updateMenuItem(id, menuItem);
    }

    /**
     * Menü öğesini siler
     * @param id Menü öğesi ID
     * @return Başarı mesajı
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long id) {
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.ok().build();
    }
}