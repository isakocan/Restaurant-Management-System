package com.rms.repository;

import com.rms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Kullanıcı repository interface'i.
 * Kullanıcı veritabanı işlemleri için JPA metodları sağlar.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Kullanıcı adına göre kullanıcı arar
     * @param username Kullanıcı adı
     * @return Kullanıcı (varsa)
     */
    Optional<User> findByUsername(String username);
    
    /**
     * Kullanıcı adının varlığını kontrol eder
     * @param username Kullanıcı adı
     * @return true/false
     */
    Boolean existsByUsername(String username);
}