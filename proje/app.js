// app.js (TAMAMI - Güncellenmiş Hali)
function toLowerTurkce(str) {
    const harfler = {
        'İ': 'i', 'I': 'ı', 'Ş': 'ş', 'Ğ': 'ğ',
        'Ü': 'ü', 'Ö': 'ö', 'Ç': 'ç'
    };
    return str
        .split('')
        .map(k => harfler[k] || k)
        .join('')
        .toLowerCase();
}
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.classList.add('toast', type);
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}


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
    const menuAraInput = document.getElementById("menu-ara-input");

    let seciliMasaId = null;
    let sepet = {};

    function renderMasalar() {
    const masaAlani = document.getElementById('masa-alani');
    if (!masaAlani) return;

    // Firestore'daki "tables" koleksiyonunu DİNLE (gerçek zamanlı güncellemeler için)
    // İsme göre sıralayalım (veya ID'ye göre de olabilir: .orderBy(firebase.firestore.FieldPath.documentId()))
    db.collection('tables').orderBy('name').onSnapshot(snapshot => {
        masaAlani.innerHTML = ''; // Her güncellemede alanı temizle

        if (snapshot.empty) {
            masaAlani.innerHTML = '<p>Gösterilecek masa bulunamadı.</p>';
            return;
        }

        snapshot.forEach(doc => {
            const masa = { id: doc.id, ...doc.data() }; // doc.id zaten string masa ID'miz

            const masaDiv = document.createElement('div');
            masaDiv.classList.add('masa');
            masaDiv.textContent = masa.name;
            masaDiv.dataset.id = masa.id; // dataset.id olarak string masa ID'sini ata

            if (masa.isActive === false) { // Eğer masa aktif değilse (kullanım dışı)
                masaDiv.classList.add('masa-pasif'); // Yeni bir CSS sınıfı ekleyelim
                masaDiv.title = "Bu masa geçici olarak kullanım dışıdır.";
                // masaDiv.style.cursor = 'not-allowed'; // Zaten tıklama event'i eklemeyeceğiz
            } else {
                // Masa aktifse, durumuna göre stil ve tıklama olayı ekle
                if (masa.status === 'Boş') {
                    masaDiv.classList.add('masa-bos');
                    masaDiv.addEventListener('click', masaTiklandi); // masaTiklandi fonksiyonun hala var olmalı
                } else { // Dolu veya başka bir durum (Rezerve vb. eklersen)
                    masaDiv.classList.add('masa-dolu');
                    masaDiv.style.cursor = 'not-allowed';
                }
            }
            masaAlani.appendChild(masaDiv);
        });
    }, error => {
        console.error("Firestore'dan masalar dinlenirken hata:", error);
        masaAlani.innerHTML = '<p>Masalar yüklenirken bir sorun oluştu.</p>';
    });
}

    function masaTiklandi(event) {
        seciliMasaId = event.target.dataset.id;
        db.collection('tables').doc(seciliMasaId).get().then(docSnap => {
        if (docSnap.exists) {
            const masaAdi = docSnap.data().name;
            if (modalMasaNo) modalMasaNo.textContent = masaAdi;
        } else {
            if (modalMasaNo) modalMasaNo.textContent = `ID: ${seciliMasaId}`;
        }
    }).catch(error => {
        console.error("Masa adı çekilirken hata:", error);
        if (modalMasaNo) modalMasaNo.textContent = `ID: ${seciliMasaId}`;
    });

    sepet = {};
    renderSepet(); // Bu zaten async ve Firestore'dan menüyü okuyor
    renderKategoriler(); // Bu da async ve Firestore'dan menüyü okuyor
    if (menuUrunlerDiv) menuUrunlerDiv.innerHTML = '';
    if (siparisModal) siparisModal.style.display = 'block';
}

    async function renderKategoriler() { // async yaptık
        // const menu = veriOku('menu', []); // ESKİ: localStorage'dan okuma
        let menu = []; // YENİ: Firestore'dan gelen menü burada olacak
        try {
            const menuSnapshot = await db.collection('menuItems').orderBy('category').orderBy('name').get(); // Kategori ve isme göre sırala
            menuSnapshot.forEach(doc => {
                menu.push({ id: doc.data().productId, firestoreDocId: doc.id, ...doc.data()});
            });
        } catch (error) {
            console.error("Firestore'dan menü okunurken hata:", error);
            if (menuKategorilerDiv) menuKategorilerDiv.innerHTML = '<p>Menü yüklenemedi.</p>';
            if (menuUrunlerDiv) menuUrunlerDiv.innerHTML = '';
            return;
        }
        const kategoriler = [...new Set(menu.map(urun => urun.category))].sort(); // Sıralama zaten Firestore'dan geldi ama emin olmak için
    if (!menuKategorilerDiv) return;
    menuKategorilerDiv.innerHTML = '';
    kategoriler.forEach((kategori, index) => {
        const kategoriBtn = document.createElement('button');
        kategoriBtn.textContent = kategori;
        kategoriBtn.classList.add('kategori-btn');
        kategoriBtn.addEventListener('click', () => kategoriSecildi(kategori, menu)); // YENİ: menüyü de gönder
        menuKategorilerDiv.appendChild(kategoriBtn);
        if (index === 0 && kategoriler.length > 0) { // Kategori varsa ilkini seç
            kategoriSecildi(kategori, menu); // YENİ: menüyü de gönder
            kategoriBtn.classList.add('aktif');
        }
    });
    if (kategoriler.length === 0 && menuKategorilerDiv) {
        menuKategorilerDiv.innerHTML = '<p>Menüde kategori bulunamadı.</p>';
    }
    }

    function kategoriSecildi(kategoriAdi, menu) { // YENİ: menu parametresi eklendi
        document.querySelectorAll('.kategori-btn').forEach(btn => {
            btn.classList.remove('aktif');
            if (btn.textContent === kategoriAdi) {
                btn.classList.add('aktif');
            }
        });

        const aramaKelimesi = menuAraInput?.value ? toLowerTurkce(menuAraInput.value) : '';
        let urunler = menu.filter(urun => urun.category === kategoriAdi);

        if (aramaKelimesi) {
            urunler = urunler.filter(urun =>
            toLowerTurkce(urun.name).includes(aramaKelimesi)
            );
        }

        // const menu = veriOku('menu'); // ESKİ: localStorage'dan okuma - ARTIK PARAMETRE OLARAK GELİYOR
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

    async function renderSepet() { // async yaptık
        if (!sepetListesiUl || !sepetToplamSpan) return;
        sepetListesiUl.innerHTML = '';
        let toplamTutar = 0;
        // const menu = veriOku('menu'); // ESKİ: localStorage'dan okuma
    
        let menu = []; // YENİ: Firestore'dan gelen menü burada olacak
        try {
            const menuSnapshot = await db.collection('menuItems').get();
            menuSnapshot.forEach(doc => {
            menu.push({ id: doc.data().productId, firestoreDocId: doc.id, ...doc.data()});});
        } catch (error) {
            console.error("Sepet için Firestore'dan menü okunurken hata:", error);
            sepetListesiUl.innerHTML = '<li>Sepet yüklenirken bir hata oluştu.</li>';
            return;
        }
    
        for (const urunIdStr in sepet) { // urunId string olarak gelebilir sepet objesinden
            const urunId = parseInt(urunIdStr);
            const adet = sepet[urunId];
            if (adet <= 0) continue;
            const urun = menu.find(u => u.id === urunId); // Firestore'dan çektiğimiz menüden bul
            if (!urun) {
                console.warn(`Sepetteki ürün menüde bulunamadı: ID ${urunId}`);
                continue;
            }
            // ... (fonksiyonun geri kalanı aynı) ...
            const li = document.createElement('li');
            const itemToplam = adet * urun.price;
            toplamTutar += itemToplam;
            li.innerHTML = `
                ${adet}x ${urun.name} (${urun.price.toFixed(2)} TL/adet) = ${itemToplam.toFixed(2)} TL
                <button class="sepetten-cikar-btn" data-id="${urunId}">Çıkar</button>
            `;
            const cikarBtn = li.querySelector('.sepetten-cikar-btn');
            if(cikarBtn) cikarBtn.addEventListener('click', sepettenCikar); // sepettenCikar async değil, olabilir.
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

    
    async function siparisOnayla() {
    if (Object.keys(sepet).length === 0 || seciliMasaId === null) {
        showToast("Sepetiniz boş!", "warning");

        return;
    }

    // Gerekli verileri hazırla
    const masaDocId = seciliMasaId; // Bu, masanın Firestore döküman ID'si (string)
    let masaAdiText = `Masa ${masaDocId}`; // Varsayılan
    if (modalMasaNo && modalMasaNo.textContent && !modalMasaNo.textContent.includes(`ID: ${masaDocId}`)) {
        masaAdiText = modalMasaNo.textContent.replace(' - Menü', '').trim();
    } else {
        // Eğer modalMasaNo'da isim yoksa veya ID içeriyorsa, Firestore'dan çekelim
        try {
            const masaSnap = await db.collection('tables').doc(masaDocId).get();
            if (masaSnap.exists) {
                masaAdiText = masaSnap.data().name;
            }
        } catch (error) {
            console.warn("Sipariş için masa adı çekilirken hata:", error);
        }
    }


    let menu = []; // Menüyü Firestore'dan çekelim
    try {
        const menuSnapshot = await db.collection('menuItems').get();
        menuSnapshot.forEach(doc => {
            menu.push({
                id: doc.data().productId, // Numerik productId'yi 'id' olarak alıyoruz
                firestoreDocId: doc.id,
                ...doc.data()
            });
        });
    } catch (error) {
        console.error("Sipariş onayı için Firestore'dan menü okunurken hata:", error);
        showToast("Sipariş oluşturulurken menü hatası oluştu. Lütfen tekrar deneyin.", "error");

        return;
    }

    let siparisTotal = 0;
    const siparisItems = []; // Firestore'a yazılacak ürünler dizisi

    for (const urunIdStr in sepet) { // Sepetteki productId'ler
        const productId = parseInt(urunIdStr);
        const adet = sepet[productId];
        const urun = menu.find(u => u.id === productId); // Kendi productId'mizle eşleştir

        if (urun && adet > 0) {
            siparisItems.push({
                productId: urun.id, // Kendi numerik ID'miz
                menuItemDocId: urun.firestoreDocId, // Ürünün Firestore döküman ID'si (opsiyonel)
                name: urun.name,    // Ürün adı (denormalizasyon)
                quantity: adet,
                price: urun.price   // Ürünün o anki fiyatı (denormalizasyon)
            });
            siparisTotal += adet * urun.price;
        } else {
            console.warn(`Sepetteki ürün (ID: ${productId}) menüde bulunamadı veya adet 0.`);
        }
    }

    if (siparisItems.length === 0) {
        showToast("Siparişinizde geçerli ürün bulunamadı!", "warning");

        return;
    }

    const yeniSiparisData = {
        originalOrderId: yeniIdUret(), // ortak.js'den kendi benzersiz numerik ID'miz
        tableId: masaDocId,            // Masanın Firestore DÖKÜMAN ID'si
        tableName: masaAdiText,        // Masa adı (denormalizasyon)
        items: siparisItems,
        total: siparisTotal,
        status: 'Bekliyor',            // İlk durum
        timestamp: firebase.firestore.FieldValue.serverTimestamp(), // Firestore sunucu zamanı
        garsonId: null,                // Henüz bir garson almadı
        garsonName: null               // Henüz bir garson almadı
        // paymentTimestamp: null     // Ödendiğinde eklenecek
    };

    try {
        // Yeni siparişi Firestore'daki "activeOrders" koleksiyonuna ekle
        const docRef = await db.collection('activeOrders').add(yeniSiparisData);
        console.log("Yeni sipariş Firestore'a eklendi, ID: ", docRef.id);

        // Masa durumunu Firestore'da "Dolu" olarak güncelle
        const masaRef = db.collection('tables').doc(masaDocId);
        await masaRef.update({ status: 'Dolu' });
        console.log(`Masa ${masaDocId} durumu Firestore'da 'Dolu' olarak güncellendi.`);

        showToast(`${masaAdiText} için siparişiniz alındı!`, "success");

        sepet = {}; // Sepeti javascript tarafında boşalt
        // seciliMasaId = null; // kapatModal içinde yapılıyor
        kapatModal(); // Modal'ı kapat ve sepeti/arayüzü temizle

    } catch (error) {
        console.error("Firestore'a sipariş yazılırken veya masa güncellenirken hata: ", error);
        showToast("Siparişiniz oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.", "error");

    }
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
    if (menuAraInput) {
        menuAraInput.addEventListener('input', async () => {
            const aktifKategoriBtn = document.querySelector('.kategori-btn.aktif');
            if (aktifKategoriBtn) {
            // Tekrar kategoriSecildi çağır, ama menü verisi async geldiği için önce çek
            const menuSnapshot = await db.collection('menuItems').get();
            const menu = [];
            menuSnapshot.forEach(doc => {
                menu.push({ id: doc.data().productId, firestoreDocId: doc.id, ...doc.data() });
            });
            kategoriSecildi(aktifKategoriBtn.textContent, menu);
        }
    });
}

    // --- Sayfa İlk Yüklendiğinde ---
    renderMasalar();

}); // DOMContentLoaded Sonu