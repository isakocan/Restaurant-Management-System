document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elementleri ---
    const calisanGirisFormu = document.getElementById('calisan-giris-formu');
    const kullaniciAdiInput = document.getElementById('calisan-kullanici-adi');
    const sifreInput = document.getElementById('calisan-sifre');
    const girisYapBtn = document.getElementById('calisan-giris-yap-btn');
    const hataMesajiP = document.getElementById('calisan-giris-hata-mesaji');

    const calisanIcerikDiv = document.getElementById('calisan-icerik');
    const calisanBilgiDiv = document.getElementById('calisan-bilgi');
    const aktifCalisanAdiSpan = document.getElementById('aktif-calisan-adi');
    const cikisYapBtn = document.getElementById('calisan-cikis-yap-btn');

    const bekleyenListesiUl = document.getElementById('bekleyen-siparisler-listesi');
    const alinanListesiUl = document.getElementById('alinan-siparisler-listesi');

    // --- Uygulama Durumu ---
    let aktifCalisanAuth = null;

    // --- Fonksiyonlar ---
    // calisan.js - aktifCalisanAuth tanımından SONRA

auth.onAuthStateChanged(async (user) => {
    if (user) {
        aktifCalisanAuth = user; // Firebase Auth bilgisini sakla

        // Firestore'dan kullanıcı verilerini (rol dahil) çek
        const calisanData = await getKullaniciData(user.uid); // YENİ ÇAĞRI

        if (calisanData && calisanData.role === 'Garson') {
            // Kullanıcı Firestore'da bulundu VE rolü "Garson" ise
            // aktifCalisanFirestoreData = calisanData; // İstersen tüm Firestore verisini saklayabilirsin
            if (aktifCalisanAdiSpan) {
                // username alanını Firestore'dan alalım, eğer yoksa e-postadan türetelim
                aktifCalisanAdiSpan.textContent = ilkHarfiBuyut(calisanData.username || user.email.split('@')[0]);
            }
            girisBasariliArayuzunuGoster();
            renderBekleyenSiparisler();
            renderAlinanSiparisler();
        } else {
            // Kullanıcı Firestore'da bulunamadı VEYA rolü "Garson" değilse
            console.log("Giriş reddedildi. Kullanıcı Firestore'da bulunamadı veya rolü Garson değil:", user.email);
            gosterHata("Bu hesapla garson olarak giriş yapma yetkiniz yok veya hesap bilgileriniz eksik.");
            await calisanCikisYapFirebase(); // Otomatik olarak çıkış yaptır
        }

    } else {
        aktifCalisanAuth = null;
        // aktifCalisanFirestoreData = null;
        cikisYapildiArayuzunuGoster();
    }

    // Giriş/Çıkış butonlarının tıklanabilirliğini ayarla
    if (girisYapBtn) {
        girisYapBtn.disabled = !!user; // Eğer user varsa (giriş yapılmışsa) butonu KİTLE
    }
    if (cikisYapBtn) {
        cikisYapBtn.disabled = !user; // Eğer user yoksa (çıkış yapılmışsa) butonu KİTLE
    }
});

function girisBasariliArayuzunuGoster() {
    if (calisanGirisFormu) calisanGirisFormu.style.display = 'none'; // Giriş formunu gizle
    if (calisanIcerikDiv) calisanIcerikDiv.style.display = 'block';  // Çalışan içeriğini göster
    if (calisanBilgiDiv) calisanBilgiDiv.style.display = 'flex';    // Sağ üstteki hoş geldin mesajını göster
}

function cikisYapildiArayuzunuGoster() {
    if (calisanIcerikDiv) calisanIcerikDiv.style.display = 'none';   // Çalışan içeriğini gizle
    if (calisanBilgiDiv) calisanBilgiDiv.style.display = 'none';    // Sağ üstteki hoş geldin mesajını gizle
    if (calisanGirisFormu) calisanGirisFormu.style.display = 'block';  // Giriş formunu göster

    if (kullaniciAdiInput) kullaniciAdiInput.value = ''; // E-posta input'unu temizle
    if (sifreInput) sifreInput.value = '';             // Şifre input'unu temizle

    // Listeleri de "giriş yapınız" mesajıyla güncelle
    if (bekleyenListesiUl) bekleyenListesiUl.innerHTML = '<li>Siparişleri görmek için giriş yapınız.</li>';
    if (alinanListesiUl) alinanListesiUl.innerHTML = '<li>Siparişleri görmek için giriş yapınız.</li>';
}


async function calisanGirisYapFirebase() {
    if (!kullaniciAdiInput || !sifreInput || !hataMesajiP) return;

    if (hataMesajiP) {
        hataMesajiP.textContent = '';
        hataMesajiP.style.display = 'none';
    }

    const email = kullaniciAdiInput.value.trim(); // HTML'deki input'tan e-postayı al
    const password = sifreInput.value;
    hataMesajiP.style.display = 'none'; // Önceki hata mesajını temizle

    if (!email || !password) {
        gosterHata("E-posta ve şifre boş bırakılamaz.");
        return;
    }

    try {
        // Firebase'e "bu e-posta ve şifreyle giriş yapmayı dene" diyoruz
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        // Eğer buraya geldiyse, Firebase girişi BAŞARILI buldu.
        // `auth.onAuthStateChanged` zaten tetiklenecek ve arayüzü güncelleyecek.
        console.log("Firebase'den giriş başarılı:", userCredential.user);
        // Giriş başarılı olduğu için inputları temizleyebiliriz.
        kullaniciAdiInput.value = '';
        sifreInput.value = '';
    } catch (error) {
        console.error("Firebase giriş hatası:", error);
        // Hata kodlarına göre daha anlaşılır mesajlar verelim
        if (error.code === 'auth/user-not-found' ||
            error.code === 'auth/wrong-password' ||
            error.code === 'auth/invalid-credential' || // Bu da bazen gelebiliyor
            error.code === 'auth/invalid-login-credentials') { // Senin aldığın hata
            gosterHata("E-posta veya şifre hatalı. Lütfen kontrol edip tekrar deneyin.");
        } else if (error.code === 'auth/invalid-email') {
            gosterHata("Lütfen geçerli bir e-posta adresi girin.");
        } else if (error.code === 'auth/too-many-requests') {
            gosterHata("Çok fazla hatalı giriş denemesi yapıldı. Lütfen daha sonra tekrar deneyin.");
        } else {
            // Diğer beklenmedik hatalar için genel bir mesaj
            gosterHata("Giriş sırasında bir sorun oluştu. Lütfen tekrar deneyin.");
            // İstersen teknik hata kodunu da loglayabilirsin veya daha detaylı bir mesaj verebilirsin.
            // gosterHata("Giriş sırasında bir sorun oluştu. Hata: " + error.message);
        }
    }
}

function ilkHarfiBuyut(str) {
    if (!str) return ''; // Eğer string boşsa boş döndür
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(); // İlk harfi büyüt, geri kalanını küçült
}

    function gosterHata(mesaj) {
        if(hataMesajiP) {
            hataMesajiP.textContent = mesaj;
            hataMesajiP.style.display = 'block';
        }
    }

    async function calisanCikisYapFirebase() {
        try {
            // Firebase'e "mevcut kullanıcının çıkışını yap" diyoruz
            await auth.signOut();
            // `auth.onAuthStateChanged` zaten tetiklenecek ve arayüzü güncelleyecek.
            console.log("Firebase'den çıkış yapıldı.");
        } catch (error) {
            console.error("Firebase çıkış hatası:", error);
            alert("Çıkış yapılırken bir hata oluştu.");
        }
    }

    /** Bekleyen siparişleri listeler */
    function renderBekleyenSiparisler() {
        if (!aktifCalisanAuth) { // Eğer kimse giriş yapmamışsa
            if (bekleyenListesiUl) bekleyenListesiUl.innerHTML = '<li>Lütfen önce giriş yapınız.</li>';
            return; // Fonksiyondan çık, bir şey yapma
        }
        if (!bekleyenListesiUl) return;
        const siparisler = veriOku('siparisler', []);
        const masalar = veriOku('masalar', []);
        bekleyenListesiUl.innerHTML = '';

        const bekleyenSiparisler = siparisler.filter(s => s.status === 'Bekliyor');

        if (bekleyenSiparisler.length === 0) {
            bekleyenListesiUl.innerHTML = '<li>Bekleyen sipariş yok.</li>';
            return;
        }

        bekleyenSiparisler.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));

        bekleyenSiparisler.forEach((siparis, index) => { // index'i al
            const masa = masalar.find(m => m.id === siparis.tableId);
            const masaAdi = masa ? masa.name : `Masa ID: ${siparis.tableId}`; // Masa bulunamazsa ID göster
            const siparisZamani = new Date(siparis.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
            const siparisNo = index + 1; // 1'den başlayan sıra numarası
    
            const li = document.createElement('li');
            li.innerHTML = `
            <span>${siparisNo}. Sipariş - ${masaAdi} - ${siparisZamani}</span>
            <div class="siparis-actions"> 
               <button class="detay-goster-btn btn-info" data-id="${siparis.id}">Detaylar</button> 
               <button class="isleme-al-btn btn-success" data-id="${siparis.id}">İşleme Al</button>  
            </div>
            <div class="siparis-detay" data-id="${siparis.id}" style="display: none;">
               
            </div>
        `;
            bekleyenListesiUl.appendChild(li);
        });
        addBekleyenSiparisListeners(); // Listenerları ekle/güncelle
    }

     /** Bekleyen sipariş butonlarına listener ekler */
     function addBekleyenSiparisListeners() {
        if (!bekleyenListesiUl) return;
    
        // İşleme Al Butonları
        bekleyenListesiUl.querySelectorAll('.isleme-al-btn:not(.listener-added)').forEach(btn => {
            btn.addEventListener('click', islemeAl);
            btn.classList.add('listener-added'); // Tekrar eklenmesini önle
        });
    
        // Detay Göster Butonları (YENİ EKLENDİ)
        // Aynı toggleDetay fonksiyonunu kullanabiliriz çünkü o da siparisler listesinden okuyor.
        bekleyenListesiUl.querySelectorAll('.detay-goster-btn:not(.listener-added)').forEach(btn => {
            btn.addEventListener('click', toggleDetay); // Mevcut toggleDetay fonksiyonunu kullan
            btn.classList.add('listener-added'); // Tekrar eklenmesini önle
        });
    }

    /** Alınan siparişleri listeler */
    function renderAlinanSiparisler() {
        if (!aktifCalisanAuth) { // Eğer kimse giriş yapmamışsa
            if (alinanListesiUl) alinanListesiUl.innerHTML = '<li>Lütfen önce giriş yapınız.</li>';
            return; // Fonksiyondan çık, bir şey yapma
        }
        if (!alinanListesiUl || !aktifCalisan) return;
        const siparisler = veriOku('siparisler', []);
        const masalar = veriOku('masalar', []);
        alinanListesiUl.innerHTML = '';

        const alinanSiparisler = siparisler.filter(s => s.status === 'Alındı' && s.garsonId === aktifCalisan.id);

        if (alinanSiparisler.length === 0) {
            alinanListesiUl.innerHTML = '<li>Üzerinize aldığınız aktif sipariş yok.</li>';
            return;
        }

         alinanSiparisler.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));

         alinanSiparisler.forEach((siparis, index) => { // index'i al
            const masa = masalar.find(m => m.id === siparis.tableId);
            const masaAdi = masa ? masa.name : `Masa ID: ${siparis.tableId}`; // Masa bulunamazsa ID göster
            const siparisZamani = new Date(siparis.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
            const siparisNo = index + 1; // 1'den başlayan sıra numarası <<<--- DEĞİŞİKLİK

            const li = document.createElement('li');
            li.innerHTML = `
            <span>${siparisNo}. Sipariş - ${masaAdi} - ${siparisZamani}</span>
            <div class="siparis-actions"> 
               <button class="detay-goster-btn btn-info" data-id="${siparis.id}">Detaylar</button> 
               <button class="odeme-yapildi-btn btn-warning" data-id="${siparis.id}">Ödeme Yapıldı</button> 
            </div>
            <div class="siparis-detay" data-id="${siparis.id}" style="display: none;">
                
            </div>
        `;
            alinanListesiUl.appendChild(li);
        });
        addAlinanSiparisListeners();
    }

    /** Alınan sipariş butonlarına listener ekler */
    function addAlinanSiparisListeners() {
         if (!alinanListesiUl) return;
         alinanListesiUl.querySelectorAll('.detay-goster-btn:not(.listener-added)').forEach(btn => {
            btn.addEventListener('click', toggleDetay);
            btn.classList.add('listener-added');
        });
         alinanListesiUl.querySelectorAll('.odeme-yapildi-btn:not(.listener-added)').forEach(btn => {
            btn.addEventListener('click', odemeYapildi);
            btn.classList.add('listener-added');
        });
    }

    /** "İşleme Al" butonuna tıklandığında çalışır */
    function islemeAl(event) {
        if (!aktifCalisanAuth) { // Eğer kimse giriş yapmamışsa
            alert("Bu işlemi yapmak için giriş yapmalısınız.");
            return; // Fonksiyondan çık
        }
        if (!aktifCalisan) return;
        const siparisId = parseInt(event.target.dataset.id);
        let siparisler = veriOku('siparisler', []);
        const siparisIndex = siparisler.findIndex(s => s.id === siparisId && s.status === 'Bekliyor');

        if (siparisIndex !== -1) {
            siparisler[siparisIndex].status = 'Alındı';
            siparisler[siparisIndex].garsonId = aktifCalisan.id;
            veriYaz('siparisler', siparisler);
            renderBekleyenSiparisler();
            renderAlinanSiparisler();
        } else {
            alert("Sipariş bulunamadı veya başka bir garson tarafından alınmış olabilir.");
            renderBekleyenSiparisler();
        }
    }

    /** "Ödeme Yapıldı" butonuna tıklandığında çalışır */
    function odemeYapildi(event) {
        if (!aktifCalisanAuth) { // Eğer kimse giriş yapmamışsa
            alert("Bu işlemi yapmak için giriş yapmalısınız.");
            return; // Fonksiyondan çık
        }
        const siparisId = parseInt(event.target.dataset.id);
        let siparisler = veriOku('siparisler', []);
        let masalar = veriOku('masalar', []);
        let odenmisSiparisler = veriOku('odenmisSiparisler', []);

        const siparisIndex = siparisler.findIndex(s => s.id === siparisId && s.status === 'Alındı');

        if (siparisIndex !== -1) {
            const odenenSiparis = { ...siparisler[siparisIndex] };
            odenenSiparis.status = 'Ödendi';
            odenenSiparis.odemeZamani = new Date().toISOString();
            odenmisSiparisler.push(odenenSiparis);
            veriYaz('odenmisSiparisler', odenmisSiparisler);

            siparisler.splice(siparisIndex, 1);
            veriYaz('siparisler', siparisler);

            const masaIndex = masalar.findIndex(m => m.id === odenenSiparis.tableId);
            if (masaIndex !== -1) {
                masalar[masaIndex].status = 'Boş';
                veriYaz('masalar', masalar);
            }
            renderAlinanSiparisler();
        } else {
            alert("Ödenecek sipariş bulunamadı veya durumu değişmiş olabilir.");
            renderAlinanSiparisler();
        }
    }

    /** Sipariş detaylarını gösterir/gizler ve içeriği yükler */
    function toggleDetay(event) {
        const siparisId = parseInt(event.target.dataset.id);
        const buton = event.target;
        const liElement = buton.closest('li');
        if (!liElement) return;
        const detayDiv = liElement.querySelector(`.siparis-detay[data-id="${siparisId}"]`);

        if (!detayDiv) return;

        const isHidden = detayDiv.style.display === 'none';

        if (isHidden) {
            const siparis = veriOku('siparisler', []).find(s => s.id === siparisId);
            const menu = veriOku('menu', []);
            if (siparis) {
                let detayHtml = '<ul>';
                if (siparis.items && siparis.items.length > 0) {
                     siparis.items.forEach(item => {
                        const urun = menu.find(u => u.id === item.itemId);
                        const urunAdi = urun ? urun.name : `Bilinmeyen Ürün (${item.itemId})`;
                        const fiyat = item.price !== undefined ? item.price.toFixed(2) : 'N/A';
                         detayHtml += `<li>${item.quantity || '?'}x ${urunAdi} (${fiyat} TL)</li>`;
                    });
                } else {
                     detayHtml += '<li>Sipariş içeriği boş.</li>';
                }
                detayHtml += '</ul>';
                detayHtml += `<p><strong>Toplam: ${(siparis.total || 0).toFixed(2)} TL</strong></p>`;
                detayDiv.innerHTML = detayHtml;
            } else {
                 detayDiv.innerHTML = 'Sipariş detayları yüklenemedi.';
            }
            detayDiv.style.display = 'block';
            buton.textContent = 'Gizle';
        } else {
            detayDiv.style.display = 'none';
            buton.textContent = 'Detaylar';
        }
    }

    // --- Event Listener'lar ---
    if (girisYapBtn) {
        girisYapBtn.addEventListener('click', calisanGirisYapFirebase); // YENİ FONKSİYONA BAĞLA
    }
    if (sifreInput) {
        sifreInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                calisanGirisYapFirebase(); // YENİ FONKSİYONA BAĞLA
            }
        });
    }
    if (cikisYapBtn) {
        cikisYapBtn.addEventListener('click', calisanCikisYapFirebase); // YENİ FONKSİYONA BAĞLA
    }

}); // DOMContentLoaded Sonu