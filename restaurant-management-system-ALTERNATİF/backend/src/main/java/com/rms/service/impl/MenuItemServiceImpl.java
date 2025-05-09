package com.rms.service.impl;

import com.rms.model.MenuItem;
import com.rms.repository.MenuItemRepository;
import com.rms.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;

/**
 * Menü öğesi service implementasyonu.
 * Menü öğeleri işlemlerinin uygulamasını içerir.
 */
@Service
public class MenuItemServiceImpl implements MenuItemService {

    private final MenuItemRepository menuItemRepository;

    @Autowired
    public MenuItemServiceImpl(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    @Override
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    @Override
    public MenuItem getMenuItemById(Long id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Menü öğesi bulunamadı: " + id));
    }

    @Override
    public List<MenuItem> getMenuItemsByCategory(String category) {
        return menuItemRepository.findByCategory(category);
    }

    @Override
    public List<String> getAllCategories() {
        return menuItemRepository.findDistinctCategories();
    }

    @Override
    public MenuItem createMenuItem(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    @Override
    public MenuItem updateMenuItem(Long id, MenuItem updatedMenuItem) {
        MenuItem existingMenuItem = getMenuItemById(id);
        
        existingMenuItem.setName(updatedMenuItem.getName());
        existingMenuItem.setCategory(updatedMenuItem.getCategory());
        existingMenuItem.setPrice(updatedMenuItem.getPrice());
        existingMenuItem.setDescription(updatedMenuItem.getDescription());
        existingMenuItem.setImageUrl(updatedMenuItem.getImageUrl());
        
        return menuItemRepository.save(existingMenuItem);
    }

    @Override
    public void deleteMenuItem(Long id) {
        if (!menuItemRepository.existsById(id)) {
            throw new EntityNotFoundException("Menü öğesi bulunamadı: " + id);
        }
        menuItemRepository.deleteById(id);
    }
}