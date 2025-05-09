/**
 * Personel panel fonksiyonları
 * Personel kullanıcılar için arayüz işlevleri
 */
const STAFF = {
    /**
     * Masalar sayfasını yükler
     */
    loadTables: async function() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="row">
                <div class="col-md-12">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2>Masalar</h2>
                        ${AUTH.isAdmin() ? `
                            <button class="btn btn-primary" id="add-table-btn">
                                <i class="bi bi-plus-circle"></i> Yeni Masa
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-12 mb-4">
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-outline-primary active" id="all-tables-btn">Tüm Masalar</button>
                        <button type="button" class="btn btn-outline-success" id="available-tables-btn">Boş Masalar</button>
                        <button type="button" class="btn btn-outline-danger" id="occupied-tables-btn">Dolu Masalar</button>
                    </div>
                </div>
            </div>
            
            <div class="row" id="tables-container">
                <div class="col-12 text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Yükleniyor...</span>
                    </div>
                </div>
            </div>
            
            <!-- Masa Ekle/Düzenle Modal -->
            ${AUTH.isAdmin() ? `
            <div class="modal fade" id="tableModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="tableModalTitle">Masa Ekle</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="table-form">
                                <input type="hidden" id="table-id">
                                <div class="mb-3">
                                    <label for="table-number" class="form-label">Masa Numarası</label>
                                    <input type="number" class="form-control" id="table-number" required min="1">
                                </div>
                                <div class="mb-3">
                                    <label for="table-status" class="form-label">Durum</label>
                                    <select class="form-select" id="table-status" required>
                                        <option value="AVAILABLE">Boş</option>
                                        <option value="OCCUPIED">Dolu</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="table-pos-x" class="form-label">X Konumu (px)</label>
                                    <input type="number" class="form-control" id="table-pos-x" required min="0" max="500">
                                </div>
                                <div class="mb-3">
                                    <label for="table-pos-y" class="form-label">Y Konumu (px)</label>
                                    <input type="number" class="form-control" id="table-pos-y" required min="0" max="500">
                                </div>
                                <div class="text-danger mb-3" id="table-form-error"></div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">İptal</button>
                            <button type="button" class="btn btn-primary" id="save-table-btn">Kaydet</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Masa Sil Onay Modal -->
            <div class="modal fade" id="deleteTableModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Masa Sil</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>Bu masayı silmek istediğinize emin misiniz?</p>
                            <p>Masa: <span id="delete-table-number"></span></p>
                            <input type="hidden" id="delete-table-id">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">İptal</button>
                            <button type="button" class="btn btn-danger" id="confirm-delete-table-btn">Sil</button>
                        </div>
                    </div>
                </div>
            </div>
            ` : ''}
        `;
        
        // Masaları yükle
        await this.loadTablesData();
        
        // Event listener'ları ekle
        this.setupTableEvents();
    },
    
    /**
     * Masa verileri için event listener'ları ekler
     */
    setupTableEvents: function() {
        // Filtre butonları
        const allTablesBtn = document.getElementById('all-tables-btn');
        const availableTablesBtn = document.getElementById('available-tables-btn');
        const occupiedTablesBtn = document.getElementById('occupied-tables-btn');
        
        allTablesBtn.addEventListener('click', () => {
            allTablesBtn.classList.add('active');
            availableTablesBtn.classList.remove('active');
            occupiedTablesBtn.classList.remove('active');
            this.loadTablesData();
        });
        
        availableTablesBtn.addEventListener('click', () => {
            allTablesBtn.classList.remove('active');
            availableTablesBtn.classList.add('active');
            occupiedTablesBtn.classList.remove('active');
            this.loadTablesData(CONFIG.TABLE_STATUS.AVAILABLE);
        });
        
        occupiedTablesBtn.addEventListener('click', () => {
            allTablesBtn.classList.remove('active');
            availableTablesBtn.classList.remove('active');
            occupiedTablesBtn.classList.add('active');
            this.loadTablesData(CONFIG.TABLE_STATUS.OCCUPIED);
        });
        
        // Admin özel işlemleri
        if (AUTH.isAdmin()) {
            // Yeni masa ekleme
            const addTableBtn = document.getElementById('add-table-btn');
            addTableBtn.addEventListener('click', () => {
                // Form alanlarını temizle
                document.getElementById('table-id').value = '';
                document.getElementById('table-number').value = '';
                document.getElementById('table-status').value = 'AVAILABLE';
                document.getElementById('table-pos-x').value = '100';
                document.getElementById('table-pos-y').value = '100';
                document.getElementById('table-form-error').textContent = '';
                
                // Modal başlığını güncelle
                document.getElementById('tableModalTitle').textContent = 'Yeni Masa Ekle';
                
                // Modal'ı göster
                const tableModal = new bootstrap.Modal(document.getElementById('tableModal'));
                tableModal.show();
            });
            
            // Masa kaydetme
            const saveTableBtn = document.getElementById('save-table-btn');
            saveTableBtn.addEventListener('click', async () => {
                // Form verilerini al
                const tableId = document.getElementById('table-id').value;
                const number = parseInt(document.getElementById('table-number').value);
                const status = document.getElementById('table-status').value;
                const posX = parseInt(document.getElementById('table-pos-x').value);
                const posY = parseInt(document.getElementById('table-pos-y').value);
                const errorElement = document.getElementById('table-form-error');
                
                errorElement.textContent = '';
                
                try {
                    if (!number || isNaN(number) || number <= 0) {
                        errorElement.textContent = 'Geçerli bir masa numarası girin';
                        return;
                    }
                    
                    if (isNaN(posX) || posX < 0 || isNaN(posY) || posY < 0) {
                        errorElement.textContent = 'Geçerli konum değerleri girin';
                        return;
                    }
                    
                    const tableData = {
                        number,
                        status,
                        posX,
                        posY
                    };
                    
                    // Güncelleme veya ekleme
                    if (tableId) {
                        await API.tables.update(tableId, tableData);
                        MAIN.showAlert('Masa başarıyla güncellendi', 'success');
                    } else {
                        await API.tables.create(tableData);
                        MAIN.showAlert('Masa başarıyla eklendi', 'success');
                    }
                    
                    // Modal'ı kapat
                    const tableModal = bootstrap.Modal.getInstance(document.getElementById('tableModal'));
                    tableModal.hide();
                    
                    // Masa listesini yenile
                    this.loadTablesData();
                } catch (error) {
                    errorElement.textContent = error.message || 'Bir hata oluştu';
                }
            });
            
            // Masa silme onayı
            const confirmDeleteTableBtn = document.getElementById('confirm-delete-table-btn');
            confirmDeleteTableBtn.addEventListener('click', async () => {
                const tableId = document.getElementById('delete-table-id').value;
                
                try {
                    await API.tables.delete(tableId);
                    
                    // Modal'ı kapat
                    const deleteTableModal = bootstrap.Modal.getInstance(document.getElementById('deleteTableModal'));
                    deleteTableModal.hide();
                    
                    // Başarı mesajı göster
                    MAIN.showAlert('Masa başarıyla silindi', 'success');
                    
                    // Masa listesini yenile
                    this.loadTablesData();
                } catch (error) {
                    MAIN.showAlert(error.message || 'Masa silinirken bir hata oluştu', 'danger');
                }
            });
        }
    },
    
    /**
     * Masaları duruma göre filtreli olarak yükler
     * @param {string} status - Masa durumu (isteğe bağlı)
     */
    loadTablesData: async function(status = null) {
        try {
            let tables;
            
            if (status) {
                tables = await API.tables.getByStatus(status);
            } else {
                tables = await API.tables.getAll();
            }
            
            const tablesContainer = document.getElementById('tables-container');
            tablesContainer.innerHTML = '';
            
            if (tables.length === 0) {
                tablesContainer.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-info">
                            ${status ? `${status === CONFIG.TABLE_STATUS.AVAILABLE ? 'Boş' : 'Dolu'} masa bulunmuyor` : 'Henüz masa bulunmuyor'}
                        </div>
                    </div>
                `;
                return;
            }
            
            // Masaları numara sırasına göre sırala
            tables.sort((a, b) => a.number - b.number);
            
            // Her masa için kart oluştur
            tables.forEach(table => {
                const tableCard = document.getElementById('table-card-template').content.cloneNode(true);
                
                // Masa numarası
                tableCard.querySelector('.table-number').textContent = table.number;
                
                // Masa durumu
                const statusElement = tableCard.querySelector('.table-status');
                if (table.status === CONFIG.TABLE_STATUS.AVAILABLE) {
                    statusElement.textContent = 'Boş';
                    statusElement.classList.add('available');
                    tableCard.querySelector('.table-card').classList.add('available');
                } else {
                    statusElement.textContent = 'Dolu';
                    statusElement.classList.add('occupied');
                    tableCard.querySelector('.table-card').classList.add('occupied');
                }
                
                // Buton metnini ve işlevini ayarla
                const actionBtn = tableCard.querySelector('.table-action-btn');
                
                if (table.status === CONFIG.TABLE_STATUS.AVAILABLE) {
                    actionBtn.textContent = 'Sipariş Aç';
                    actionBtn.addEventListener('click', () => {
                        // Yeni sipariş sayfasına yönlendir
                        CUSTOMER.loadNewOrder(table.id);
                    });
                } else {
                    actionBtn.textContent = 'Siparişi Görüntüle';
                    actionBtn.addEventListener('click', async () => {
                        // Aktif siparişi getir
                        try {
                            const orders = await API.orders.getByTableId(table.id);
                            const activeOrders = orders.filter(order => 
                                order.status === CONFIG.ORDER_STATUS.PENDING || 
                                order.status === CONFIG.ORDER_STATUS.PROCESSING
                            );
                            
                            if (activeOrders.length > 0) {
                                // En son siparişi görüntüle
                                const latestOrder = activeOrders.sort((a, b) => 
                                    new Date(b.orderTime) - new Date(a.orderTime)
                                )[0];
                                
                                // Sipariş detay sayfasına yönlendir
                                STAFF.loadOrderDetail(latestOrder.id);
                            } else {
                                MAIN.showAlert('Bu masada aktif sipariş bulunmuyor', 'warning');
                            }
                        } catch (error) {
                            console.error('Sipariş yüklenirken hata:', error);
                            MAIN.showAlert('Sipariş yüklenirken bir hata oluştu', 'danger');
                        }
                    });
                }
                
                // Admin ise düzenleme ve silme butonları ekle
                if (AUTH.isAdmin()) {
                    const cardBody = tableCard.querySelector('.card-body');
                    
                    // Butonları düzenle
                    cardBody.querySelector('.table-action-btn').classList.remove('btn-primary');
                    cardBody.querySelector('.table-action-btn').classList.add('btn-success');
                    
                    // Düzenleme butonu
                    const editBtn = document.createElement('button');
                    editBtn.className = 'btn btn-sm btn-primary mt-2 me-2';
                    editBtn.innerHTML = '<i class="bi bi-pencil"></i> Düzenle';
                    editBtn.addEventListener('click', () => {
                        // Form alanlarını doldur
                        document.getElementById('table-id').value = table.id;
                        document.getElementById('table-number').value = table.number;
                        document.getElementById('table-status').value = table.status;
                        document.getElementById('table-pos-x').value = table.posX || 0;
                        document.getElementById('table-pos-y').value = table.posY || 0;
                        document.getElementById('table-form-error').textContent = '';
                        
                        // Modal başlığını güncelle
                        document.getElementById('tableModalTitle').textContent = 'Masa Düzenle';
                        
                        // Modal'ı göster
                        const tableModal = new bootstrap.Modal(document.getElementById('tableModal'));
                        tableModal.show();
                    });
                    
                    // Silme butonu
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'btn btn-sm btn-danger mt-2';
                    deleteBtn.innerHTML = '<i class="bi bi-trash"></i> Sil';
                    deleteBtn.addEventListener('click', () => {
                        // Onay modal'ını ayarla
                        document.getElementById('delete-table-id').value = table.id;
                        document.getElementById('delete-table-number').textContent = table.number;
                        
                        // Onay modal'ını göster
                        const deleteTableModal = new bootstrap.Modal(document.getElementById('deleteTableModal'));
                        deleteTableModal.show();
                    });
                    
                    // Butonları ekle
                    const buttonGroup = document.createElement('div');
                    buttonGroup.className = 'd-flex justify-content-center mt-2';
                    buttonGroup.appendChild(editBtn);
                    buttonGroup.appendChild(deleteBtn);
                    cardBody.appendChild(buttonGroup);
                }
                
                tablesContainer.appendChild(tableCard);
            });
        } catch (error) {
            console.error('Masalar yüklenirken hata:', error);
            MAIN.showAlert('Masalar yüklenirken bir hata oluştu', 'danger');
        }
    },
    
    /**
     * Siparişler sayfasını yükler
     */
    loadOrders: async function() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="row">
                <div class="col-md-12">
                    <h2 class="mb-4">Siparişler</h2>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-12 mb-4">
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-outline-primary active" id="all-orders-btn">Tüm Siparişler</button>
                        <button type="button" class="btn btn-outline-warning" id="pending-orders-btn">Bekleyen</button>
                        <button type="button" class="btn btn-outline-info" id="processing-orders-btn">İşleniyor</button>
                        <button type="button" class="btn btn-outline-success" id="completed-orders-btn">Tamamlanan</button>
                        <button type="button" class="btn btn-outline-danger" id="cancelled-orders-btn">İptal</button>
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
                                            <th>Masa</th>
                                            <th>Personel</th>
                                            <th>Tutar</th>
                                            <th>Durum</th>
                                            <th>Sipariş Zamanı</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody id="orders-table">
                                        <tr>
                                            <td colspan="7" class="text-center">Yükleniyor...</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Siparişleri yükle
        await this.loadOrdersData();
        
        // Event listener'ları ekle
        this.setupOrderEvents();
    },
    
    /**
     * Sipariş verileri için event listener'ları ekler
     */
    setupOrderEvents: function() {
        // Filtre butonları
        const allOrdersBtn = document.getElementById('all-orders-btn');
        const pendingOrdersBtn = document.getElementById('pending-orders-btn');
        const processingOrdersBtn = document.getElementById('processing-orders-btn');
        const completedOrdersBtn = document.getElementById('completed-orders-btn');
        const cancelledOrdersBtn = document.getElementById('cancelled-orders-btn');
        
        allOrdersBtn.addEventListener('click', () => {
            allOrdersBtn.classList.add('active');
            pendingOrdersBtn.classList.remove('active');
            processingOrdersBtn.classList.remove('active');
            completedOrdersBtn.classList.remove('active');
            cancelledOrdersBtn.classList.remove('active');
            this.loadOrdersData();
        });
        
        pendingOrdersBtn.addEventListener('click', () => {
            allOrdersBtn.classList.remove('active');
            pendingOrdersBtn.classList.add('active');
            processingOrdersBtn.classList.remove('active');
            completedOrdersBtn.classList.remove('active');
            cancelledOrdersBtn.classList.remove('active');
            this.loadOrdersData(CONFIG.ORDER_STATUS.PENDING);
        });
        
        processingOrdersBtn.addEventListener('click', () => {
            allOrdersBtn.classList.remove('active');
            pendingOrdersBtn.classList.remove('active');
            processingOrdersBtn.classList.add('active');
            completedOrdersBtn.classList.remove('active');
            cancelledOrdersBtn.classList.remove('active');
            this.loadOrdersData(CONFIG.ORDER_STATUS.PROCESSING);
        });
        
        completedOrdersBtn.addEventListener('click', () => {
            allOrdersBtn.classList.remove('active');
            pendingOrdersBtn.classList.remove('active');
            processingOrdersBtn.classList.remove('active');
            completedOrdersBtn.classList.add('active');
            cancelledOrdersBtn.classList.remove('active');
            this.loadOrdersData(CONFIG.ORDER_STATUS.COMPLETED);
        });
        
        cancelledOrdersBtn.addEventListener('click', () => {
            allOrdersBtn.classList.remove('active');
            pendingOrdersBtn.classList.remove('active');
            processingOrdersBtn.classList.remove('active');
            completedOrdersBtn.classList.remove('active');
            cancelledOrdersBtn.classList.add('active');
            this.loadOrdersData(CONFIG.ORDER_STATUS.CANCELLED);
        });
    },
    
    /**
     * Siparişleri duruma göre filtreli olarak yükler
     * @param {string} status - Sipariş durumu (isteğe bağlı)
     */
    loadOrdersData: async function(status = null) {
        try {
            let orders;
            
            if (status) {
                orders = await API.orders.getByStatus(status);
            } else {
                orders = await API.orders.getAll();
            }
            
            const ordersTable = document.getElementById('orders-table');
            ordersTable.innerHTML = '';
            
            if (orders.length === 0) {
                ordersTable.innerHTML = `<tr><td colspan="7" class="text-center">Sipariş bulunmuyor</td></tr>`;
                return;
            }
            
            // Siparişleri tarih sırasına göre sırala (en yeni en üstte)
            orders.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));
            
            // Kullanıcı bilgilerini al
            let users = [];
            try {
                if (AUTH.isAdmin()) {
                    users = await API.users.getAll();
                }
            } catch (error) {
                console.error('Kullanıcılar yüklenirken hata:', error);
            }
            
            // Masa bilgilerini al
            let tables = [];
            try {
                tables = await API.tables.getAll();
            } catch (error) {
                console.error('Masalar yüklenirken hata:', error);
            }
            
            // Her sipariş için satır oluştur
            orders.forEach(order => {
                const orderDate = new Date(order.orderTime);
                
                // Personel ismini bul
                let staffName = 'Atanmamış';
                if (order.staffId) {
                    const staff = users.find(u => u.id === order.staffId);
                    if (staff) {
                        staffName = staff.fullName;
                    }
                }
                
                // Masa numarasını bul
                let tableNumber = order.tableId;
                const table = tables.find(t => t.id === order.tableId);
                if (table) {
                    tableNumber = table.number;
                }
                
                // Durum sınıfını ve metnini belirle
                let statusClass, statusText;
                switch (order.status) {
                    case CONFIG.ORDER_STATUS.PENDING:
                        statusClass = 'bg-warning text-dark';
                        statusText = 'Beklemede';
                        break;
                    case CONFIG.ORDER_STATUS.PROCESSING:
                        statusClass = 'bg-primary text-white';
                        statusText = 'İşleniyor';
                        break;
                    case CONFIG.ORDER_STATUS.COMPLETED:
                        statusClass = 'bg-success text-white';
                        statusText = 'Tamamlandı';
                        break;
                    case CONFIG.ORDER_STATUS.CANCELLED:
                        statusClass = 'bg-danger text-white';
                        statusText = 'İptal Edildi';
                        break;
                    default:
                        statusClass = 'bg-secondary text-white';
                        statusText = order.status;
                }
                
                // Sipariş satırını oluştur
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>#${order.id}</td>
                    <td>Masa ${tableNumber}</td>
                    <td>${staffName}</td>
                    <td>₺${order.totalAmount.toFixed(2)}</td>
                    <td><span class="badge ${statusClass}"
<td><span class="badge ${statusClass}">${statusText}</span></td>
                    <td>${orderDate.toLocaleString()}</td>
                    <td>
                        <button class="btn btn-sm btn-primary view-order-btn" data-id="${order.id}">
                            <i class="bi bi-eye"></i>
                        </button>
                        
                        ${order.status === CONFIG.ORDER_STATUS.PENDING ? `
                            <button class="btn btn-sm btn-success take-order-btn" data-id="${order.id}">
                                <i class="bi bi-check-circle"></i>
                            </button>
                        ` : ''}
                        
                        ${order.status === CONFIG.ORDER_STATUS.PROCESSING && (order.staffId === AUTH.getCurrentUser().id || AUTH.isAdmin()) ? `
                            <button class="btn btn-sm btn-success complete-order-btn" data-id="${order.id}">
                                <i class="bi bi-cash-coin"></i>
                            </button>
                        ` : ''}
                        
                        ${(order.status === CONFIG.ORDER_STATUS.PENDING || order.status === CONFIG.ORDER_STATUS.PROCESSING) && AUTH.isAdmin() ? `
                            <button class="btn btn-sm btn-danger cancel-order-btn" data-id="${order.id}">
                                <i class="bi bi-x-circle"></i>
                            </button>
                        ` : ''}
                    </td>
                `;
                
                ordersTable.appendChild(row);
            });
            
            // Buton event listener'ları ekle
            document.querySelectorAll('.view-order-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const orderId = btn.getAttribute('data-id');
                    STAFF.loadOrderDetail(orderId);
                });
            });
            
            document.querySelectorAll('.take-order-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const orderId = btn.getAttribute('data-id');
                    try {
                        await API.orders.assignStaff(orderId, AUTH.getCurrentUser().id);
                        MAIN.showAlert('Sipariş başarıyla alındı', 'success');
                        STAFF.loadOrdersData(status);
                    } catch (error) {
                        MAIN.showAlert(error.message || 'Sipariş alınırken bir hata oluştu', 'danger');
                    }
                });
            });
            
            document.querySelectorAll('.complete-order-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const orderId = btn.getAttribute('data-id');
                    try {
                        await API.orders.complete(orderId);
                        MAIN.showAlert('Sipariş başarıyla tamamlandı', 'success');
                        STAFF.loadOrdersData(status);
                    } catch (error) {
                        MAIN.showAlert(error.message || 'Sipariş tamamlanırken bir hata oluştu', 'danger');
                    }
                });
            });
            
            document.querySelectorAll('.cancel-order-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (confirm('Bu siparişi iptal etmek istediğinize emin misiniz?')) {
                        const orderId = btn.getAttribute('data-id');
                        try {
                            await API.orders.cancel(orderId);
                            MAIN.showAlert('Sipariş başarıyla iptal edildi', 'success');
                            STAFF.loadOrdersData(status);
                        } catch (error) {
                            MAIN.showAlert(error.message || 'Sipariş iptal edilirken bir hata oluştu', 'danger');
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Siparişler yüklenirken hata:', error);
            MAIN.showAlert('Siparişler yüklenirken bir hata oluştu', 'danger');
        }
    },
    
    /**
     * Sipariş detay sayfasını yükler
     * @param {string} orderId - Sipariş ID
     */
    loadOrderDetail: async function(orderId) {
        try {
            const order = await API.orders.getById(orderId);
            
            // Personel bilgilerini al
            let staffName = 'Atanmamış';
            if (order.staffId) {
                try {
                    const staff = await API.users.getById(order.staffId);
                    staffName = staff.fullName;
                } catch (error) {
                    console.error('Personel bilgisi yüklenirken hata:', error);
                }
            }
            
            // Masa bilgisini al
            let tableNumber = order.tableId;
            try {
                const table = await API.tables.getById(order.tableId);
                tableNumber = table.number;
            } catch (error) {
                console.error('Masa bilgisi yüklenirken hata:', error);
            }
            
            // Durum metnini belirle
            let statusText;
            switch (order.status) {
                case CONFIG.ORDER_STATUS.PENDING:
                    statusText = 'Beklemede';
                    break;
                case CONFIG.ORDER_STATUS.PROCESSING:
                    statusText = 'İşleniyor';
                    break;
                case CONFIG.ORDER_STATUS.COMPLETED:
                    statusText = 'Tamamlandı';
                    break;
                case CONFIG.ORDER_STATUS.CANCELLED:
                    statusText = 'İptal Edildi';
                    break;
                default:
                    statusText = order.status;
            }
            
            // Sipariş öğelerini düzenle ve sırala
            const orderItems = order.orderItems || [];
            
            // Ana sayfayı güncelle
            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = `
                <div class="row">
                    <div class="col-md-12">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h2>Sipariş Detayı #${order.id}</h2>
                            <button class="btn btn-secondary" id="back-to-orders-btn">
                                <i class="bi bi-arrow-left"></i> Siparişlere Dön
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-8">
                        <div class="card mb-4">
                            <div class="card-header">
                                <h5 class="card-title">Sipariş Öğeleri</h5>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>Ürün</th>
                                                <th>Fiyat</th>
                                                <th>Adet</th>
                                                <th>Toplam</th>
                                            </tr>
                                        </thead>
                                        <tbody id="order-items-table">
                                            ${orderItems.length === 0 ? 
                                                '<tr><td colspan="4" class="text-center">Bu siparişte ürün bulunmuyor</td></tr>' : 
                                                orderItems.map(item => `
                                                    <tr>
                                                        <td>${item.menuItemName}</td>
                                                        <td>₺${item.price.toFixed(2)}</td>
                                                        <td>${item.quantity}</td>
                                                        <td>₺${(item.price * item.quantity).toFixed(2)}</td>
                                                    </tr>
                                                `).join('')
                                            }
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th colspan="3" class="text-end">Toplam:</th>
                                                <th>₺${order.totalAmount.toFixed(2)}</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="card mb-4">
                            <div class="card-header">
                                <h5 class="card-title">Sipariş Bilgileri</h5>
                            </div>
                            <div class="card-body">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item d-flex justify-content-between">
                                        <span>Masa:</span>
                                        <span>Masa ${tableNumber}</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between">
                                        <span>Durum:</span>
                                        <span>${statusText}</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between">
                                        <span>Sipariş Zamanı:</span>
                                        <span>${new Date(order.orderTime).toLocaleString()}</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between">
                                        <span>Personel:</span>
                                        <span>${staffName}</span>
                                    </li>
                                    ${order.paymentTime ? `
                                        <li class="list-group-item d-flex justify-content-between">
                                            <span>Ödeme Zamanı:</span>
                                            <span>${new Date(order.paymentTime).toLocaleString()}</span>
                                        </li>
                                    ` : ''}
                                    <li class="list-group-item d-flex justify-content-between">
                                        <span>Toplam Tutar:</span>
                                        <span><strong>₺${order.totalAmount.toFixed(2)}</strong></span>
                                    </li>
                                </ul>
                            </div>
                            <div class="card-footer">
                                <div class="d-grid gap-2">
                                    ${order.status === CONFIG.ORDER_STATUS.PENDING ? `
                                        <button class="btn btn-success" id="take-order-detail-btn">
                                            <i class="bi bi-check-circle"></i> Siparişi Al
                                        </button>
                                    ` : ''}
                                    
                                    ${order.status === CONFIG.ORDER_STATUS.