-- Başlangıç Verileri: data.sql

-- Kullanıcılar (Şifrelenmiş şifre: "password")
INSERT INTO users (username, password, full_name, role, created_at, updated_at) 
VALUES 
('admin', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'Admin Kullanıcı', 'ROLE_ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('garson1', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'Garson Bir', 'ROLE_STAFF', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('garson2', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'Garson İki', 'ROLE_STAFF', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE updated_at = VALUES(updated_at);

-- Masalar
INSERT INTO tables (number, status, pos_x, pos_y) 
VALUES 
(1, 'AVAILABLE', 100, 100),
(2, 'AVAILABLE', 200, 100),
(3, 'AVAILABLE', 300, 100),
(4, 'AVAILABLE', 100, 200),
(5, 'AVAILABLE', 200, 200),
(6, 'AVAILABLE', 300, 200),
(7, 'AVAILABLE', 100, 300),
(8, 'AVAILABLE', 200, 300),
(9, 'AVAILABLE', 300, 300)
ON DUPLICATE KEY UPDATE status = VALUES(status);

-- Menü Öğeleri - Ana Yemekler
INSERT INTO menu_items (name, category, price, description, image_url, created_at, updated_at) 
VALUES 
('Izgara Köfte', 'Ana Yemek', 85.00, 'Izgara köfte, yanında pilav ve salata ile servis edilir', 'https://example.com/kofte.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tavuk Şiş', 'Ana Yemek', 75.00, 'Tavuk şiş, yanında bulgur pilavı ve közlenmiş sebzeler ile servis edilir', 'https://example.com/tavuk-sis.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Karışık Izgara', 'Ana Yemek', 120.00, 'Kuzu pirzola, köfte, tavuk şiş ve dana bonfile karışımı', 'https://example.com/karisik-izgara.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mantı', 'Ana Yemek', 65.00, 'Ev yapımı mantı, sarımsaklı yoğurt ve tereyağı ile servis edilir', 'https://example.com/manti.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE updated_at = VALUES(updated_at);

-- Menü Öğeleri - Çorbalar
INSERT INTO menu_items (name, category, price, description, image_url, created_at, updated_at) 
VALUES 
('Mercimek Çorbası', 'Çorba', 30.00, 'Geleneksel Türk mercimek çorbası, limon ve kıtır ekmek ile servis edilir', 'https://example.com/mercimek.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ezogelin Çorbası', 'Çorba', 30.00, 'Ezogelin çorbası, baharatlı tereyağı ile servis edilir', 'https://example.com/ezogelin.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Yayla Çorbası', 'Çorba', 30.00, 'Yayla çorbası, nane ve pul biber ile servis edilir', 'https://example.com/yayla.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE updated_at = VALUES(updated_at);

-- Menü Öğeleri - Salatalar
INSERT INTO menu_items (name, category, price, description, image_url, created_at, updated_at) 
VALUES 
('Çoban Salatası', 'Salata', 40.00, 'Domates, salatalık, biber, soğan, maydanoz ve zeytinyağı', 'https://example.com/coban.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mevsim Salatası', 'Salata', 40.00, 'Mevsim yeşillikleri, domates, salatalık ve özel sos', 'https://example.com/mevsim.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sezar Salatası', 'Salata', 55.00, 'Marul, tavuk, kruton, parmesan peyniri ve sezar sos', 'https://example.com/sezar.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE updated_at = VALUES(updated_at);

-- Menü Öğeleri - İçecekler
INSERT INTO menu_items (name, category, price, description, image_url, created_at, updated_at) 
VALUES 
('Ayran', 'İçecek', 15.00, 'Ev yapımı ayran', 'https://example.com/ayran.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kola', 'İçecek', 20.00, '330ml kutu', 'https://example.com/kola.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Maden Suyu', 'İçecek', 15.00, '250ml şişe', 'https://example.com/maden-suyu.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Çay', 'İçecek', 10.00, 'Türk çayı', 'https://example.com/cay.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Türk Kahvesi', 'İçecek', 25.00, 'Geleneksel Türk kahvesi', 'https://example.com/turk-kahvesi.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE updated_at = VALUES(updated_at);

-- Menü Öğeleri - Tatlılar
INSERT INTO menu_items (name, category, price, description, image_url, created_at, updated_at) 
VALUES 
('Künefe', 'Tatlı', 60.00, 'Sıcak künefe, dondurma ile servis edilir', 'https://example.com/kunefe.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Baklava', 'Tatlı', 50.00, '4 dilim antep fıstıklı baklava', 'https://example.com/baklava.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sütlaç', 'Tatlı', 40.00, 'Fırında sütlaç', 'https://example.com/sutlac.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kazandibi', 'Tatlı', 40.00, 'Geleneksel kazandibi', 'https://example.com/kazandibi.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE updated_at = VALUES(updated_at);