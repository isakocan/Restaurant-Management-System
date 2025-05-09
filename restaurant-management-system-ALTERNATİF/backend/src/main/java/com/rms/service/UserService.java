package com.rms.service;

import com.rms.model.User;

import java.util.List;

/**
 * Kullanıcı service interface'i.
 * Kullanıcı işlemleri için metodlar tanımlar.
 */
public interface UserService {
    
    /**
     * Tüm kullanıcıları listeler
     * @return Kullanıcılar listesi
     */
    List<User> getAllUsers();
    
    /**
     * ID'ye göre kullanıcı getirir
     * @param id Kullanıcı ID
     * @return Kullanıcı
     */
    User getUserById(Long id);
    
    /**
     * Kullanıcı adına göre kullanıcı getirir
     * @param username Kullanıcı adı
     * @return Kullanıcı
     */
    User getUserByUsername(String username);
    
    /**
     * Yeni kullanıcı oluşturur
     * @param user Kullanıcı bilgileri
     * @return Oluşturulan kullanıcı
     */
    User createUser(User user);
    
    /**
     * Kullanıcıyı günceller
     * @param id Kullanıcı ID
     * @param user Yeni kullanıcı bilgileri
     * @return Güncellenen kullanıcı
     */
    User updateUser(Long id, User user);
    
    /**
     * Kullanıcıyı siler
     * @param id Kullanıcı ID
     */
    void deleteUser(Long id);
}