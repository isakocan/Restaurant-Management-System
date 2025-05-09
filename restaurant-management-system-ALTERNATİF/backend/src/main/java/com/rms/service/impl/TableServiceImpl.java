package com.rms.service.impl;

import com.rms.model.RestaurantTable;
import com.rms.model.TableStatus;
import com.rms.repository.TableRepository;
import com.rms.service.TableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;

/**
 * Masa service implementasyonu.
 * Masa işlemlerinin uygulamasını içerir.
 */
@Service
public class TableServiceImpl implements TableService {

    private final TableRepository tableRepository;

    @Autowired
    public TableServiceImpl(TableRepository tableRepository) {
        this.tableRepository = tableRepository;
    }

    @Override
    public List<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }

    @Override
    public RestaurantTable getTableById(Long id) {
        return tableRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Masa bulunamadı: " + id));
    }

    @Override
    public RestaurantTable getTableByNumber(Integer number) {
        return tableRepository.findByNumber(number)
                .orElseThrow(() -> new EntityNotFoundException("Masa bulunamadı: " + number));
    }

    @Override
    public List<RestaurantTable> getTablesByStatus(TableStatus status) {
        return tableRepository.findByStatus(status);
    }

    @Override
    public RestaurantTable createTable(RestaurantTable table) {
        // Masa numarasının benzersiz olduğunu kontrol et
        if (tableRepository.findByNumber(table.getNumber()).isPresent()) {
            throw new IllegalArgumentException("Bu masa numarası zaten kullanılıyor: " + table.getNumber());
        }
        
        // Varsayılan olarak masa durumu AVAILABLE olarak ayarla
        if (table.getStatus() == null) {
            table.setStatus(TableStatus.AVAILABLE);
        }
        
        return tableRepository.save(table);
    }

    @Override
    public RestaurantTable updateTable(Long id, RestaurantTable updatedTable) {
        RestaurantTable existingTable = getTableById(id);
        
        // Masa numarası değiştiyse, yeni numaranın benzersiz olduğunu kontrol et
        if (!existingTable.getNumber().equals(updatedTable.getNumber()) &&
                tableRepository.findByNumber(updatedTable.getNumber()).isPresent()) {
            throw new IllegalArgumentException("Bu masa numarası zaten kullanılıyor: " + updatedTable.getNumber());
        }
        
        existingTable.setNumber(updatedTable.getNumber());
        existingTable.setStatus(updatedTable.getStatus());
        existingTable.setPosX(updatedTable.getPosX());
        existingTable.setPosY(updatedTable.getPosY());
        
        return tableRepository.save(existingTable);
    }

    @Override
    public RestaurantTable updateTableStatus(Long id, TableStatus status) {
        RestaurantTable table = getTableById(id);
        table.setStatus(status);
        return tableRepository.save(table);
    }

    @Override
    public void deleteTable(Long id) {
        if (!tableRepository.existsById(id)) {
            throw new EntityNotFoundException("Masa bulunamadı: " + id);
        }
        tableRepository.deleteById(id);
    }
}