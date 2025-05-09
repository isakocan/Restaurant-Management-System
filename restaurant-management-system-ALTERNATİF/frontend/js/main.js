/**
 * Ana uygulama modülü
 * Sayfa yükleme ve genel işlevler
 */
const MAIN = {
    /**
     * Ana içeriği yükler
     */
    loadMainContent: function() {
        // Kullanıcıya rol bazlı içeriği göster
        if (AUTH.isLoggedIn()) {
            if (AUTH.isAdmin()) {
                // Admin paneli yükle
                ADMIN.loadDashboard();
            } else if (AUTH.isStaff()) {
                // Personel paneli yükle
                STAFF.loadTables();
            } else {
                // Müşteri sayfası yükle
                CUSTOMER.loadHomePage();
            }
        } else {
            // Giriş yapmamış kullanıcılar için ana sayfa
            CUSTOMER.loadHomePage();
        }
    },
    
    /**
     * Navigasyon menüsü için olay dinleyicileri ekler
     */
    setupNavigation: function() {
        // Ana sayfa
        document.getElementById('nav-home')?.addEventListener('click', (e) => {
            e.preventDefault();
            CUSTOMER.loadHomePage();
        });
        
        // Dashboard
        document.getElementById('nav-dashboard')?.addEventListener('click', (e) => {
            e.preventDefault();
            ADMIN.loadDashboard();
        });
        
        // Masalar
        document.getElementById('nav-tables')?.addEventListener('click', (e) => {
            e.preventDefault();
            if (AUTH.isAdmin() || AUTH.isStaff()) {
                STAFF.loadTables();
            } else {
                CUSTOMER.loadHomePage();
            }
        });
        
        // Menü
        document.getElementById('nav-menu')?.addEventListener('click', (e) => {
            e.preventDefault();
            CUSTOMER.loadMenu();
        });
        
        // Siparişler
        document.getElementById('nav-orders')?.addEventListener('click', (e) => {
            e.preventDefault();
            if (AUTH.isAdmin() || AUTH.isStaff()) {
                STAFF.loadOrders();
            }
        });
        
        // Kullanıcılar
        document.getElementById('nav-users')?.addEventListener('click', (e) => {
            e.preventDefault();
            if (AUTH.isAdmin()) {
                ADMIN.loadUsers();
            }
        });
        
        // Raporlar
        document.getElementById('nav-reports')?.addEventListener('click', (e) => {
            e.preventDefault();
            if (AUTH.isAdmin()) {
                ADMIN.loadReports();
            }
        });
    },
    
    /**
     * Bildirim mesajı gösterir
     * @param {string} message - Gösterilecek mesaj
     * @param {string} type - Bildirim tipi (success, danger, warning, info)
     * @param {number} duration - Bildirim süresi (ms)
     */
    showAlert: function(message, type = 'info', duration = 3000) {
        const alertContainer = document.getElementById('alert-container');
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.role = 'alert';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        alertContainer.appendChild(alert);
        
        // Otomatik kapat
        setTimeout(() => {
            if (alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, duration);
    },
    
    /**
     * Uygulamayı başlatır
     */
    init: function() {
        // Auth modülünü başlat
        AUTH.init();
        
        // Müşteri modülünü başlat
        CUSTOMER.init();
        
        // Navigasyon için olay dinleyicileri ekle
        this.setupNavigation();
        
        // Ana içeriği yükle
        this.loadMainContent();
        
        console.log('Restoran Yönetim Sistemi başlatıldı.');
    }
};

// Sayfa yüklendiğinde uygulamayı başlat
document.addEventListener('DOMContentLoaded', function() {
    // Loading göstergesini gizle
    setTimeout(() => {
        document.getElementById('loading')?.classList.add('d-none');
        
        // Uygulamayı başlat
        MAIN.init();
    }, CONFIG.LOAD_DELAY);
});