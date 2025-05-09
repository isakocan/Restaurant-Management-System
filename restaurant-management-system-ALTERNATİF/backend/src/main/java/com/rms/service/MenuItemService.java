package com.rms.service;

import com.rms.model.MenuItem;

import java.util.List;

/**
 * Menü öğesi service interface'i.
 * Menü öğeleri işlemleri için metodlar tanımlar.
 */
public interface MenuItemService {
    
    /**
     * Tüm menü öğelerini listeler
     * @return Menü öğeleri listesi
     */
    List<MenuItem> getAllMenuItems();
    
    /**
     * ID'ye göre menü öğesi getirir
     * @param id Menü öğesi ID
     * @return Menü öğesi
     */
    MenuItem getMenuItemById(Long id);
    
    /**
     * Kategoriye göre menü öğelerini listeler
     * @param category Kategori adı
     * @return Menü öğeleri listesi
     */
    List<MenuItem> getMenuItemsByCategory(String category);
    
    /**
     * Tüm kategorileri listeler
     * @return Kategori adları listesi
     */
    List<String> getAllCategories();
    
    /**
     * Yeni menü öğesi oluşturur
     * @param menuItem Menü öğesi bilgileri
     * @return Oluşturulan menü öğesi
     */
    MenuItem createMenuItem(MenuItem menuItem);
    
    /**
     * Menü öğesini günceller
     * @param id Menü öğesi ID
     * @param menuItem Yeni menü öğesi bilgileri
     * @return Güncellenen menü öğesi
     */
    MenuItem updateMenuItem(Long id, MenuItem menuItem);
    
    /**
     * Menü öğesini siler
     * @param id Menü öğesi ID
     */
    void deleteMenuItem(Long id);
}