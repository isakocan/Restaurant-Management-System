/**
 * Yapılandırma dosyası
 * API URL'leri ve diğer sabitler burada tanımlanır
 */
const CONFIG = {
    // API URL'leri - Geliştirme için local, production için Railway URL'i
    API_URL: 'http://localhost:8080/api',
    // API_URL: 'https://restaurant-management-system-production.up.railway.app/api',
    
    // Token saklama anahtarı
    TOKEN_KEY: 'rms_token',
    
    // Kullanıcı bilgisi saklama anahtarı
    USER_KEY: 'rms_user',
    
    // Sayfa yükleme gecikmesi (ms)
    LOAD_DELAY: 300,
    
    // Sipariş durumları
    ORDER_STATUS: {
        PENDING: 'PENDING',
        PROCESSING: 'PROCESSING',
        COMPLETED: 'COMPLETED',
        CANCELLED: 'CANCELLED'
    },
    
    // Masa durumları
    TABLE_STATUS: {
        AVAILABLE: 'AVAILABLE',
        OCCUPIED: 'OCCUPIED'
    },
    
    // Kullanıcı rolleri
    ROLES: {
        ADMIN: 'ROLE_ADMIN',
        STAFF: 'ROLE_STAFF',
        CUSTOMER: 'ROLE_CUSTOMER'
    }
};