package com.rms.service;

import com.rms.model.RestaurantTable;
import com.rms.model.TableStatus;

import java.util.List;

/**
 * Masa service interface'i.
 * Masa işlemleri için metodlar tanımlar.
 */
public interface TableService {
    
    /**
     * Tüm masaları listeler
     * @return Masalar listesi
     */
    List<RestaurantTable> getAllTables();
    
    /**
     * ID'ye göre masa getirir
     * @param id Masa ID
     * @return Masa
     */
    RestaurantTable getTableById(Long id);
    
    /**
     * Masa numarasına göre masa getirir
     * @param number Masa numarası
     * @return Masa
     */
    RestaurantTable getTableByNumber(Integer number);
    
    /**
     * Duruma göre masaları listeler
     * @param status Masa durumu (AVAILABLE/OCCUPIED)
     * @return Masalar listesi
     */
    List<RestaurantTable> getTablesByStatus(TableStatus status);
    
    /**
     * Yeni masa oluşturur
     * @param table Masa bilgileri
     * @return Oluşturulan masa
     */
    RestaurantTable createTable(RestaurantTable table);
    
    /**
     * Masayı günceller
     * @param id Masa ID
     * @param table Yeni masa bilgileri
     * @return Güncellenen masa
     */
    RestaurantTable updateTable(Long id, RestaurantTable table);
    
    /**
     * Masa durumunu günceller
     * @param id Masa ID
     * @param status Yeni masa durumu
     * @return Güncellenen masa
     */
    RestaurantTable updateTableStatus(Long id, TableStatus status);
    
    /**
     * Masayı siler
     * @param id Masa ID
     */
    void deleteTable(Long id);
}