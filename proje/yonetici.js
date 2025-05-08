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
    let aktifYonetici = null; // { id, username, role, password }

    // --- Giriş / Çıkış Fonksiyonları ---
    function yoneticiGirisYap() {
        const kullaniciAdi = yoneticiKullaniciAdiInput.value.trim();
        const sifre = yoneticiSifreInput.value;
        yoneticiGirisHataMesaji.style.display = 'none';

        if (!kullaniciAdi || !sifre) {
            yoneticiGosterHata("Kullanıcı adı ve şifre boş bırakılamaz.");
            return;
        }
        // Giriş yapmadan önce başlangıç verilerini yükle
        baslangicVerileriniYukle();
        const kullanicilar = veriOku('kullanicilar');
        const bulunanKullanici = kullanicilar.find(k => k.username === kullaniciAdi && k.password === sifre && k.role === 'Yönetici'); // Rol kontrolü eklendi

        if (bulunanKullanici) {
            aktifYonetici = {
                id: bulunanKullanici.id,
                username: bulunanKullanici.username,
                role: bulunanKullanici.role,
                password: bulunanKullanici.password
            };
            yoneticiGirisBasarili();
        } else {
            yoneticiGosterHata("Kullanıcı adı veya şifre hatalı ya da Yönetici yetkiniz yok.");
        }
    }

    function yoneticiGirisBasarili() {
        if(yoneticiGirisFormu) yoneticiGirisFormu.style.display = 'none';
        if(yonetimIcerik) yonetimIcerik.style.display = 'block';
        if(yoneticiBilgiDiv) yoneticiBilgiDiv.style.display = 'flex';
        if(yoneticiAdiSpan) yoneticiAdiSpan.textContent = aktifYonetici.username;

        if(guncelYeniKullaniciAdiInput) guncelYeniKullaniciAdiInput.value = aktifYonetici.username;
        if(guncelSifreInput) guncelSifreInput.value = '';
        if(guncelYeniSifreInput) guncelYeniSifreInput.value = '';
        if(profilGuncelleMesajP) {
            profilGuncelleMesajP.textContent = '';
            profilGuncelleMesajP.style.color = 'green';
        }
        kullanicilariYukle();
        menuyuYukleYonetici();
        if(raporTarihInput) raporTarihInput.valueAsDate = new Date(); // Varsayılan tarih bugun
        raporGoster(); // Başlangıçta bugünün raporunu göster
    }

    function yoneticiGosterHata(mesaj) {
        if(yoneticiGirisHataMesaji) {
            yoneticiGirisHataMesaji.textContent = mesaj;
            yoneticiGirisHataMesaji.style.display = 'block';
        }
    }

    function yoneticiCikisYap() {
        aktifYonetici = null;
        if(yonetimIcerik) yonetimIcerik.style.display = 'none';
        if(yoneticiBilgiDiv) yoneticiBilgiDiv.style.display = 'none';
        if(yoneticiGirisFormu) yoneticiGirisFormu.style.display = 'block';
        if(yoneticiKullaniciAdiInput) yoneticiKullaniciAdiInput.value = '';
        if(yoneticiSifreInput) yoneticiSifreInput.value = '';
        if(yoneticiGirisHataMesaji) yoneticiGirisHataMesaji.style.display = 'none';
    }

    // --- Profil Güncelleme Fonksiyonu ---
    function profilGuncelle() {
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

    // --- Menü Yönetimi Fonksiyonları ---
    function urunFormunuTemizle() { /* kod aynı */ }
    function menuyuYukleYonetici() { /* kod aynı */ }
    function addMenuButtonListeners() { /* kod aynı */ }
    function urunDuzenleFormunuDoldur(event) { /* kod aynı */ }
    function urunKaydet() { /* kod aynı */ }
    function urunSil(event) { /* kod aynı */ }

    // --- Raporlama Fonksiyonları ---
    function raporGoster() {
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

function menuyuYukleYonetici() {
    if (!menuListesiYoneticiDiv) return;
    const menu = veriOku('menu', []);
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

function urunDuzenleFormunuDoldur(event) {
    const urunId = parseInt(event.target.dataset.id);
    const menu = veriOku('menu', []);
    const urun = menu.find(u => u.id === urunId);

    if (urun) {
        if(urunEditIdInput) urunEditIdInput.value = urun.id;
        if(urunAdiInput) urunAdiInput.value = urun.name;
        if(urunKategoriInput) urunKategoriInput.value = urun.category;
        if(urunFiyatInput) urunFiyatInput.value = urun.price;
        if(urunAciklamaTextarea) urunAciklamaTextarea.value = urun.description || '';
        if(urunFotoInput) urunFotoInput.value = urun.photo || '';
        // if(urunAdiInput) urunAdiInput.disabled = true; // Ürün adı değiştirilebilsin
        if(urunKaydetBtn) urunKaydetBtn.textContent = 'Güncelle';
        if(urunFiyatInput) urunFiyatInput.required = true; // Fiyat hep zorunlu
    }
}

function urunKaydet() {
    const id = urunEditIdInput.value ? parseInt(urunEditIdInput.value) : null;
    const name = urunAdiInput.value.trim();
    const category = urunKategoriInput.value.trim();
    const priceString = urunFiyatInput.value.trim();
    const description = urunAciklamaTextarea.value.trim();
    const photo = urunFotoInput.value.trim();

    if (!name || !category || !priceString) {
        alert('Ürün adı, kategori ve fiyat boş bırakılamaz.');
        return;
    }

    const price = parseFloat(priceString);
    if (isNaN(price) || price < 0) {
        alert('Lütfen geçerli bir fiyat girin (0 veya daha büyük).');
        return;
    }

    let menu = veriOku('menu', []);

    if (id) { // Güncelleme
        const index = menu.findIndex(u => u.id === id);
        if (index !== -1) {
            menu[index] = { ...menu[index], name, category, price, description, photo }; // Tüm alanları güncelle
        }
    } else { // Yeni Ekleme
        // Aynı isimde ürün var mı kontrolü (opsiyonel)
        if (menu.some(u => u.name.toLowerCase() === name.toLowerCase())) {
             alert(`"${name}" isimli ürün zaten mevcut!`);
             return;
        }
        const yeniUrun = { id: yeniIdUret(), name, category, price, description, photo };
        menu.push(yeniUrun);
    }

    veriYaz('menu', menu);
    menuyuYukleYonetici(); // Listeyi yenile
    urunFormunuTemizle(); // Formu temizle
}

function urunSil(event) {
     const urunId = parseInt(event.target.dataset.id);
     const menu = veriOku('menu', []);
     const urun = menu.find(u => u.id === urunId);

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
    if(yoneticiGirisYapBtn) yoneticiGirisYapBtn.addEventListener('click', yoneticiGirisYap);
    if(yoneticiSifreInput) yoneticiSifreInput.addEventListener('keypress', (event) => { /* ... */ });
    if(yoneticiCikisYapBtn) yoneticiCikisYapBtn.addEventListener('click', yoneticiCikisYap);
    if(profilGuncelleBtn) profilGuncelleBtn.addEventListener('click', profilGuncelle);
    if(kullaniciKaydetBtn) kullaniciKaydetBtn.addEventListener('click', kullaniciKaydet);
    if(kullaniciFormTemizleBtn) kullaniciFormTemizleBtn.addEventListener('click', kullaniciFormunuTemizle);
    if(urunKaydetBtn) urunKaydetBtn.addEventListener('click', urunKaydet);
    if(urunFormTemizleBtn) urunFormTemizleBtn.addEventListener('click', urunFormunuTemizle);
    if(raporGosterBtn) raporGosterBtn.addEventListener('click', raporGoster);
    if(tumRaporGosterBtn) tumRaporGosterBtn.addEventListener('click', tumRaporlariGoster);

    // --- Sayfa İlk Yüklendiğinde ---
    if(yoneticiGirisFormu) yoneticiGirisFormu.style.display = 'block';
    if(yonetimIcerik) yonetimIcerik.style.display = 'none';
    if(yoneticiBilgiDiv) yoneticiBilgiDiv.style.display = 'none';

}); // DOMContentLoaded Sonu