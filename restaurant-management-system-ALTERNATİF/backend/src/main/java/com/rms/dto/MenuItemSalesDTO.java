package com.rms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Menü öğesi satışları DTO sınıfı.
 * Bir menü öğesinin satış verilerini taşır.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemSalesDTO {
    private Long menuItemId;
    private String menuItemName;
    private String category;
    private int quantitySold;
    private double totalRevenue;
    private double unitPrice;
}