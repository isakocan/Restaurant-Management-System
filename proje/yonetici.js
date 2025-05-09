document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elementleri ---
    const yoneticiGirisFormu = document.getElementById('yonetici-giris-formu');
    const yoneticiKullaniciAdiInput = document.getElementById('yonetici-kullanici-adi');
    const yoneticiSifreInput = document.getElementById('yonetici-sifre');
    const yoneticiGirisYapBtn = document.getElementById('yonetici-giris-yap-btn');
    const yoneticiGirisHataMesaji = document.getElementById('yonetici-giris-hata-mesaji');

    const yonetimIcerik = document.getElementById('yonetim-icerik');
    const yoneticiBilgiDiv = document.getElementById('yonetici-bilgi');
    const yoneticiAdiSpan = document.getElementById('yonetici-adi');
    const yoneticiCikisYapBtn = document.getElementById('yonetici-cikis-yap-btn');

    // Profil Güncelleme
    const yoneticiProfilGuncellemeSection = document.getElementById('yonetici-profil-guncelleme');
    const guncelSifreInput = document.getElementById('guncel-sifre');
    const guncelYeniKullaniciAdiInput = document.getElementById('guncel-yeni-kullanici-adi');
    const guncelYeniSifreInput = document.getElementById('guncel-yeni-sifre');
    const profilGuncelleBtn = document.getElementById('profil-guncelle-btn');
    const profilGuncelleMesajP = document.getElementById('profil-guncelle-mesaj');

    // Kullanıcı (Garson) Yönetimi
    const kullaniciYonetimiSection = document.getElementById('kullanici-yonetimi'); // Section referansı
    const kullaniciEditIdInput = document.getElementById('kullanici-edit-id');
    const yeniKullaniciAdiInput = document.getElementById('yeni-kullanici-adi');
    const yeniSifreInput = document.getElementById('yeni-sifre');
    // const yeniKullaniciRolSelect = document.getElementById('yeni-kullanici-rol'); // KALDIRILDI
    const kullaniciKaydetBtn = document.getElementById('kullanici-kaydet-btn');
    const kullaniciFormTemizleBtn = document.getElementById('kullanici-form-temizle-btn');
    const kullaniciListesiUl = document.getElementById('kullanici-listesi');

    // Menü Yönetimi
    const menuYonetimiSection = document.getElementById('menu-yonetimi'); // Section referansı
    const urunEditIdInput = document.getElementById('urun-edit-id');
    const urunAdiInput = document.getElementById('urun-adi');
    const urunKategoriInput = document.getElementById('urun-kategori');
    const urunFiyatInput = document.getElementById('urun-fiyat');
    const urunAciklamaTextarea = document.getElementById('urun-aciklama');
    const urunFotoInput = document.getElementById('urun-foto');
    const urunKaydetBtn = document.getElementById('urun-kaydet-btn');
    const urunFormTemizleBtn = document.getElementById('urun-form-temizle-btn');
    const menuListesiYoneticiDiv = document.getElementById('menu-listesi-yonetici');

    // Raporlama
    const satisRaporlamaSection = document.getElementById('satis-raporlama'); // Section referansı
    const raporTarihInput = document.getElementById('rapor-tarih');
    const raporGosterBtn = document.getElementById('rapor-goster-btn');
    const tumRaporGosterBtn = document.getElementById('tum-rapor-goster-btn');
    const raporSonucDiv = document.getElementById('rapor-sonuc');
    const raporTarihBaslikSpan = document.getElementById('rapor-tarih-baslik');
    const raporSiparisListesiUl = document.getElementById('rapor-siparis-listesi');
    const raporToplamCiroSpan = document.getElementById('rapor-toplam-ciro');
    const raporUrunAdetleriUl = document.getElementById('rapor-urun-adetleri');

    // --- Uygulama Durumu ---
    let aktifYoneticiAuth = null;

    // --- Giriş / Çıkış Fonksiyonları ---

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            aktifYoneticiAuth = user;
    
            // Firestore'dan kullanıcı verilerini (rol dahil) çek
            const yoneticiData = await getKullaniciData(user.uid); // YENİ ÇAĞRI (ortak.js'deki aynı fonksiyonu kullanır)
    
            if (yoneticiData && yoneticiData.role === 'Yonetici') {
                // Kullanıcı Firestore'da bulundu VE rolü "Yonetici" ise
                // aktifYoneticiFirestoreData = yoneticiData;
                if (yoneticiAdiSpan) {
                    yoneticiAdiSpan.textContent = ilkHarfiBuyut(yoneticiData.username || user.email.split('@')[0]);
                }
    
                yoneticiGirisBasariliArayuzunuGoster();
    
                // Yönetici paneli için gerekli verileri yükle
                if(guncelYeniKullaniciAdiInput && aktifYoneticiAuth) { // aktifYoneticiAuth yerine yoneticiData kullanılabilir
                     guncelYeniKullaniciAdiInput.value = ilkHarfiBuyut(yoneticiData.username || user.email.split('@')[0]);
                }
                // ... (diğer yüklemeler aynı kalır, hala localStorage kullanıyorlar)
                kullanicilariYukle();
                menuyuYukleYonetici();
                if (raporTarihInput) raporTarihInput.valueAsDate = new Date();
                raporGoster();
    
            } else {
                // Kullanıcı Firestore'da bulunamadı VEYA rolü "Yonetici" değilse
                console.log("Giriş reddedildi. Kullanıcı Firestore'da bulunamadı veya rolü Yonetici değil:", user.email);
                yoneticiGosterHata("Bu hesapla yönetici olarak giriş yapma yetkiniz yok veya hesap bilgileriniz eksik.");
                await yoneticiCikisYapFirebase(); // Otomatik olarak çıkış yaptır
            }
    
        } else {
        aktifYoneticiAuth = null;
        // aktifYoneticiFirestoreData = null;
        yoneticiCikisYapildiArayuzunuGoster();
    }

    // Butonların durumu
    if (yoneticiGirisYapBtn) yoneticiGirisYapBtn.disabled = !!(user && yoneticiData && yoneticiData.role === 'Yonetici');
    if (yoneticiCikisYapBtn) yoneticiCikisYapBtn.disabled = !(user && yoneticiData && yoneticiData.role === 'Yonetici');
});

    function ilkHarfiBuyut(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }


    async function yoneticiGirisYapFirebase() {
        if (!yoneticiKullaniciAdiInput || !yoneticiSifreInput || !yoneticiGirisHataMesaji) return;
    
        const email = yoneticiKullaniciAdiInput.value.trim();
        const password = yoneticiSifreInput.value;
        yoneticiGirisHataMesaji.style.display = 'none';
    
        if (!email || !password) {
            yoneticiGosterHata("E-posta ve şifre boş bırakılamaz.");
            return;
        }
    
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            console.log("Firebase'den yönetici girişi başarılı:", userCredential.user);
            yoneticiKullaniciAdiInput.value = '';
            yoneticiSifreInput.value = '';
            // `auth.onAuthStateChanged` arayüzü güncelleyecek.
        } catch (error) {
            console.error("Firebase yönetici giriş hatası:", error);
            if (error.code === 'auth/user-not-found' ||
                error.code === 'auth/wrong-password' ||
                error.code === 'auth/invalid-credential' ||
                error.code === 'auth/invalid-login-credentials') {
                yoneticiGosterHata("E-posta veya şifre hatalı. Lütfen kontrol edip tekrar deneyin.");
            } else if (error.code === 'auth/invalid-email') {
                yoneticiGosterHata("Lütfen geçerli bir e-posta adresi girin.");
            } else if (error.code === 'auth/too-many-requests') {
                yoneticiGosterHata("Çok fazla hatalı giriş denemesi yapıldı. Lütfen daha sonra tekrar deneyin.");
            } else {
                yoneticiGosterHata("Giriş sırasında bir sorun oluştu. Lütfen tekrar deneyin.");
            }
        }
    }

    function yoneticiGirisBasariliArayuzunuGoster() {
        if (yoneticiGirisFormu) yoneticiGirisFormu.style.display = 'none';
        if (yonetimIcerik) yonetimIcerik.style.display = 'block';
        if (yoneticiBilgiDiv) yoneticiBilgiDiv.style.display = 'flex';
    
        // Profil güncelleme formu için kullanıcı adını ve şifre alanlarını hazırla
        if (guncelYeniKullaniciAdiInput && aktifYoneticiAuth) { // aktifYoneticiAuth null değilse
            guncelYeniKullaniciAdiInput.value = ilkHarfiBuyut(aktifYoneticiAuth.email.split('@')[0]);
        }
        if (guncelSifreInput) guncelSifreInput.value = '';
        if (guncelYeniSifreInput) guncelYeniSifreInput.value = '';
        if (profilGuncelleMesajP) {
            profilGuncelleMesajP.textContent = '';
            profilGuncelleMesajP.style.color = 'green'; // veya varsayılan rengi
        }
    }
    
    function yoneticiCikisYapildiArayuzunuGoster() {
        if (yonetimIcerik) yonetimIcerik.style.display = 'none';
        if (yoneticiBilgiDiv) yoneticiBilgiDiv.style.display = 'none';
        if (yoneticiGirisFormu) yoneticiGirisFormu.style.display = 'block';
    
        if (yoneticiKullaniciAdiInput) yoneticiKullaniciAdiInput.value = '';
        if (yoneticiSifreInput) yoneticiSifreInput.value = '';
        if (yoneticiGirisHataMesaji) yoneticiGirisHataMesaji.style.display = 'none';
    
        // Yönetici panelindeki listeleri/alanları temizle veya "giriş yapınız" mesajı göster
        if (kullaniciListesiUl) kullaniciListesiUl.innerHTML = '<li>Garsonları görmek için giriş yapınız.</li>';
        if (menuListesiYoneticiDiv) menuListesiYoneticiDiv.innerHTML = '<p>Menüyü görmek için giriş yapınız.</p>';
        if (raporSonucDiv) { // raporSonucDiv bir container, içini temizlemek daha iyi olabilir
            raporSonucDiv.innerHTML = '<h3>Raporları görmek için giriş yapınız.</h3>';
            // veya spesifik rapor listelerini/özetlerini temizle:
            // if(raporSiparisListesiUl) raporSiparisListesiUl.innerHTML = '';
            // if(raporToplamCiroSpan) raporToplamCiroSpan.textContent = '0.00';
            // if(raporUrunAdetleriUl) raporUrunAdetleriUl.innerHTML = '';
        }
    }

    function yoneticiGosterHata(mesaj) {
        if(yoneticiGirisHataMesaji) {
            yoneticiGirisHataMesaji.textContent = mesaj;
            yoneticiGirisHataMesaji.style.display = 'block';
        }
    }

    async function yoneticiCikisYapFirebase() {
        try {
            await auth.signOut();
            console.log("Firebase'den yönetici çıkışı yapıldı.");
            // `auth.onAuthStateChanged` arayüzü güncelleyecek.
        } catch (error) {
            console.error("Firebase yönetici çıkış hatası:", error);
            alert("Çıkış yapılırken bir hata oluştu.");
        }
    }

    // --- Profil Güncelleme Fonksiyonu ---
    function profilGuncelle() {
        if (!aktifYoneticiAuth) {
            alert("Bu işlemi yapmak için giriş yapmalısınız.");
            return;
        }
        if (!profilGuncelleMesajP || !guncelSifreInput || !guncelYeniKullaniciAdiInput || !aktifYonetici) return;
        profilGuncelleMesajP.textContent = '';
        profilGuncelleMesajP.style.color = 'red';

        const mevcutSifre = guncelSifreInput.value;
        const yeniKullaniciAdi = guncelYeniKullaniciAdiInput.value.trim();
        const yeniSifre = guncelYeniSifreInput.value;

        if (!mevcutSifre || !yeniKullaniciAdi) {
            profilGuncelleMesajP.textContent = "Mevcut şifre ve yeni kullanıcı adı boş bırakılamaz.";
            return;
        }

        if (mevcutSifre !== aktifYonetici.password) {
            profilGuncelleMesajP.textContent = "Mevcut şifreniz yanlış!";
            return;
        }

        let kullanicilar = veriOku('kullanicilar');
        const adminIndex = kullanicilar.findIndex(k => k.id === aktifYonetici.id);

        if (adminIndex === -1) {
             profilGuncelleMesajP.textContent = "Beklenmedik hata: Yönetici bulunamadı.";
             return;
        }

        const isUsernameTaken = kullanicilar.some(k => k.username === yeniKullaniciAdi && k.id !== aktifYonetici.id);
        if (isUsernameTaken) {
             profilGuncelleMesajP.textContent = `"${yeniKullaniciAdi}" kullanıcı adı başka bir kullanıcı tarafından kullanılıyor!`;
             return;
        }

        kullanicilar[adminIndex].username = yeniKullaniciAdi;
        aktifYonetici.username = yeniKullaniciAdi;

        if (yeniSifre) {
            kullanicilar[adminIndex].password = yeniSifre;
            aktifYonetici.password = yeniSifre;
        }

        veriYaz('kullanicilar', kullanicilar);
        if(yoneticiAdiSpan) yoneticiAdiSpan.textContent = aktifYonetici.username;
        profilGuncelleMesajP.textContent = "Profil bilgileriniz başarıyla güncellendi.";
        profilGuncelleMesajP.style.color = 'green';

        guncelSifreInput.value = '';
        if(guncelYeniSifreInput) guncelYeniSifreInput.value = '';
    }

    // --- Kullanıcı (Garson) Yönetimi Fonksiyonları ---
    function kullaniciFormunuTemizle() {
        if(kullaniciEditIdInput) kullaniciEditIdInput.value = '';
        if(yeniKullaniciAdiInput) yeniKullaniciAdiInput.value = '';
        if(yeniSifreInput) yeniSifreInput.value = '';
        if(yeniKullaniciAdiInput) yeniKullaniciAdiInput.disabled = false;
        if(kullaniciKaydetBtn) kullaniciKaydetBtn.textContent = 'Kaydet';
        if(yeniSifreInput) {
            yeniSifreInput.placeholder = '';
            yeniSifreInput.required = true;
        }
    }

    function kullanicilariYukle() {
        if (!aktifYoneticiAuth) {
            if(kullaniciListesiUl) kullaniciListesiUl.innerHTML = '<li>Lütfen önce giriş yapınız.</li>';
            return;
        }
        if (!kullaniciListesiUl) return;
        const kullanicilar = veriOku('kullanicilar', []);
        kullaniciListesiUl.innerHTML = '';
        const garsonlar = kullanicilar.filter(k => k.role === 'Garson');

        if (garsonlar.length === 0) {
            kullaniciListesiUl.innerHTML = '<li>Kayıtlı garson bulunmuyor.</li>';
            return;
        }

        garsonlar.forEach(k => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${k.username}</span>
                <div>
                    <button class="kullanici-duzenle-btn" data-id="${k.id}">Düzenle</button>
                    <button class="kullanici-sil-btn" data-id="${k.id}">Sil</button>
                </div>
            `;
            kullaniciListesiUl.appendChild(li);
        });
        addKullaniciButtonListeners();
    }

    function addKullaniciButtonListeners() {
        if (!kullaniciListesiUl) return;
        kullaniciListesiUl.querySelectorAll('.kullanici-duzenle-btn:not(.listener-added)').forEach(btn => {
            btn.addEventListener('click', kullaniciDuzenleFormunuDoldur);
            btn.classList.add('listener-added');
        });
        kullaniciListesiUl.querySelectorAll('.kullanici-sil-btn:not(.listener-added)').forEach(btn => {
            btn.addEventListener('click', kullaniciSil);
            btn.classList.add('listener-added');
        });
    }

    function kullaniciDuzenleFormunuDoldur(event) {
        const kullaniciId = parseInt(event.target.dataset.id);
        const kullanicilar = veriOku('kullanicilar', []);
        const kullanici = kullanicilar.find(k => k.id === kullaniciId && k.role === 'Garson');

        if (kullanici) {
            if(kullaniciEditIdInput) kullaniciEditIdInput.value = kullanici.id;
            if(yeniKullaniciAdiInput) yeniKullaniciAdiInput.value = kullanici.username;
            if(yeniSifreInput) {
                yeniSifreInput.value = '';
                yeniSifreInput.placeholder = 'Değiştirmek istemiyorsanız boş bırakın';
                yeniSifreInput.required = false;
            }
            if(kullaniciKaydetBtn) kullaniciKaydetBtn.textContent = 'Güncelle';
        }
    }

    function kullaniciKaydet() {
        const id = kullaniciEditIdInput.value ? parseInt(kullaniciEditIdInput.value) : null;
        const username = yeniKullaniciAdiInput.value.trim();
        const password = yeniSifreInput.value;

        if (!username || (!id && !password)) {
            alert('Kullanıcı adı ve şifre (yeni garson için) boş bırakılamaz.');
            return;
        }

        let kullanicilar = veriOku('kullanicilar', []);

        // Kullanıcı adı başka bir kullanıcıda var mı kontrolü (kendisi hariç)
     const isUsernameTaken = kullanicilar.some(k => k.username.toLowerCase() === username.toLowerCase() && k.id !== id);
     if (isUsernameTaken) {
         alert(`"${username}" kullanıcı adı başka bir garson tarafından kullanılıyor!`);
         return;
     }

     if (id) { // Güncelleme (Garson)
        const index = kullanicilar.findIndex(k => k.id === id && k.role === 'Garson');
        if (index !== -1) {
            kullanicilar[index].username = username; // <<<--- KULLANICI ADINI GÜNCELLE
            if (password) { // Sadece şifre girilmişse şifreyi de güncelle
                kullanicilar[index].password = password;
            }
        }
    } else { // Yeni Ekleme (Garson)
        // Yeni eklemede kullanıcı adı kontrolü zaten yukarıda yapıldı.
        const yeniKullanici = { id: yeniIdUret(), username: username, password: password, role: 'Garson' };
        kullanicilar.push(yeniKullanici);
    }

        veriYaz('kullanicilar', kullanicilar);
        kullanicilariYukle();
        kullaniciFormunuTemizle();
    }

    function kullaniciSil(event) {
         const kullaniciId = parseInt(event.target.dataset.id);
         if (!confirm(`Bu garsonu silmek istediğinizden emin misiniz?`)) {
             return;
         }
         let kullanicilar = veriOku('kullanicilar', []);
         kullanicilar = kullanicilar.filter(k => !(k.id === kullaniciId && k.role === 'Garson')); // Sadece o ID'li garsonu sil
         veriYaz('kullanicilar', kullanicilar);
         kullanicilariYukle();
         // Silinen kullanıcı formdaysa temizle
         if (kullaniciEditIdInput && parseInt(kullaniciEditIdInput.value) === kullaniciId) {
             kullaniciFormunuTemizle();
         }
    }


    // --- Raporlama Fonksiyonları ---
    function raporGoster() {
        if (!aktifYoneticiAuth) {
            if(raporSonucDiv) raporSonucDiv.innerHTML = '<h3>Lütfen önce giriş yapınız.</h3>';
            return;
        }
        if (!raporTarihInput) return; // Element yoksa çık
        const tarihString = raporTarihInput.value;
        if (!tarihString) {
            // Tarih seçilmemişse bugünü kullan veya uyarı ver
            raporTarihInput.valueAsDate = new Date(); // Bugünü ayarla
             raporGoster(); // Tekrar çağır
             return;
            // veya alert("Lütfen bir tarih seçin."); return;
        }
        const secilenTarih = new Date(tarihString + 'T00:00:00');
        if(raporTarihBaslikSpan) raporTarihBaslikSpan.textContent = secilenTarih.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });

        const tumOdenmisSiparisler = veriOku('odenmisSiparisler', []);
        const masalar = veriOku('masalar', []);
        const kullanicilar = veriOku('kullanicilar', []);
        const menu = veriOku('menu', []);

        const raporSiparisleri = tumOdenmisSiparisler.filter(siparis => {
            const odemeZamaniStr = siparis.odemeZamani || siparis.timestamp;
            return odemeZamaniStr && odemeZamaniStr.startsWith(tarihString);
        });
        renderRapor(raporSiparisleri, masalar, kullanicilar, menu);
    }

     function tumRaporlariGoster() {
         if(raporTarihBaslikSpan) raporTarihBaslikSpan.textContent = "Tüm Zamanlar";
         const tumOdenmisSiparisler = veriOku('odenmisSiparisler', []);
         const masalar = veriOku('masalar', []);
         const kullanicilar = veriOku('kullanicilar', []);
         const menu = veriOku('menu', []);
         renderRapor(tumOdenmisSiparisler, masalar, kullanicilar, menu);
     }

    function renderRapor(raporSiparisleri, masalar, kullanicilar, menu) {
        if (!raporSiparisListesiUl || !raporUrunAdetleriUl || !raporToplamCiroSpan) return;
        raporSiparisListesiUl.innerHTML = '';
        raporUrunAdetleriUl.innerHTML = '';
        let toplamCiro = 0;
        const urunAdetleri = {};

        if (raporSiparisleri.length === 0) {
             raporSiparisListesiUl.innerHTML = '<li>Gösterilecek ödenmiş sipariş bulunamadı.</li>';
             raporToplamCiroSpan.textContent = '0.00';
             raporUrunAdetleriUl.innerHTML = '<li>Satılan ürün yok.</li>';
             return;
        }

        raporSiparisleri.sort((a, b) => new Date(b.odemeZamani || b.timestamp) - new Date(a.odemeZamani || a.timestamp));

        raporSiparisleri.forEach((siparis, index) => {
            toplamCiro += siparis.total || 0;
            const masa = masalar.find(m => m.id === siparis.tableId);
            const masaAdi = masa ? masa.name : `Masa ${siparis.tableId}`;
            const garson = kullanicilar.find(k => k.id === siparis.garsonId);
            const garsonAdi = garson ? garson.username : 'Bilinmiyor';
            const odemeZamaniStr = siparis.odemeZamani || siparis.timestamp;
            const odemeZamani = odemeZamaniStr ? new Date(odemeZamaniStr).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-';
            const siparisRaporNo = index + 1;

            const li = document.createElement('li');
            li.innerHTML = `
                <span>${siparisRaporNo}. Sipariş - ${odemeZamani} - ${masaAdi} - ${garsonAdi} - Toplam: ${(siparis.total || 0).toFixed(2)} TL</span>
                <button class="rapor-detay-btn" data-id="${siparis.id}">Detay</button>
                <div class="rapor-siparis-detay" data-id="${siparis.id}" style="display:none;">
                     ${raporSiparisDetayHTML(siparis, menu)}
                 </div>
            `;
            raporSiparisListesiUl.appendChild(li);

            if (siparis.items && Array.isArray(siparis.items)) {
                siparis.items.forEach(item => {
                    const urun = menu.find(u => u.id === item.itemId);
                    const urunAdi = urun ? urun.name : `Bilinmeyen Ürün (${item.itemId})`;
                    urunAdetleri[urunAdi] = (urunAdetleri[urunAdi] || 0) + (item.quantity || 0);
                });
            }
        });

        raporToplamCiroSpan.textContent = toplamCiro.toFixed(2);

        const siraliUrunAdlari = Object.keys(urunAdetleri).sort((a, b) => a.localeCompare(b, 'tr'));
        if (siraliUrunAdlari.length > 0) {
            siraliUrunAdlari.forEach(urunAdi => {
                const li = document.createElement('li');
                li.textContent = `${urunAdi}: ${urunAdetleri[urunAdi]} adet`;
                raporUrunAdetleriUl.appendChild(li);
            });
        } else {
            raporUrunAdetleriUl.innerHTML = '<li>Satılan ürün yok.</li>';
        }
        addRaporDetayButtonListeners();
    }

    // yonetici.js - Eksik Menü Yönetimi Fonksiyonları

function urunFormunuTemizle() {
    if(urunEditIdInput) urunEditIdInput.value = '';
    if(urunAdiInput) urunAdiInput.value = '';
    if(urunKategoriInput) urunKategoriInput.value = '';
    if(urunFiyatInput) urunFiyatInput.value = '';
    if(urunAciklamaTextarea) urunAciklamaTextarea.value = '';
    if(urunFotoInput) urunFotoInput.value = '';
    if(urunAdiInput) urunAdiInput.disabled = false; // Düzenleme sonrası kilidi aç
    if(urunKaydetBtn) urunKaydetBtn.textContent = 'Kaydet';
    if(urunFiyatInput) urunFiyatInput.required = true; // Yeni eklerken fiyat zorunlu
}

async function menuyuYukleYonetici() { 
    if (!menuListesiYoneticiDiv || !aktifYoneticiAuth) {
        if(menuListesiYoneticiDiv) menuListesiYoneticiDiv.innerHTML = '<p>Lütfen önce giriş yapınız.</p>';
        return;
    }
    
    let menu = []; 
    try {
        // Kategoriye ve isme göre sıralı getirelim
        const menuSnapshot = await db.collection('menuItems').orderBy('category').orderBy('name').get();
        menuSnapshot.forEach(doc => {
            menu.push({ id: parseInt(doc.id), ...doc.data() });
        });
    } catch (error) {
        console.error("Yönetici için Firestore'dan menü okunurken hata:", error);
        menuListesiYoneticiDiv.innerHTML = '<p>Menü yüklenirken bir hata oluştu.</p>';
        return;
    }

    menuListesiYoneticiDiv.innerHTML = ''; // Önce temizle

    if (menu.length === 0) {
        menuListesiYoneticiDiv.innerHTML = '<p>Menüde hiç ürün bulunmuyor.</p>';
        return;
    }

    // Kategorilere göre grupla
    const kategoriler = {};
    menu.forEach(urun => {
        if (!kategoriler[urun.category]) {
            kategoriler[urun.category] = [];
        }
        kategoriler[urun.category].push(urun);
    });

    // Kategorileri alfabetik sırala
    const siraliKategoriAdlari = Object.keys(kategoriler).sort((a, b) => a.localeCompare(b, 'tr'));

    siraliKategoriAdlari.forEach(kategoriAdi => {
        const kategoriBaslik = document.createElement('h4');
        kategoriBaslik.textContent = kategoriAdi;
        menuListesiYoneticiDiv.appendChild(kategoriBaslik);

        const kategoriListesiUl = document.createElement('ul');
        kategoriler[kategoriAdi]
            .sort((a, b) => a.name.localeCompare(b.name, 'tr')) // Ürünleri isimlerine göre sırala
            .forEach(urun => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${urun.name} (${urun.price.toFixed(2)} TL) ${urun.description ? '- ' + urun.description : ''} ${urun.photo ? '(Resimli)' : ''}</span>
                    <div>
                        <button class="urun-duzenle-btn" data-id="${urun.id}">Düzenle</button>
                        <button class="urun-sil-btn" data-id="${urun.id}">Sil</button>
                    </div>
                `;
                kategoriListesiUl.appendChild(li);
            });
        menuListesiYoneticiDiv.appendChild(kategoriListesiUl);
    });
    addMenuButtonListeners(); // Listener'ları ekle
}

function addMenuButtonListeners() {
    if (!menuListesiYoneticiDiv) return;
    menuListesiYoneticiDiv.querySelectorAll('.urun-duzenle-btn:not(.listener-added)').forEach(btn => {
        btn.addEventListener('click', urunDuzenleFormunuDoldur);
        btn.classList.add('listener-added');
    });
    menuListesiYoneticiDiv.querySelectorAll('.urun-sil-btn:not(.listener-added)').forEach(btn => {
        btn.addEventListener('click', urunSil);
        btn.classList.add('listener-added');
    });
}

async function urunDuzenleFormunuDoldur(event) {
    const urunId = event.target.dataset.id; // ID zaten string olacak (doc.id)

    try {
        const docRef = db.collection('menuItems').doc(urunId); // Döküman ID'si string olmalı
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const urun = { id: parseInt(docSnap.id), ...docSnap.data() }; // id'yi int yapalım (formda string de olabilir)
            if(urunEditIdInput) urunEditIdInput.value = urun.id; // hidden input'a sakla
            if(urunAdiInput) urunAdiInput.value = urun.name;
            if(urunKategoriInput) urunKategoriInput.value = urun.category;
            if(urunFiyatInput) urunFiyatInput.value = urun.price;
            if(urunAciklamaTextarea) urunAciklamaTextarea.value = urun.description || '';
            if(urunFotoInput) urunFotoInput.value = urun.photo || '';
            if(urunKaydetBtn) urunKaydetBtn.textContent = 'Güncelle';
        } else {
            console.log("Düzenlenecek ürün Firestore'da bulunamadı:", urunId);
            alert("Düzenlenecek ürün bulunamadı.");
            urunFormunuTemizle(); // Formu temizle
        }
    } catch (error) {
        console.error("Firestore'dan ürün düzenleme için okunurken hata:", error);
        alert("Ürün bilgileri yüklenirken bir hata oluştu.");
    }
}

async function urunKaydet() { // async yaptık
    const editIdStr = urunEditIdInput.value; // Bu string ID (eğer varsa)
    const name = urunAdiInput.value.trim();
    const category = urunKategoriInput.value.trim();
    const priceString = urunFiyatInput.value.trim();
    const description = urunAciklamaTextarea.value.trim();
    const photo = urunFotoInput.value.trim() || null; // Boşsa null yapalım Firestore için

    if (!name || !category || !priceString) {
        alert('Ürün adı, kategori ve fiyat boş bırakılamaz.');
        return;
    }

    const price = parseFloat(priceString);
    if (isNaN(price) || price < 0) {
        alert('Lütfen geçerli bir fiyat girin (0 veya daha büyük).');
        return;
    }

    const urunData = {
        name,
        category,
        price,
        description,
        photo
    };


    try {
        if (editIdStr) { // Güncelleme
            const docRef = db.collection('menuItems').doc(editIdStr); // Döküman ID'si olarak editIdStr'yi kullan
            await docRef.update(urunData); // Sadece verilen alanları güncelle
            // veya await docRef.set(urunData, { merge: true }); // Eğer tüm dökümanı değiştirmek istersen
            alert(`"${name}" ürünü başarıyla güncellendi.`);
        } else { // Yeni Ekleme
            // Yeni ürün için Firestore'un otomatik ID oluşturmasını sağlayalım
            // VEYA kendimiz bir ID üretebiliriz (örn: yeniIdUret() ile ve onu string'e çevirerek)
            // Şimdilik Firestore'un ID'sini kullanalım ve ürünün kendi numerik ID'sini bir alan olarak ekleyelim:
            // urunData.productId = yeniIdUret(); // Örnek: Eğer kendi numerik ID'nizi de saklamak isterseniz
            // VEYA baştaki varsayıma göre, ürünün kendi ID'sini döküman ID'si yapacaksak:
            const yeniUrunId = yeniIdUret(); // ortak.js'den numerik ID
            urunData.originalId = yeniUrunId; // İstersen orijinal numerik ID'yi bir alanda tut
                                            // ya da productId gibi bir alan ekle.
                                            // Döküman ID'si için ise String(yeniUrunId) kullanacaksın.

            // Döküman ID'si olarak ürünün kendi ID'sini (string) kullanacaksak ve bu ID formdan gelmiyorsa,
            // ya yeni bir ID üretmeli ya da kullanıcıdan almalıyız.
            // `baslangicVerileriniYukle`deki gibi ürün ID'sini döküman ID'si yapalım.
            // Ancak yeni ürün eklerken bu ID'yi nasıl belirleyeceğiz?
            // En iyisi, `productId` diye bir alan tutup, Firestore'un kendi ID'sini kullanmak.
            // Şimdilik, başlangıçtaki `baslangicVerileriniYukle`deki mantığa sadık kalalım:
            // Eğer ürünün ID'si `yeniIdUret` ile oluşturuluyorsa ve bu `varsayilanMenu`'deki gibi
            // bir `id` alanı ise, onu döküman ID'si yapalım.

            // Yeni ürün eklerken, ürünün `id`'sini de oluşturup döküman ID'si yapalım:
            const yeniNumericId = yeniIdUret(); // ortak.js'den
            const yeniDocId = String(yeniNumericId); // Firestore döküman ID'si için string

            // Aynı isimde ürün var mı kontrolü (Firestore sorgusu ile yapılmalı - daha karmaşık)
            // Şimdilik bu kontrolü atlıyoruz veya basit bir `menu.some` ile (ama menu Firestore'dan çekilmeli önce)

            // Yeni ürünün verisi (originalId veya productId olmadan, çünkü doc ID'si kendi ID'si olacak)
            const { originalId, ...safUrunData } = urunData; // Eğer yukarıda eklediysen çıkar

            await db.collection('menuItems').doc(yeniDocId).set(safUrunData);
            alert(`"${name}" ürünü başarıyla eklendi (ID: ${yeniDocId}).`);
        }
        menuyuYukleYonetici(); // Listeyi Firestore'dan yeniden yükle
        urunFormunuTemizle();
    } catch (error) {
        console.error("Firestore menü kaydetme/güncelleme hatası:", error);
        alert("Ürün kaydedilirken/güncellenirken bir hata oluştu.");
    }
}

async function urunSil(event) { // async yaptık
    const urunDocId = event.target.dataset.id; 

     if (!urun) return; // Ürün yoksa çık

     if (!confirm(`"${urun.name}" ürününü menüden silmek istediğinizden emin misiniz?`)) {
         return;
     }

     let newMenu = menu.filter(u => u.id !== urunId);
     veriYaz('menu', newMenu);
     menuyuYukleYonetici(); // Listeyi yenile

     // Silinen ürün formdaysa temizle
     if (urunEditIdInput && parseInt(urunEditIdInput.value) === urunId) {
         urunFormunuTemizle();
     }
}

// yonetici.js - Eksik Rapor Detay Fonksiyonları

function raporSiparisDetayHTML(siparis, menu) {
    if (!siparis || !siparis.items || siparis.items.length === 0) {
        return '<ul><li>Sipariş içeriği bulunamadı.</li></ul>';
    }
    let detayHtml = '<ul>';
    siparis.items.forEach(item => {
        const urun = menu.find(u => u.id === item.itemId);
        const urunAdi = urun ? urun.name : `Bilinmeyen Ürün (${item.itemId})`;
        // Ödenmiş siparişte fiyat bilgisi siparişin içinden gelmeli
        const fiyat = item.price !== undefined ? item.price.toFixed(2) : 'N/A';
        const itemToplam = (item.quantity || 0) * (item.price || 0);
        detayHtml += `<li>${item.quantity || '?'}x ${urunAdi} (${fiyat} TL/adet) = ${itemToplam.toFixed(2)} TL</li>`;
    });
    detayHtml += '</ul>';
    return detayHtml;
}


function addRaporDetayButtonListeners() {
    if (!raporSiparisListesiUl) return;
    raporSiparisListesiUl.querySelectorAll('.rapor-detay-btn:not(.listener-added)').forEach(btn => {
        btn.addEventListener('click', toggleRaporDetay);
        btn.classList.add('listener-added');
    });
}

function toggleRaporDetay(event) {
    const siparisId = parseInt(event.target.dataset.id);
    const buton = event.target;
    const liElement = buton.closest('li'); // Butonun içinde olduğu li elementini bul
    if (!liElement) {
        console.error("Parent <li> element not found for detail button.");
        return;
    }
    const detayDiv = liElement.querySelector(`.rapor-siparis-detay[data-id="${siparisId}"]`);

    if (!detayDiv) {
        console.error(`Detail div not found for siparis ID: ${siparisId}`);
        return;
    }

    const isHidden = detayDiv.style.display === 'none';

    if (isHidden) {
        // Detay zaten HTML içinde renderRapor içinde oluşturulduğu için tekrar oluşturmaya gerek yok.
        // Sadece görünür yap.
        detayDiv.style.display = 'block';
        buton.textContent = 'Gizle';
    } else {
        detayDiv.style.display = 'none';
        buton.textContent = 'Detay';
    }
}


    // --- Event Listener'lar ---
    if (yoneticiGirisYapBtn) {
        yoneticiGirisYapBtn.addEventListener('click', yoneticiGirisYapFirebase); // YENİ
    }
    if (yoneticiSifreInput) {
        yoneticiSifreInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                yoneticiGirisYapFirebase(); // YENİ
            }
        });
    }
    if (yoneticiCikisYapBtn) {
        yoneticiCikisYapBtn.addEventListener('click', yoneticiCikisYapFirebase); // YENİ
    }
    
    if(profilGuncelleBtn) profilGuncelleBtn.addEventListener('click', profilGuncelle);
    if(kullaniciKaydetBtn) kullaniciKaydetBtn.addEventListener('click', kullaniciKaydet);
    if(kullaniciFormTemizleBtn) kullaniciFormTemizleBtn.addEventListener('click', kullaniciFormunuTemizle);
    if(urunKaydetBtn) urunKaydetBtn.addEventListener('click', urunKaydet);
    if(urunFormTemizleBtn) urunFormTemizleBtn.addEventListener('click', urunFormunuTemizle);
    if(raporGosterBtn) raporGosterBtn.addEventListener('click', raporGoster);
    if(tumRaporGosterBtn) tumRaporGosterBtn.addEventListener('click', tumRaporlariGoster);

}); // DOMContentLoaded Sonu