/**
 * Müşteri fonksiyonları
 * Masa görüntüleme ve sipariş verme işlevleri
 */
const CUSTOMER = {
    /**
     * Ana sayfa - Masa listesini yükler
     */
    loadHomePage: async function() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="row">
                <div class="col-md-12">
                    <h2 class="mb-4">Masalar</h2>
                </div>
            </div>
            
            <div class="row" id="tables-container">
                <div class="col-12 text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Yükleniyor...</span>
                    </div>
                </div>
            </div>
        `;
        
        try {
            // Masaları yükle
            const tables = await API.tables.getAll();
            
            const tablesContainer = document.getElementById('tables-container');
            tablesContainer.innerHTML = '';
            
            if (tables.length === 0) {
                tablesContainer.innerHTML = '<div class="col-12"><div class="alert alert-info">Henüz masa bulunmuyor</div></div>';
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
                    actionBtn.textContent = 'Otur';
                    actionBtn.addEventListener('click', () => {
                        // Yeni sipariş sayfasına yönlendir
                        CUSTOMER.loadNewOrder(table.id);
                    });
                } else {
                    actionBtn.textContent = 'Dolu';
                    actionBtn.disabled = true;
                }
                
                tablesContainer.appendChild(tableCard);
            });
        } catch (error) {
            console.error('Masalar yüklenirken hata:', error);
            mainContent.innerHTML = '<div class="alert alert-danger">Masalar yüklenirken bir hata oluştu</div>';
        }
    },
    
    /**
     * Menü sayfasını yükler
     */
    loadMenu: async function() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="row">
                <div class="col-md-12">
                    <h2 class="mb-4">Menü</h2>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-12" id="categories-container">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Kategoriler yükleniyor...</span>
                    </div>
                </div>
            </div>
            
            <div class="row" id="menu-items-container">
                <div class="col-12 text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Menü yükleniyor...</span>
                    </div>
                </div>
            </div>
        `;
        
        try {
            // Kategorileri yükle
            const categories = await API.menu.getCategories();
            
            const categoriesContainer = document.getElementById('categories-container');
            categoriesContainer.innerHTML = '';
            
            if (categories.length === 0) {
                categoriesContainer.innerHTML = '<div class="alert alert-info">Henüz kategori bulunmuyor</div>';
                return;
            }
            
            // Her kategori için rozet oluştur
            categories.forEach((category, index) => {
                const badge = document.createElement('span');
                badge.className = `badge category-badge p-2 ${index === 0 ? 'active bg-primary' : 'bg-secondary'}`;
                badge.textContent = category;
                badge.dataset.category = category;
                badge.addEventListener('click', () => {
                    // Aktif kategoriyi güncelle
                    document.querySelectorAll('.category-badge').forEach(b => {
                        b.classList.remove('active', 'bg-primary');
                        b.classList.add('bg-secondary');
                    });
                    badge.classList.add('active', 'bg-primary');
                    badge.classList.remove('bg-secondary');
                    
                    // Seçilen kategorideki menü öğelerini yükle
                    this.loadMenuItemsByCategory(category);
                });
                
                categoriesContainer.appendChild(badge);
                categoriesContainer.appendChild(document.createTextNode(' '));
            });
            
            // İlk kategorideki menü öğelerini yükle
            if (categories.length > 0) {
                this.loadMenuItemsByCategory(categories[0]);
            }
        } catch (error) {
            console.error('Kategoriler yüklenirken hata:', error);
            document.getElementById('categories-container').innerHTML = '<div class="alert alert-danger">Kategoriler yüklenirken bir hata oluştu</div>';
        }
    },
    
    /**
     * Kategoriye göre menü öğelerini yükler
     * @param {string} category - Kategori adı
     */
    loadMenuItemsByCategory: async function(category) {
        try {
            const menuItemsContainer = document.getElementById('menu-items-container');
            menuItemsContainer.innerHTML = `
                <div class="col-12 text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Menü öğeleri yükleniyor...</span>
                    </div>
                </div>
            `;
            
            const menuItems = await API.menu.getByCategory(category);
            
            menuItemsContainer.innerHTML = '';
            
            if (menuItems.length === 0) {
                menuItemsContainer.innerHTML = `<div class="col-12"><div class="alert alert-info">Bu kategoride ürün bulunmuyor</div></div>`;
                return;
            }
            
            // Her menü öğesi için kart oluştur
            menuItems.forEach(item => {
                const menuItemCard = document.createElement('div');
                menuItemCard.className = 'col-md-4 col-lg-3 mb-4';
                menuItemCard.innerHTML = `
                    <div class="card menu-item-card h-100">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text text-muted">${item.description || ''}</p>
                            <div class="mt-auto">
                                <p class="card-text fw-bold">₺${item.price.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                `;
                
                menuItemsContainer.appendChild(menuItemCard);
            });
        } catch (error) {
            console.error('Menü öğeleri yüklenirken hata:', error);
            document.getElementById('menu-items-container').innerHTML = '<div class="alert alert-danger">Menü öğeleri yüklenirken bir hata oluştu</div>';
        }
    },
    
    /**
     * Yeni sipariş sayfasını yükler
     * @param {number} tableId - Masa ID
     */
    loadNewOrder: async function(tableId) {
        try {
            // Masa bilgilerini al
            const table = await API.tables.getById(tableId);
            
            if (table.status !== CONFIG.TABLE_STATUS.AVAILABLE) {
                MAIN.showAlert('Bu masa şu anda dolu', 'warning');
                return;
            }
            
            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = `
                <div class="row">
                    <div class="col-md-12">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h2>Masa ${table.number} - Yeni Sipariş</h2>
                            <button class="btn btn-secondary" id="back-to-tables-btn">
                                <i class="bi bi-arrow-left"></i> Masalara Dön
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-8">
                        <div class="card mb-4">
                            <div class="card-header">
                                <h5 class="card-title">Menü</h5>
                            </div>
                            <div class="card-body">
                                <div class="mb-3" id="categories-container">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Kategoriler yükleniyor...</span>
                                    </div>
                                </div>
                                
                                <div id="menu-items-container">
                                    <div class="text-center">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="visually-hidden">Menü yükleniyor...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="card order-summary">
                            <div class="card-header">
                                <h5 class="card-title">Sipariş Özeti</h5>
                            </div>
                            <div class="card-body">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Ürün</th>
                                            <th>Adet</th>
                                            <th>Fiyat</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody id="order-items-table">
                                        <tr>
                                            <td colspan="4" class="text-center">Sepetiniz boş</td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th colspan="2">Toplam:</th>
                                            <th id="order-total">₺0.00</th>
                                            <th></th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div class="card-footer">
                                <div class="d-grid gap-2">
                                    <button class="btn btn-danger" id="clear-order-btn">Temizle</button>
                                    <button class="btn btn-success" id="confirm-order-btn">Siparişi Onayla</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Sipariş öğeleri listesi
            this.orderItems = [];
            
            // Kategorileri yükle
            await this.loadOrderCategories();
            
            // Event listener'ları ekle
            document.getElementById('back-to-tables-btn').addEventListener('click', () => {
                // Onaylamadan çıkma kontrolü
                if (this.orderItems.length > 0) {
                    if (!confirm('Siparişinizi tamamlamadan çıkmak istediğinize emin misiniz? Sepetinizdeki ürünler kaybolacak.')) {
                        return;
                    }
                }
                this.loadHomePage();
            });
            
            document.getElementById('clear-order-btn').addEventListener('click', () => {
                if (this.orderItems.length === 0) {
                    return;
                }
                
                if (confirm('Sepetinizdeki tüm ürünleri silmek istediğinize emin misiniz?')) {
                    this.orderItems = [];
                    this.updateOrderSummary();
                }
            });
            
            document.getElementById('confirm-order-btn').addEventListener('click', () => {
                this.confirmOrder(tableId);
            });
        } catch (error) {
            console.error('Sipariş sayfası yüklenirken hata:', error);
            MAIN.showAlert('Sipariş sayfası yüklenirken bir hata oluştu', 'danger');
        }
    },
    
    /**
     * Sipariş sayfası için kategorileri yükler
     */
    loadOrderCategories: async function() {
        try {
            const categories = await API.menu.getCategories();
            
            const categoriesContainer = document.getElementById('categories-container');
            categoriesContainer.innerHTML = '';
            
            if (categories.length === 0) {
                categoriesContainer.innerHTML = '<div class="alert alert-info">Henüz kategori bulunmuyor</div>';
                return;
            }
            
            // Her kategori için rozet oluştur
            categories.forEach((category, index) => {
                const badge = document.createElement('span');
                badge.className = `badge category-badge p-2 ${index === 0 ? 'active bg-primary' : 'bg-secondary'}`;
                badge.textContent = category;
                badge.dataset.category = category;
                badge.addEventListener('click', () => {
                    // Aktif kategoriyi güncelle
                    document.querySelectorAll('.category-badge').forEach(b => {
                        b.classList.remove('active', 'bg-primary');
                        b.classList.add('bg-secondary');
                    });
                    badge.classList.add('active', 'bg-primary');
                    badge.classList.remove('bg-secondary');
                    
                    // Seçilen kategorideki menü öğelerini yükle
                    this.loadOrderMenuItems(category);
                });
                
                categoriesContainer.appendChild(badge);
                categoriesContainer.appendChild(document.createTextNode(' '));
            });
            
            // İlk kategorideki menü öğelerini yükle
            if (categories.length > 0) {
                this.loadOrderMenuItems(categories[0]);
            }
        } catch (error) {
            console.error('Kategoriler yüklenirken hata:', error);
            document.getElementById('categories-container').innerHTML = '<div class="alert alert-danger">Kategoriler yüklenirken bir hata oluştu</div>';
        }
    },
    
    /**
     * Sipariş sayfası için menü öğelerini yükler
     * @param {string} category - Kategori adı
     */
    loadOrderMenuItems: async function(category) {
        try {
            const menuItemsContainer = document.getElementById('menu-items-container');
            menuItemsContainer.innerHTML = `
                <div class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Menü öğeleri yükleniyor...</span>
                    </div>
                </div>
            `;
            
            const menuItems = await API.menu.getByCategory(category);
            
            menuItemsContainer.innerHTML = '';
            
            if (menuItems.length === 0) {
                menuItemsContainer.innerHTML = `<div class="alert alert-info">Bu kategoride ürün bulunmuyor</div>`;
                return;
            }
            
            const row = document.createElement('div');
            row.className = 'row';
            
            // Her menü öğesi için kart oluştur
            menuItems.forEach(item => {
                const col = document.createElement('div');
                col.className = 'col-md-6 col-lg-4 mb-3';
                
                // Siparişteki miktarı kontrol et
                const orderItem = this.orderItems.find(oi => oi.menuItemId === item.id);
                const quantity = orderItem ? orderItem.quantity : 0;
                
                col.innerHTML = `
                    <div class="card menu-item-card h-100">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text text-muted small">${item.description || ''}</p>
                            <div class="mt-auto d-flex justify-content-between align-items-center">
                                <p class="card-text fw-bold mb-0">₺${item.price.toFixed(2)}</p>
                                <div class="quantity-control ${quantity > 0 ? '' : 'd-none'}" data-id="${item.id}">
                                    <button class="btn btn-sm btn-outline-secondary decrease-btn">-</button>
                                    <span class="mx-2 quantity">${quantity}</span>
                                    <button class="btn btn-sm btn-outline-secondary increase-btn">+</button>
                                </div>
                                <button class="btn btn-sm btn-primary add-to-order-btn ${quantity > 0 ? 'd-none' : ''}" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">
                                    <i class="bi bi-plus"></i> Ekle
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                
                row.appendChild(col);
            });
            
            menuItemsContainer.appendChild(row);
            
            // Add to order butonlarına event listener ekle
            document.querySelectorAll('.add-to-order-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = parseInt(btn.dataset.id);
                    const name = btn.dataset.name;
                    const price = parseFloat(btn.dataset.price);
                    
                    this.addItemToOrder(id, name, price);
                    
                    // Butonları güncelle
                    btn.classList.add('d-none');
                    btn.parentElement.querySelector('.quantity-control').classList.remove('d-none');
                    btn.parentElement.querySelector('.quantity').textContent = '1';
                });
            });
            
            // Quantity control butonlarına event listener ekle
            document.querySelectorAll('.quantity-control').forEach(control => {
                const itemId = parseInt(control.dataset.id);
                const quantityElement = control.querySelector('.quantity');
                const decreaseBtn = control.querySelector('.decrease-btn');
                const increaseBtn = control.querySelector('.increase-btn');
                const addButton = control.parentElement.querySelector('.add-to-order-btn');
                
                decreaseBtn.addEventListener('click', () => {
                    const orderItemIndex = this.orderItems.findIndex(item => item.menuItemId === itemId);
                    
                    if (orderItemIndex !== -1) {
                        const currentQuantity = this.orderItems[orderItemIndex].quantity;
                        
                        if (currentQuantity > 1) {
                            // Miktarı azalt
                            this.orderItems[orderItemIndex].quantity--;
                            quantityElement.textContent = this.orderItems[orderItemIndex].quantity;
                        } else {
                            // Öğeyi sepetten kaldır
                            this.orderItems.splice(orderItemIndex, 1);
                            quantityElement.textContent = '0';
                            
                            // Butonları güncelle
                            control.classList.add('d-none');
                            addButton.classList.remove('d-none');
                        }
                        
                        this.updateOrderSummary();
                    }
                });
                
                increaseBtn.addEventListener('click', () => {
                    const orderItem = this.orderItems.find(item => item.menuItemId === itemId);
                    
                    if (orderItem) {
                        // Miktarı artır
                        orderItem.quantity++;
                        quantityElement.textContent = orderItem.quantity;
                        this.updateOrderSummary();
                    }
                });
            });
        } catch (error) {
            console.error('Menü öğeleri yüklenirken hata:', error);
            document.getElementById('menu-items-container').innerHTML = '<div class="alert alert-danger">Menü öğeleri yüklenirken bir hata oluştu</div>';
        }
    },
    
    /**
     * Siparişe ürün ekler
     * @param {number} id - Menü öğesi ID
     * @param {string} name - Menü öğesi adı
     * @param {number} price - Menü öğesi fiyatı
     */
    addItemToOrder: function(id, name, price) {
        // Siparişte bu ürün var mı kontrol et
        const existingItemIndex = this.orderItems.findIndex(item => item.menuItemId === id);
        
        if (existingItemIndex !== -1) {
            // Varsa miktarı artır
            this.orderItems[existingItemIndex].quantity++;
        } else {
            // Yoksa yeni ekle
            this.orderItems.push({
                menuItemId: id,
                menuItemName: name,
                price: price,
                quantity: 1
            });
        }
        
        // Sipariş özetini güncelle
        this.updateOrderSummary();
    },
    
    /**
     * Sipariş özetini günceller
     */
    updateOrderSummary: function() {
        const orderItemsTable = document.getElementById('order-items-table');
        const orderTotal = document.getElementById('order-total');
        
        // Toplam tutarı hesapla
        const total = this.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Toplam tutarı göster
        orderTotal.textContent = `₺${total.toFixed(2)}`;
        
        // Öğeleri listele
        if (this.orderItems.length === 0) {
            orderItemsTable.innerHTML = '<tr><td colspan="4" class="text-center">Sepetiniz boş</td></tr>';
            return;
        }
        
        orderItemsTable.innerHTML = '';
        
        this.orderItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.menuItemName}</td>
                <td>${item.quantity}</td>
                <td>₺${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-danger remove-item-btn" data-id="${item.menuItemId}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            
            orderItemsTable.appendChild(row);
        });
        
        // Remove butonlarına event listener ekle
        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = parseInt(btn.dataset.id);
                
                // Öğeyi sepetten kaldır
                this.orderItems = this.orderItems.filter(item => item.menuItemId !== itemId);
                
                // Menüdeki quantity kontrollerini güncelle
                const quantityControl = document.querySelector(`.quantity-control[data-id="${itemId}"]`);
                if (quantityControl) {
                    quantityControl.classList.add('d-none');
                    quantityControl.querySelector('.quantity').textContent = '0';
                    quantityControl.parentElement.querySelector('.add-to-order-btn').classList.remove('d-none');
                }
                
                // Sipariş özetini güncelle
                this.updateOrderSummary();
            });
        });
    },
    
    /**
     * Siparişi onaylar
     * @param {number} tableId - Masa ID
     */
    confirmOrder: async function(tableId) {
        if (this.orderItems.length === 0) {
            MAIN.showAlert('Sipariş vermek için sepete ürün ekleyin', 'warning');
            return;
        }
        
        try {
            // Sipariş nesnesi oluştur
            const order = {
                tableId: tableId,
                orderItems: this.orderItems.map(item => ({
                    menuItemId: item.menuItemId,
                    quantity: item.quantity
                }))
            };
            
            // Siparişi gönder
            await API.orders.create(order);
            
            // Başarı mesajı göster
            MAIN.showAlert('Siparişiniz başarıyla alındı', 'success');
            
            // Ana sayfaya yönlendir
            setTimeout(() => {
                this.loadHomePage();
            }, 1500);
        } catch (error) {
            console.error('Sipariş onaylanırken hata:', error);
            MAIN.showAlert(error.message || 'Sipariş onaylanırken bir hata oluştu', 'danger');
        }
    },
    
    /**
     * Müşteri modülünü başlatır
     */
    init: function() {
        // Sipariş öğeleri listesi
        this.orderItems = [];
    }
};