/**
 * Admin panel fonksiyonları
 * Yönetici kullanıcılar için arayüz işlevleri
 */
const ADMIN = {
    /**
     * Dashboard sayfasını yükler
     */
    loadDashboard: async function() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="row">
                <div class="col-md-12">
                    <h2 class="mb-4">Dashboard</h2>
                </div>
            </div>
            
            <div class="row">
                <!-- İstatistikler -->
                <div class="col-md-3">
                    <div class="card stat-card">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="icon me-3">
                                    <i class="bi bi-people"></i>
                                </div>
                                <div>
                                    <div class="stat-value" id="total-users">-</div>
                                    <div class="stat-label">Kullanıcılar</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-3">
                    <div class="card stat-card">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="icon me-3">
                                    <i class="bi bi-table"></i>
                                </div>
                                <div>
                                    <div class="stat-value" id="total-tables">-</div>
                                    <div class="stat-label">Masalar</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-3">
                    <div class="card stat-card">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="icon me-3">
                                    <i class="bi bi-cup-hot"></i>
                                </div>
                                <div>
                                    <div class="stat-value" id="total-menu-items">-</div>
                                    <div class="stat-label">Menü Öğeleri</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-3">
                    <div class="card stat-card">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="icon me-3">
                                    <i class="bi bi-cash-coin"></i>
                                </div>
                                <div>
                                    <div class="stat-value" id="daily-revenue">-</div>
                                    <div class="stat-label">Günlük Gelir</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mt-4">
                <!-- Son Siparişler -->
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title">Son Siparişler</h5>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-sm table-hover">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Masa</th>
                                            <th>Tutar</th>
                                            <th>Durum</th>
                                            <th>Zaman</th>
                                        </tr>
                                    </thead>
                                    <tbody id="recent-orders-table">
                                        <tr>
                                            <td colspan="5" class="text-center">Yükleniyor...</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Masa Durumları -->
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title">Masa Durumları</h5>
                        </div>
                        <div class="card-body">
                            <div class="tables-map" id="tables-map">
                                <!-- Masalar burada gösterilecek -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Dashboard verilerini yükle
        await this.loadDashboardData();
    },
    
    /**
     * Dashboard verilerini yükler
     */
    loadDashboardData: async function() {
        try {
            // Kullanıcı sayısı
            const users = await API.users.getAll();
            document.getElementById('total-users').textContent = users.length;
            
            // Masa sayısı
            const tables = await API.tables.getAll();
            document.getElementById('total-tables').textContent = tables.length;
            
            // Menü öğeleri sayısı
            const menuItems = await API.menu.getAll();
            document.getElementById('total-menu-items').textContent = menuItems.length;
            
            // Günlük gelir
            const today = new Date().toISOString().split('T')[0];
            const dailyReport = await API.reports.getDailyReport(today);
            document.getElementById('daily-revenue').textContent = `₺${dailyReport.totalRevenue.toFixed(2)}`;
            
            // Son siparişler
            const orders = await API.orders.getAll();
            const recentOrders = orders.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime)).slice(0, 5);
            
            const ordersTableBody = document.getElementById('recent-orders-table');
            ordersTableBody.innerHTML = '';
            
            if (recentOrders.length === 0) {
                ordersTableBody.innerHTML = `<tr><td colspan="5" class="text-center">Henüz sipariş bulunmuyor</td></tr>`;
            } else {
                recentOrders.forEach(order => {
                    const orderDate = new Date(order.orderTime);
                    
                    let statusClass = '';
                    switch (order.status) {
                        case CONFIG.ORDER_STATUS.COMPLETED:
                            statusClass = 'text-success';
                            break;
                        case CONFIG.ORDER_STATUS.PROCESSING:
                            statusClass = 'text-primary';
                            break;
                        case CONFIG.ORDER_STATUS.PENDING:
                            statusClass = 'text-warning';
                            break;
                        case CONFIG.ORDER_STATUS.CANCELLED:
                            statusClass = 'text-danger';
                            break;
                    }
                    
                    ordersTableBody.innerHTML += `
                        <tr>
                            <td>#${order.id}</td>
                            <td>Masa ${order.tableId}</td>
                            <td>₺${order.totalAmount.toFixed(2)}</td>
                            <td><span class="${statusClass}">${order.status}</span></td>
                            <td>${orderDate.toLocaleTimeString()}</td>
                        </tr>
                    `;
                });
            }
            
            // Masa durumları
            const tablesMap = document.getElementById('tables-map');
            tablesMap.innerHTML = '';
            
            tables.forEach(table => {
                const tableItem = document.createElement('div');
                tableItem.className = `table-item ${table.status.toLowerCase()}`;
                tableItem.style.left = `${table.posX}px`;
                tableItem.style.top = `${table.posY}px`;
                tableItem.innerHTML = `
                    <div class="table-number">${table.number}</div>
                    <div class="table-status">${table.status === CONFIG.TABLE_STATUS.AVAILABLE ? 'Boş' : 'Dolu'}</div>
                `;
                tablesMap.appendChild(tableItem);
            });
            
        } catch (error) {
            console.error('Dashboard veri yükleme hatası:', error);
            MAIN.showAlert('Dashboard verileri yüklenirken bir hata oluştu', 'danger');
        }
    },
    
    /**
     * Kullanıcı yönetimi sayfasını yükler
     */
    loadUsers: async function() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="row">
                <div class="col-md-12">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2>Kullanıcılar</h2>
                        <button class="btn btn-primary" id="add-user-btn">
                            <i class="bi bi-plus-circle"></i> Yeni Kullanıcı
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Kullanıcı Adı</th>
                                            <th>Ad Soyad</th>
                                            <th>Rol</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody id="users-table">
                                        <tr>
                                            <td colspan="5" class="text-center">Yükleniyor...</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Kullanıcı Ekle/Düzenle Modal -->
            <div class="modal fade" id="userModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="userModalTitle">Kullanıcı Ekle</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="user-form">
                                <input type="hidden" id="user-id">
                                <div class="mb-3">
                                    <label for="user-username" class="form-label">Kullanıcı Adı</label>
                                    <input type="text" class="form-control" id="user-username" required>
                                </div>
                                <div class="mb-3">
                                    <label for="user-fullname" class="form-label">Ad Soyad</label>
                                    <input type="text" class="form-control" id="user-fullname" required>
                                </div>
                                <div class="mb-3">
                                    <label for="user-password" class="form-label">Şifre</label>
                                    <input type="password" class="form-control" id="user-password">
                                    <small class="text-muted" id="password-help">Düzenleme sırasında boş bırakırsanız şifre değişmez</small>
                                </div>
                                <div class="mb-3">
                                    <label for="user-role" class="form-label">Rol</label>
                                    <select class="form-select" id="user-role" required>
                                        <option value="ROLE_ADMIN">Yönetici</option>
                                        <option value="ROLE_STAFF">Personel</option>
                                    </select>
                                </div>
                                <div class="text-danger mb-3" id="user-form-error"></div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">İptal</button>
                            <button type="button" class="btn btn-primary" id="save-user-btn">Kaydet</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Kullanıcı Sil Onay Modal -->
            <div class="modal fade" id="deleteUserModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Kullanıcı Sil</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>Bu kullanıcıyı silmek istediğinize emin misiniz?</p>
                            <p>Kullanıcı: <span id="delete-user-name"></span></p>
                            <input type="hidden" id="delete-user-id">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">İptal</button>
                            <button type="button" class="btn btn-danger" id="confirm-delete-user-btn">Sil</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Kullanıcıları yükle
        await this.loadUsersData();
        
        // Event listener'ları ekle
        this.setupUserEvents();
    },
    
    /**
     * Kullanıcı verileri için event listener'ları ekler
     */
    setupUserEvents: function() {
        // Yeni kullanıcı ekleme
        const addUserBtn = document.getElementById('add-user-btn');
        addUserBtn.addEventListener('click', () => {
            // Form alanlarını temizle
            document.getElementById('user-id').value = '';
            document.getElementById('user-username').value = '';
            document.getElementById('user-fullname').value = '';
            document.getElementById('user-password').value = '';
            document.getElementById('user-role').value = 'ROLE_STAFF';
            document.getElementById('user-form-error').textContent = '';
            
            // Şifre yardım metnini gizle (ekleme sırasında şifre zorunlu)
            document.getElementById('password-help').style.display = 'none';
            document.getElementById('user-password').required = true;
            
            // Modal başlığını güncelle
            document.getElementById('userModalTitle').textContent = 'Yeni Kullanıcı Ekle';
            
            // Modal'ı göster
            const userModal = new bootstrap.Modal(document.getElementById('userModal'));
            userModal.show();
        });
        
        // Kullanıcı kaydetme
        const saveUserBtn = document.getElementById('save-user-btn');
        saveUserBtn.addEventListener('click', async () => {
            // Form verilerini al
            const userId = document.getElementById('user-id').value;
            const username = document.getElementById('user-username').value;
            const fullName = document.getElementById('user-fullname').value;
            const password = document.getElementById('user-password').value;
            const role = document.getElementById('user-role').value;
            const errorElement = document.getElementById('user-form-error');
            
            errorElement.textContent = '';
            
            try {
                if (!username || !fullName) {
                    errorElement.textContent = 'Lütfen tüm alanları doldurun';
                    return;
                }
                
                if (!userId && !password) {
                    errorElement.textContent = 'Şifre gereklidir';
                    return;
                }
                
                const userData = {
                    username,
                    fullName,
                    role
                };
                
                if (password) {
                    userData.password = password;
                }
                
                // Güncelleme veya ekleme
                if (userId) {
                    await API.users.update(userId, userData);
                    MAIN.showAlert('Kullanıcı başarıyla güncellendi', 'success');
                } else {
                    await API.users.create(userData);
                    MAIN.showAlert('Kullanıcı başarıyla eklendi', 'success');
                }
                
                // Modal'ı kapat
                const userModal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
                userModal.hide();
                
                // Kullanıcı listesini yenile
                this.loadUsersData();
            } catch (error) {
                errorElement.textContent = error.message || 'Bir hata oluştu';
            }
        });
        
        // Kullanıcı silme onayı
        const confirmDeleteUserBtn = document.getElementById('confirm-delete-user-btn');
        confirmDeleteUserBtn.addEventListener('click', async () => {
            const userId = document.getElementById('delete-user-id').value;
            
            try {
                await API.users.delete(userId);
                
                // Modal'ı kapat
                const deleteUserModal = bootstrap.Modal.getInstance(document.getElementById('deleteUserModal'));
                deleteUserModal.hide();
                
                // Başarı mesajı göster
                MAIN.showAlert('Kullanıcı başarıyla silindi', 'success');
                
                // Kullanıcı listesini yenile
                this.loadUsersData();
            } catch (error) {
                MAIN.showAlert(error.message || 'Kullanıcı silinirken bir hata oluştu', 'danger');
            }
        });
    },
    
    /**
     * Kullanıcı verilerini yükler
     */
    loadUsersData: async function() {
        try {
            const users = await API.users.getAll();
            
            const usersTableBody = document.getElementById('users-table');
            usersTableBody.innerHTML = '';
            
            if (users.length === 0) {
                usersTableBody.innerHTML = `<tr><td colspan="5" class="text-center">Henüz kullanıcı bulunmuyor</td></tr>`;
            } else {
                users.forEach(user => {
                    let roleText = '';
                    
                    switch (user.role) {
                        case CONFIG.ROLES.ADMIN:
                            roleText = '<span class="badge bg-danger">Yönetici</span>';
                            break;
                        case CONFIG.ROLES.STAFF:
                            roleText = '<span class="badge bg-primary">Personel</span>';
                            break;
                        default:
                            roleText = '<span class="badge bg-secondary">Bilinmiyor</span>';
                    }
                    
                    usersTableBody.innerHTML += `
                        <tr>
                            <td>#${user.id}</td>
                            <td>${user.username}</td>
                            <td>${user.fullName}</td>
                            <td>${roleText}</td>
                            <td>
                                <button class="btn btn-sm btn-primary edit-user-btn" data-id="${user.id}">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-sm btn-danger delete-user-btn" data-id="${user.id}" data-name="${user.fullName}">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                });
                
                // Edit ve Delete butonlarına event listener'lar ekle
                document.querySelectorAll('.edit-user-btn').forEach(btn => {
                    btn.addEventListener('click', async () => {
                        const userId = btn.getAttribute('data-id');
                        
                        try {
                            const user = await API.users.getById(userId);
                            
                            // Form alanlarını doldur
                            document.getElementById('user-id').value = user.id;
                            document.getElementById('user-username').value = user.username;
                            document.getElementById('user-fullname').value = user.fullName;
                            document.getElementById('user-password').value = '';
                            document.getElementById('user-role').value = user.role;
                            document.getElementById('user-form-error').textContent = '';
                            
                            // Şifre yardım metnini göster (düzenleme sırasında şifre isteğe bağlı)
                            document.getElementById('password-help').style.display = 'block';
                            document.getElementById('user-password').required = false;
                            
                            // Modal başlığını güncelle
                            document.getElementById('userModalTitle').textContent = 'Kullanıcı Düzenle';
                            
                            // Modal'ı göster
                            const userModal = new bootstrap.Modal(document.getElementById('userModal'));
                            userModal.show();
                        } catch (error) {
                            MAIN.showAlert(error.message || 'Kullanıcı bilgileri yüklenirken bir hata oluştu', 'danger');
                        }
                    });
                });
                
                document.querySelectorAll('.delete-user-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const userId = btn.getAttribute('data-id');
                        const userName = btn.getAttribute('data-name');
                        
                        // Onay modal'ını ayarla
                        document.getElementById('delete-user-id').value = userId;
                        document.getElementById('delete-user-name').textContent = userName;
                        
                        // Onay modal'ını göster
                        const deleteUserModal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
                        deleteUserModal.show();
                    });
                });
            }
        } catch (error) {
            console.error('Kullanıcılar yüklenirken hata:', error);
            MAIN.showAlert('Kullanıcılar yüklenirken bir hata oluştu', 'danger');
        }
    },
    
    /**
     * Rapor sayfasını yükler
     */
    loadReports: async function() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="row">
                <div class="col-md-12">
                    <h2 class="mb-4">Raporlar</h2>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-12 mb-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title">Günlük Rapor</h5>
                        </div>
                        <div class="card-body">
                            <div class="report-filters">
                                <div class="row">
                                    <div class="col-md-4">
                                        <label for="daily-report-date" class="form-label">Tarih</label>
                                        <input type="date" class="form-control" id="daily-report-date" value="${new Date().toISOString().split('T')[0]}">
                                    </div>
                                    <div class="col-md-4 d-flex align-items-end">
                                        <button class="btn btn-primary" id="load-daily-report-btn">Raporu Yükle</button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-4" id="daily-report-content">
                                <div class="alert alert-info">
                                    Günlük rapor verilerini görmek için yukarıdaki "Raporu Yükle" butonuna tıklayın.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title">Ürün Satış Raporu</h5>
                        </div>
                        <div class="card-body">
                            <div class="report-filters">
                                <div class="row">
                                    <div class="col-md-4">
                                        <label for="sales-report-start-date" class="form-label">Başlangıç Tarihi</label>
                                        <input type="date" class="form-control" id="sales-report-start-date" value="${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}">
                                    </div>
                                    <div class="col-md-4">
                                        <label for="sales-report-end-date" class="form-label">Bitiş Tarihi</label>
                                        <input type="date" class="form-control" id="sales-report-end-date" value="${new Date().toISOString().split('T')[0]}">
                                    </div>
                                    <div class="col-md-4 d-flex align-items-end">
                                        <button class="btn btn-primary" id="load-sales-report-btn">Raporu Yükle</button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-4" id="sales-report-content">
                                <div class="alert alert-info">
                                    Ürün satış raporu verilerini görmek için yukarıdaki "Raporu Yükle" butonuna tıklayın.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Event listener'ları ekle
        document.getElementById('load-daily-report-btn').addEventListener('click', () => {
            this.loadDailyReport();
        });
        
        document.getElementById('load-sales-report-btn').addEventListener('click', () => {
            this.loadSalesReport();
        });
    },
    
    /**
     * Günlük rapor verilerini yükler
     */
    loadDailyReport: async function() {
        try {
            const date = document.getElementById('daily-report-date').value;
            
            if (!date) {
                MAIN.showAlert('Lütfen bir tarih seçin', 'warning');
                return;
            }
            
            // Rapor verilerini yükle
            const report = await API.reports.getDailyReport(date);
            
            const dailyReportContent = document.getElementById('daily-report-content');
            
            // Formatlı tarih
            const formattedDate = new Date(date).toLocaleDateString('tr-TR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            dailyReportContent.innerHTML = `
                <div class="row">
                    <div class="col-md-12">
                        <h4>${formattedDate} Tarihli Günlük Rapor</h4>
                    </div>
                </div>
                
                <div class="row mt-3">
                    <div class="col-md-4">
                        <div class="card bg-light">
                            <div class="card-body">
                                <h5 class="card-title">Toplam Sipariş</h5>
                                <p class="card-text fs-2">${report.totalOrderCount}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="card bg-light">
                            <div class="card-body">
                                <h5 class="card-title">Toplam Gelir</h5>
                                <p class="card-text fs-2">₺${report.totalRevenue.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="card bg-light">
                            <div class="card-body">
                                <h5 class="card-title">Ortalama Sipariş Tutarı</h5>
                                <p class="card-text fs-2">₺${report.totalOrderCount > 0 ? (report.totalRevenue / report.totalOrderCount).toFixed(2) : '0.00'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="row mt-4">
                    <div class="col-md-12">
                        <h5>Ürün Satışları</h5>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Ürün</th>
                                        <th>Kategori</th>
                                        <th>Birim Fiyat</th>
                                        <th>Satış Adedi</th>
                                        <th>Toplam Gelir</th>
                                    </tr>
                                </thead>
                                <tbody id="product-sales-table">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
            
            const productSalesTable = document.getElementById('product-sales-table');
            
            if (report.itemSales.length === 0) {
                productSalesTable.innerHTML = `<tr><td colspan="5" class="text-center">Bu tarihte hiç satış bulunmuyor</td></tr>`;
            } else {
                // Satışları miktara göre sırala
                const sortedSales = [...report.itemSales].sort((a, b) => b.quantitySold - a.quantitySold);
                
                sortedSales.forEach(item => {
                    productSalesTable.innerHTML += `
                        <tr>
                            <td>${item.menuItemName}</td>
                            <td>${item.category || 'Belirtilmemiş'}</td>
                            <td>₺${item.unitPrice.toFixed(2)}</td>
                            <td>${item.quantitySold}</td>
                            <td>₺${item.totalRevenue.toFixed(2)}</td>
                        </tr>
                    `;
                });
            }
        } catch (error) {
            console.error('Günlük rapor yüklenirken hata:', error);
            MAIN.showAlert('Günlük rapor yüklenirken bir hata oluştu', 'danger');
        }
    },
    
    /**
     * Ürün satış raporu verilerini yükler
     */
    loadSalesReport: async function() {
        try {
            const startDate = document.getElementById('sales-report-start-date').value;
            const endDate = document.getElementById('sales-report-end-date').value;
            
            if (!startDate || !endDate) {
                MAIN.showAlert('Lütfen başlangıç ve bitiş tarihlerini seçin', 'warning');
                return;
            }
            
            if (new Date(startDate) > new Date(endDate)) {
                MAIN.showAlert('Başlangıç tarihi, bitiş tarihinden sonra olamaz', 'warning');
                return;
            }
            
            // Rapor verilerini yükle
            const salesData = await API.reports.getMenuItemSales(startDate, endDate);
            
            const salesReportContent = document.getElementById('sales-report-content');
            
            // Formatlı tarihler
            const formattedStartDate = new Date(startDate).toLocaleDateString('tr-TR');
            const formattedEndDate = new Date(endDate).toLocaleDateString('tr-TR');
            
            salesReportContent.innerHTML = `
                <div class="row">
                    <div class="col-md-12">
                        <h4>${formattedStartDate} - ${formattedEndDate} Tarihleri Arası Ürün Satış Raporu</h4>
                    </div>
                </div>
                
                <div class="row mt-4">
                    <div class="col-md-12">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Ürün</th>
                                        <th>Kategori</th>
                                        <th>Birim Fiyat</th>
                                        <th>Satış Adedi</th>
                                        <th>Toplam Gelir</th>
                                        <th>Satış Oranı</th>
                                    </tr>
                                </thead>
                                <tbody id="menu-sales-table">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
            
            const menuSalesTable = document.getElementById('menu-sales-table');
            
            if (salesData.length === 0) {
                menuSalesTable.innerHTML = `<tr><td colspan="6" class="text-center">Bu tarih aralığında hiç satış bulunmuyor</td></tr>`;
            } else {
                // Toplam satışı hesapla
                const totalQuantity = salesData.reduce((total, item) => total + item.quantitySold, 0);
                
                salesData.forEach(item => {
                    const salesRatioPercentage = ((item.quantitySold / totalQuantity) * 100).toFixed(2);
                    
                    menuSalesTable.innerHTML += `
                        <tr>
                            <td>${item.menuItemName}</td>
                            <td>${item.category || 'Belirtilmemiş'}</td>
                            <td>₺${item.unitPrice.toFixed(2)}</td>
                            <td>${item.quantitySold}</td>
                            <td>₺${item.totalRevenue.toFixed(2)}</td>
                            <td>
                                <div class="progress">
                                    <div class="progress-bar" role="progressbar" style="width: ${salesRatioPercentage}%;" 
                                        aria-valuenow="${salesRatioPercentage}" aria-valuemin="0" aria-valuemax="100">
                                        ${salesRatioPercentage}%
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `;
                });
            }
        } catch (error) {
            console.error('Ürün satış raporu yüklenirken hata:', error);
            MAIN.showAlert('Ürün satış raporu yüklenirken bir hata oluştu', 'danger');
        }
    },
    
    /**
     * Admin modülünü başlatır
     */
    init: function() {
        // İlgili event listener'ları ekler
    }
};