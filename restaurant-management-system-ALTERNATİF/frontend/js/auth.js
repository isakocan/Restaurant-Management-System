/**
 * Kimlik doğrulama işlemleri
 * Kullanıcı giriş/çıkış işlemleri ve yetkilendirme kontrolleri
 */
const AUTH = {
    /**
     * Kullanıcı giriş bilgilerini kontrol eder ve giriş yapar
     * @param {string} username - Kullanıcı adı
     * @param {string} password - Şifre
     * @returns {Promise<boolean>} - Giriş başarılı/başarısız
     */
    login: async function(username, password) {
        try {
            const response = await API.auth.login(username, password);
            
            if (response && response.token) {
                // Token'ı localStorage'a kaydet
                localStorage.setItem(CONFIG.TOKEN_KEY, response.token);
                
                // Kullanıcı bilgilerini localStorage'a kaydet
                const userData = {
                    id: response.id,
                    username: response.username,
                    fullName: response.fullName,
                    roles: response.roles
                };
                localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(userData));
                
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Giriş Hatası:', error);
            return false;
        }
    },
    
    /**
     * Kullanıcı çıkışı yapar
     */
    logout: function() {
        // Token ve kullanıcı bilgilerini localStorage'dan sil
        localStorage.removeItem(CONFIG.TOKEN_KEY);
        localStorage.removeItem(CONFIG.USER_KEY);
        
        // Ana sayfaya yönlendir
        window.location.href = '/';
    },
    
    /**
     * Kullanıcının giriş yapmış olup olmadığını kontrol eder
     * @returns {boolean} - Kullanıcı giriş yapmış/yapmamış
     */
    isLoggedIn: function() {
        return localStorage.getItem(CONFIG.TOKEN_KEY) !== null;
    },
    
    /**
     * Giriş yapmış kullanıcının bilgilerini döndürür
     * @returns {object|null} - Kullanıcı bilgileri veya null
     */
    getCurrentUser: function() {
        const userData = localStorage.getItem(CONFIG.USER_KEY);
        return userData ? JSON.parse(userData) : null;
    },
    
    /**
     * Kullanıcının belirli bir rolü olup olmadığını kontrol eder
     * @param {string} role - Kontrol edilecek rol
     * @returns {boolean} - Kullanıcı bu role sahip/değil
     */
    hasRole: function(role) {
        const user = this.getCurrentUser();
        return user && user.roles && user.roles.includes(role);
    },
    
    /**
     * Kullanıcının admin olup olmadığını kontrol eder
     * @returns {boolean} - Kullanıcı admin/değil
     */
    isAdmin: function() {
        return this.hasRole(CONFIG.ROLES.ADMIN);
    },
    
    /**
     * Kullanıcının personel olup olmadığını kontrol eder
     * @returns {boolean} - Kullanıcı personel/değil
     */
    isStaff: function() {
        return this.hasRole(CONFIG.ROLES.STAFF);
    },
    
    /**
     * Formdan kullanıcı giriş işlemini başlatır
     * @param {Event} event - Form submit olayı
     */
    handleLogin: async function(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorElement = document.getElementById('login-error');
        
        errorElement.textContent = '';
        
        try {
            const success = await AUTH.login(username, password);
            
            if (success) {
                // Modal'ı kapat
                const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                loginModal.hide();
                
                // Sayfayı yenile
                location.reload();
            } else {
                errorElement.textContent = 'Kullanıcı adı veya şifre hatalı';
            }
        } catch (error) {
            errorElement.textContent = error.message || 'Giriş yapılırken bir hata oluştu';
        }
    },
    
    /**
     * Navbar'ı kullanıcı giriş durumuna göre günceller
     */
    updateNavbar: function() {
        const mainMenu = document.getElementById('main-menu');
        const userInfo = document.getElementById('user-info');
        const loginMenu = document.getElementById('login-menu');
        const logoutMenu = document.getElementById('logout-menu');
        
        mainMenu.innerHTML = '';
        userInfo.innerHTML = '';
        
        if (this.isLoggedIn()) {
            const user = this.getCurrentUser();
            
            // Kullanıcı bilgilerini göster
            userInfo.innerHTML = `
                <i class="bi bi-person-circle"></i> ${user.fullName}
            `;
            
            // Giriş menüsünü gizle, çıkış menüsünü göster
            loginMenu.classList.add('d-none');
            logoutMenu.classList.remove('d-none');
            
            // Rol bazlı menü öğelerini ekle
            if (this.isAdmin()) {
                // Admin menü öğeleri
                mainMenu.innerHTML += `
                    <li class="nav-item"><a class="nav-link" href="#" id="nav-dashboard">Dashboard</a></li>
                    <li class="nav-item"><a class="nav-link" href="#" id="nav-tables">Masalar</a></li>
                    <li class="nav-item"><a class="nav-link" href="#" id="nav-menu">Menü</a></li>
                    <li class="nav-item"><a class="nav-link" href="#" id="nav-orders">Siparişler</a></li>
                    <li class="nav-item"><a class="nav-link" href="#" id="nav-users">Kullanıcılar</a></li>
                    <li class="nav-item"><a class="nav-link" href="#" id="nav-reports">Raporlar</a></li>
                `;
            } else if (this.isStaff()) {
                // Personel menü öğeleri
                mainMenu.innerHTML += `
                    <li class="nav-item"><a class="nav-link" href="#" id="nav-tables">Masalar</a></li>
                    <li class="nav-item"><a class="nav-link" href="#" id="nav-orders">Siparişler</a></li>
                `;
            }
        } else {
            // Giriş menüsünü göster, çıkış menüsünü gizle
            loginMenu.classList.remove('d-none');
            logoutMenu.classList.add('d-none');
            
            // Menü
            mainMenu.innerHTML += `
                <li class="nav-item"><a class="nav-link" href="#" id="nav-home">Ana Sayfa</a></li>
                <li class="nav-item"><a class="nav-link" href="#" id="nav-menu">Menü</a></li>
            `;
        }
    },
    
    /**
     * Çıkış butonuna event listener ekler
     */
    setupLogoutButton: function() {
        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
    },
    
    /**
     * Giriş formuna event listener ekler
     */
    setupLoginForm: function() {
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', this.handleLogin);
    },
    
    /**
     * Auth modülünü başlatır
     */
    init: function() {
        this.updateNavbar();
        this.setupLogoutButton();
        this.setupLoginForm();
    }
};