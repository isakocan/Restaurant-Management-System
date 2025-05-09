package com.rms.repository;

import com.rms.model.RestaurantTable;
import com.rms.model.TableStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Masa repository interface'i.
 * Masa veritabanı işlemleri için JPA metodları sağlar.
 */
@Repository
public interface TableRepository extends JpaRepository<RestaurantTable, Long> {
    
    /**
     * Masa numarasına göre masa arar
     * @param number Masa numarası
     * @return Masa (varsa)
     */
    Optional<RestaurantTable> findByNumber(Integer number);
    
    /**
     * Duruma göre masaları listeler
     * @param status Masa durumu (AVAILABLE/OCCUPIED)
     * @return Masalar listesi
     */
    List<RestaurantTable> findByStatus(TableStatus status);
}