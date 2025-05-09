/**
 * API fonksiyonları
 * Backend ile iletişim için kullanılan fonksiyonlar
 */
const API = {
    /**
     * Bir API endpoint'ine istek yapar
     * @param {string} endpoint - API endpoint'i
     * @param {string} method - HTTP metodu (GET, POST, PUT, DELETE)
     * @param {object} data - İstek gövdesi (body)
     * @returns {Promise} - API yanıtı
     */
    request: async function(endpoint, method = 'GET', data = null) {
        const url = `${CONFIG.API_URL}${endpoint}`;
        
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // Token varsa header'a ekle
        const token = localStorage.getItem(CONFIG.TOKEN_KEY);
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const options = {
            method,
            headers
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(url, options);
            
            // Token süresi dolduysa kullanıcıyı çıkış yaptır
            if (response.status === 401) {
                AUTH.logout();
                return null;
            }
            
            // 204 No Content durumunda boş obje döndür
            if (response.status === 204) {
                return {};
            }
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Bir hata oluştu');
            }
            
            return result;
        } catch (error) {
            console.error('API İsteği Hatası:', error);
            throw error;
        }
    },
    
    // Auth Endpoints
    auth: {
        login: (username, password) => {
            return API.request('/auth/signin', 'POST', { username, password });
        },
        register: (userData) => {
            return API.request('/auth/signup', 'POST', userData);
        }
    },
    
    // Table Endpoints
    tables: {
        getAll: () => {
            return API.request('/tables');
        },
        getById: (id) => {
            return API.request(`/tables/${id}`);
        },
        getByStatus: (status) => {
            return API.request(`/tables/status?status=${status}`);
        },
        create: (tableData) => {
            return API.request('/tables', 'POST', tableData);
        },
        update: (id, tableData) => {
            return API.request(`/tables/${id}`, 'PUT', tableData);
        },
        updateStatus: (id, status) => {
            return API.request(`/tables/${id}/status?status=${status}`, 'PUT');
        },
        delete: (id) => {
            return API.request(`/tables/${id}`, 'DELETE');
        }
    },
    
    // Menu Endpoints
    menu: {
        getAll: () => {
            return API.request('/menu');
        },
        getById: (id) => {
            return API.request(`/menu/${id}`);
        },
        getByCategory: (category) => {
            return API.request(`/menu/category/${category}`);
        },
        getCategories: () => {
            return API.request('/menu/categories');
        },
        create: (menuItemData) => {
            return API.request('/menu', 'POST', menuItemData);
        },
        update: (id, menuItemData) => {
            return API.request(`/menu/${id}`, 'PUT', menuItemData);
        },
        delete: (id) => {
            return API.request(`/menu/${id}`, 'DELETE');
        }
    },
    
    // Order Endpoints
    orders: {
        getAll: () => {
            return API.request('/orders');
        },
        getById: (id) => {
            return API.request(`/orders/${id}`);
        },
        getByTableId: (tableId) => {
            return API.request(`/orders/table/${tableId}`);
        },
        getByStaffId: (staffId) => {
            return API.request(`/orders/staff/${staffId}`);
        },
        getByStatus: (status) => {
            return API.request(`/orders/status/${status}`);
        },
        getByDate: (date) => {
            return API.request(`/orders/date/${date}`);
        },
        create: (orderData) => {
            return API.request('/orders', 'POST', orderData);
        },
        update: (id, orderData) => {
            return API.request(`/orders/${id}`, 'PUT', orderData);
        },
        updateStatus: (id, status) => {
            return API.request(`/orders/${id}/status?status=${status}`, 'PUT');
        },
        assignStaff: (id, staffId) => {
            return API.request(`/orders/${id}/assign/${staffId}`, 'PUT');
        },
        complete: (id) => {
            return API.request(`/orders/${id}/complete`, 'PUT');
        },
        cancel: (id) => {
            return API.request(`/orders/${id}`, 'DELETE');
        }
    },
    
    // User Endpoints
    users: {
        getAll: () => {
            return API.request('/users');
        },
        getById: (id) => {
            return API.request(`/users/${id}`);
        },
        create: (userData) => {
            return API.request('/users', 'POST', userData);
        },
        update: (id, userData) => {
            return API.request(`/users/${id}`, 'PUT', userData);
        },
        delete: (id) => {
            return API.request(`/users/${id}`, 'DELETE');
        }
    },
    
    // Report Endpoints
    reports: {
        getDailyReport: (date) => {
            return API.request(`/reports/daily/${date}`);
        },
        getMenuItemSales: (startDate, endDate) => {
            return API.request(`/reports/menu-items?startDate=${startDate}&endDate=${endDate}`);
        }
    }
};