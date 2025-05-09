package com.rms.repository;

import com.rms.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Menü öğesi repository interface'i.
 * Menü öğeleri veritabanı işlemleri için JPA metodları sağlar.
 */
@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    
    /**
     * Kategoriye göre menü öğelerini listeler
     * @param category Kategori adı
     * @return Menü öğeleri listesi
     */
    List<MenuItem> findByCategory(String category);
    
    /**
     * Tüm kategorileri listeler (tekrar etmeyecek şekilde)
     * @return Kategori adları listesi
     */
    List<String> findDistinctCategories();
}