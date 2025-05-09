package com.rms.service.impl;

import com.rms.model.User;
import com.rms.repository.UserRepository;
import com.rms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;

/**
 * Kullanıcı service implementasyonu.
 * Kullanıcı işlemlerinin uygulamasını içerir.
 */
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Kullanıcı bulunamadı: " + id));
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Kullanıcı bulunamadı: " + username));
    }

    @Override
    public User createUser(User user) {
        // Kullanıcı adının benzersiz olduğunu kontrol et
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Bu kullanıcı adı zaten kullanılıyor: " + user.getUsername());
        }
        
        // Şifreyi şifrele
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, User updatedUser) {
        User existingUser = getUserById(id);
        
        // Kullanıcı adı değiştiyse, yeni adın benzersiz olduğunu kontrol et
        if (!existingUser.getUsername().equals(updatedUser.getUsername()) &&
                userRepository.existsByUsername(updatedUser.getUsername())) {
            throw new IllegalArgumentException("Bu kullanıcı adı zaten kullanılıyor: " + updatedUser.getUsername());
        }
        
        // Şifre değiştiyse şifrele
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }
        
        existingUser.setUsername(updatedUser.getUsername());
        existingUser.setFullName(updatedUser.getFullName());
        existingUser.setRole(updatedUser.getRole());
        
        return userRepository.save(existingUser);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("Kullanıcı bulunamadı: " + id);
        }
        userRepository.deleteById(id);
    }
}