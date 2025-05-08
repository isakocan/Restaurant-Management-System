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
    let aktifCalisan = null; // { id, username, role }

    // --- Fonksiyonlar ---

    function calisanGirisYap() {
        if(!kullaniciAdiInput || !sifreInput || !hataMesajiP) return; // Elementler yoksa çık

        const username = kullaniciAdiInput.value.trim();
        const password = sifreInput.value;
        hataMesajiP.style.display = 'none';

        if (!username || !password) {
            gosterHata("Kullanıcı adı ve şifre boş bırakılamaz.");
            return;
        }
        // --->>> GİRİŞ YAPMADAN ÖNCE VERİLERİ KONTROL ET/YÜKLE <<<---
        baslangicVerileriniYukle();
        const kullanicilar = veriOku('kullanicilar');
        const bulunanKullanici = kullanicilar.find(k => k.username === username && k.password === password && k.role === 'Garson');

        if (bulunanKullanici) {
            aktifCalisan = { id: bulunanKullanici.id, username: bulunanKullanici.username, role: bulunanKullanici.role };
            girisBasarili();
        } else {
            gosterHata("Kullanıcı adı veya şifre hatalı ya da Garson yetkiniz yok.");
        }
    }

    function gosterHata(mesaj) {
        if(hataMesajiP) {
            hataMesajiP.textContent = mesaj;
            hataMesajiP.style.display = 'block';
        }
    }

    function girisBasarili() {
        if(calisanGirisFormu) calisanGirisFormu.style.display = 'none';
        if(calisanIcerikDiv) calisanIcerikDiv.style.display = 'block';
        if(calisanBilgiDiv) calisanBilgiDiv.style.display = 'flex';
        if(aktifCalisanAdiSpan && aktifCalisan) aktifCalisanAdiSpan.textContent = aktifCalisan.username; // aktifCalisan kontrolü eklendi

        renderBekleyenSiparisler();
        renderAlinanSiparisler();
    }

    function calisanCikisYap() {
        aktifCalisan = null;
        if(calisanIcerikDiv) calisanIcerikDiv.style.display = 'none';
        if(calisanBilgiDiv) calisanBilgiDiv.style.display = 'none';
        if(calisanGirisFormu) calisanGirisFormu.style.display = 'block';
        if(kullaniciAdiInput) kullaniciAdiInput.value = '';
        if(sifreInput) sifreInput.value = '';
        if(hataMesajiP) hataMesajiP.style.display = 'none';
    }

    /** Bekleyen siparişleri listeler */
    function renderBekleyenSiparisler() {
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
    if(girisYapBtn) girisYapBtn.addEventListener('click', calisanGirisYap);
    if(sifreInput) sifreInput.addEventListener('keypress', (event) => { if (event.key === 'Enter') calisanGirisYap(); });
    if(cikisYapBtn) cikisYapBtn.addEventListener('click', calisanCikisYap);

    // --- Sayfa İlk Yüklendiğinde ---
    if(calisanGirisFormu) calisanGirisFormu.style.display = 'block';
    if(calisanIcerikDiv) calisanIcerikDiv.style.display = 'none';
    if(calisanBilgiDiv) calisanBilgiDiv.style.display = 'none';

}); // DOMContentLoaded Sonu