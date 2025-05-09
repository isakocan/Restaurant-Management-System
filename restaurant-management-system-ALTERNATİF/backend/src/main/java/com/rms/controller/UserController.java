package com.rms.controller;

import com.rms.model.User;
import com.rms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * Kullanıcı controller'ı.
 * Kullanıcı CRUD işlemlerini yönetir.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    /**
     * Tüm kullanıcıları listeler
     * @return Kullanıcılar listesi
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    /**
     * ID'ye göre kullanıcı getirir
     * @param id Kullanıcı ID
     * @return Kullanıcı
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    /**
     * Yeni kullanıcı oluşturur
     * @param user Kullanıcı bilgileri
     * @return Oluşturulan kullanıcı
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public User createUser(@Valid @RequestBody User user) {
        return userService.createUser(user);
    }

    /**
     * Kullanıcıyı günceller
     * @param id Kullanıcı ID
     * @param user Yeni kullanıcı bilgileri
     * @return Güncellenen kullanıcı
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public User updateUser(@PathVariable Long id, @Valid @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    /**
     * Kullanıcıyı siler
     * @param id Kullanıcı ID
     * @return Başarı mesajı
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}