// app.js (TAMAMI - Güncellenmiş Hali)

document.addEventListener('DOMContentLoaded', () => {
    baslangicVerileriniYukle();

    const masaAlani = document.getElementById('masa-alani');
    const siparisModal = document.getElementById('siparis-modal');
    const modalMasaNo = document.getElementById('modal-masa-no');
    const menuKategorilerDiv = document.getElementById('menu-kategoriler');
    const menuUrunlerDiv = document.getElementById('menu-urunler');
    const sepetListesiUl = document.getElementById('sepet-listesi');
    const sepetToplamSpan = document.getElementById('sepet-toplam');
    const closeModalBtn = siparisModal ? siparisModal.querySelector('.close-btn') : null;
    const siparisOnaylaBtn = document.getElementById('siparis-onayla-btn');
    const sepetTemizleBtn = document.getElementById('sepet-temizle-btn');

    let seciliMasaId = null;
    let sepet = {};

    function renderMasalar() {
        const defaultMasalar = [ /*...*/ ]; // Başlangıç masaları
        const masalar = veriOku('masalar', defaultMasalar);
        if (!masaAlani) return;
        masaAlani.innerHTML = '';
        masalar.forEach(masa => {
            const masaDiv = document.createElement('div');
            masaDiv.classList.add('masa');
            masaDiv.textContent = masa.name;
            masaDiv.dataset.id = masa.id;
            if (masa.status === 'Boş') {
                masaDiv.classList.add('masa-bos');
                masaDiv.addEventListener('click', masaTiklandi);
            } else {
                masaDiv.classList.add('masa-dolu');
                masaDiv.style.cursor = 'not-allowed';
            }
            masaAlani.appendChild(masaDiv);
        });
    }

    function masaTiklandi(event) {
        seciliMasaId = parseInt(event.target.dataset.id);
        const masalar = veriOku('masalar');
        const masa = masalar.find(m => m.id === seciliMasaId);
        if (!masa) return;
        if(modalMasaNo) modalMasaNo.textContent = masa.name;
        sepet = {};
        renderSepet();
        renderKategoriler();
        if(menuUrunlerDiv) menuUrunlerDiv.innerHTML = '';
        if(siparisModal) siparisModal.style.display = 'block';
    }

    function renderKategoriler() {
        const menu = veriOku('menu', []);
        const kategoriler = [...new Set(menu.map(urun => urun.category))].sort();
        if (!menuKategorilerDiv) return;
        menuKategorilerDiv.innerHTML = '';
        kategoriler.forEach((kategori, index) => {
            const kategoriBtn = document.createElement('button');
            kategoriBtn.textContent = kategori;
            kategoriBtn.classList.add('kategori-btn');
            kategoriBtn.addEventListener('click', () => kategoriSecildi(kategori));
            menuKategorilerDiv.appendChild(kategoriBtn);
            if (index === 0) {
                kategoriSecildi(kategori);
                kategoriBtn.classList.add('aktif');
            }
        });
    }

    function kategoriSecildi(kategoriAdi) {
        document.querySelectorAll('.kategori-btn').forEach(btn => {
            btn.classList.remove('aktif');
            if (btn.textContent === kategoriAdi) {
                btn.classList.add('aktif');
            }
        });
        const menu = veriOku('menu');
        const urunler = menu.filter(urun => urun.category === kategoriAdi);
        renderUrunler(urunler);
    }

    /** Seçilen kategoriye ait ürünleri modal içinde listeler (YENİ DÜZEN) */
    function renderUrunler(urunler) {
        if (!menuUrunlerDiv) return;
        menuUrunlerDiv.innerHTML = ''; // Önceki ürünleri temizle
        const placeholderImage = 'images/placeholder.png'; // Varsayılan resim yolu

        urunler.forEach(urun => {
            const urunDiv = document.createElement('div');
            urunDiv.classList.add('urun-item-yeni'); // Yeni CSS sınıfı

            // Resim bölümü
            const resimSrc = urun.photo || placeholderImage; // Ürün resmi yoksa placeholder kullan
            const resimHtml = `<img src="${resimSrc}" alt="${urun.name}" class="urun-resim" onerror="this.src='${placeholderImage}'; this.onerror=null;">`; // Hata durumunda da placeholder

            // Detay (İsim, Fiyat, Açıklama) ve Buton bölümü
            const detayHtml = `
                <div class="urun-detay-ana">
                    <div class="urun-bilgi-yeni">
                        <span class="urun-ad-fiyat">${urun.name} (${urun.price.toFixed(2)} TL)</span>
                    </div>
                    ${urun.description ? `<p class="urun-aciklama-kalici">${urun.description}</p>` : ''}
                </div>
                <button class="sepete-ekle-btn" data-id="${urun.id}">Ekle</button>
            `;

            urunDiv.innerHTML = resimHtml + detayHtml; // Resim + Detaylar ve Buton

            const ekleBtn = urunDiv.querySelector('.sepete-ekle-btn');
            if (ekleBtn) ekleBtn.addEventListener('click', sepeteEkle);

            menuUrunlerDiv.appendChild(urunDiv);
        });
    }

    // toggleUrunAciklama fonksiyonu SİLİNDİ.

    function sepeteEkle(event) {
        const urunId = parseInt(event.target.dataset.id);
        sepet[urunId] = (sepet[urunId] || 0) + 1;
        renderSepet();
    }

    function renderSepet() {
        if (!sepetListesiUl || !sepetToplamSpan) return;
        sepetListesiUl.innerHTML = '';
        let toplamTutar = 0;
        const menu = veriOku('menu');
        for (const urunId in sepet) {
             // ... (kod aynı) ...
            const adet = sepet[urunId];
            if (adet <= 0) continue;
            const urun = menu.find(u => u.id === parseInt(urunId));
            if (!urun) continue;
            const li = document.createElement('li');
            const itemToplam = adet * urun.price;
            toplamTutar += itemToplam;
            li.innerHTML = `
                ${adet}x ${urun.name} (${urun.price.toFixed(2)} TL/adet) = ${itemToplam.toFixed(2)} TL
                <button class="sepetten-cikar-btn" data-id="${urunId}">Çıkar</button>
            `;
            const cikarBtn = li.querySelector('.sepetten-cikar-btn');
            if(cikarBtn) cikarBtn.addEventListener('click', sepettenCikar);
            sepetListesiUl.appendChild(li);
        }
        sepetToplamSpan.textContent = toplamTutar.toFixed(2);
    }

    function sepettenCikar(event) {
        const urunId = parseInt(event.target.dataset.id);
        if (sepet[urunId]) {
            sepet[urunId]--;
            if (sepet[urunId] <= 0) delete sepet[urunId];
        }
        renderSepet();
    }

    function sepetiTemizle() {
        sepet = {};
        renderSepet();
    }

    function siparisOnayla() {
        if (Object.keys(sepet).length === 0 || seciliMasaId === null) {
            alert("Sepetiniz boş veya bir masa seçilmedi!");
            return;
        }
        const siparisler = veriOku('siparisler', []);
        const menu = veriOku('menu');
        let siparisTotal = 0;
        const siparisItems = [];
        for (const urunId in sepet) {
             // ... (kod aynı) ...
            const adet = sepet[urunId];
            const urun = menu.find(u => u.id === parseInt(urunId));
            if (urun && adet > 0) {
                siparisItems.push({ itemId: urun.id, quantity: adet, price: urun.price });
                siparisTotal += adet * urun.price;
            }
        }
        const yeniSiparis = {
            id: yeniIdUret(), // ortak.js'den gelen fonksiyonla
            tableId: seciliMasaId,
            items: siparisItems, // Sepetteki ürünler { itemId, quantity, price } formatında
            total: siparisTotal,
            status: 'Bekliyor', // <<<--- BU ÇOK ÖNEMLİ
            timestamp: new Date().toISOString(),
            garsonId: null,      // <<<--- BU ÇOK ÖNEMLİ
            // odemeZamani: null // Henüz ödenmedi
        };
        siparisler.push(yeniSiparis);
        veriYaz('siparisler', siparisler);

        // Masa durumunu güncelle
        const masalar = veriOku('masalar');
        const masaIndex = masalar.findIndex(m => m.id === seciliMasaId);
        if (masaIndex !== -1) {
            masalar[masaIndex].status = 'Dolu';
            veriYaz('masalar', masalar);
            renderMasalar();
        }

        alert(`Masa ${modalMasaNo ? modalMasaNo.textContent : seciliMasaId} için siparişiniz alındı! Toplam: ${siparisTotal.toFixed(2)} TL`);
        sepet = {};
        seciliMasaId = null;
        kapatModal();
    }

    function kapatModal() {
        if(siparisModal) siparisModal.style.display = 'none';
        if(menuKategorilerDiv) menuKategorilerDiv.innerHTML = '';
        if(menuUrunlerDiv) menuUrunlerDiv.innerHTML = '';
        if(sepetListesiUl) sepetListesiUl.innerHTML = '';
        if(sepetToplamSpan) sepetToplamSpan.textContent = '0';
        seciliMasaId = null;
    }

    // --- Event Listener'lar ---
    if (closeModalBtn) closeModalBtn.addEventListener('click', kapatModal);
    if (siparisOnaylaBtn) siparisOnaylaBtn.addEventListener('click', siparisOnayla);
    if (sepetTemizleBtn) sepetTemizleBtn.addEventListener('click', sepetiTemizle);
    window.addEventListener('click', (event) => { if (event.target === siparisModal) kapatModal(); });

    // --- Sayfa İlk Yüklendiğinde ---
    renderMasalar();

}); // DOMContentLoaded Sonu