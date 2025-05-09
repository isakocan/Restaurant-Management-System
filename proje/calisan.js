document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elementleri ---
    const calisanGirisFormu = document.getElementById('calisan-giris-formu');
    const kullaniciAdiInput = document.getElementById('calisan-kullanici-adi'); // HTML'de type="email" olmalı
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
    let aktifCalisanData = null; // Firestore'dan gelen kullanıcı verisini (rol, username) saklamak için

    // --- YARDIMCI FONKSİYONLAR ---
    function ilkHarfiBuyut(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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


    function gosterHata(mesaj) {
        if (hataMesajiP) {
            hataMesajiP.textContent = mesaj;
            hataMesajiP.style.display = 'block';
        }
    }

    function girisBasariliArayuzunuGoster() {
    console.log(">>> girisBasariliArayuzunuGoster ÇAĞRILDI");
    if (calisanGirisFormu) {
        calisanGirisFormu.style.display = 'none';
        console.log(">>> calisanGirisFormu gizlendi."); // EK LOG
    } else {
        console.error(">>> calisanGirisFormu elementi bulunamadı!"); // EK LOG
    }
    if (calisanIcerikDiv) {
        calisanIcerikDiv.style.display = 'block';
        console.log(">>> calisanIcerikDiv gösterildi."); // EK LOG
    } else {
        console.error(">>> calisanIcerikDiv elementi bulunamadı!"); // EK LOG
    }
    if (calisanBilgiDiv) {
        calisanBilgiDiv.style.display = 'flex';
    }
}

    function cikisYapildiArayuzunuGoster() {
        console.log(">>> cikisYapildiArayuzunuGoster ÇAĞRILDI");
        if (calisanIcerikDiv) calisanIcerikDiv.style.display = 'none';
        if (calisanBilgiDiv) calisanBilgiDiv.style.display = 'none';
        if (calisanGirisFormu) calisanGirisFormu.style.display = 'block';
        if (kullaniciAdiInput) kullaniciAdiInput.value = '';
        if (sifreInput) sifreInput.value = '';
        // hataMesajiP'yi burada temizleme (Seçenek 1'e göre)
        if (bekleyenListesiUl) bekleyenListesiUl.innerHTML = '<li>Siparişleri görmek için giriş yapınız.</li>';
        if (alinanListesiUl) alinanListesiUl.innerHTML = '<li>Siparişleri görmek için giriş yapınız.</li>';
    }

    function addBekleyenSiparisListeners() {
        if (!bekleyenListesiUl) return;
        bekleyenListesiUl.querySelectorAll('.isleme-al-btn').forEach(btn => {
            btn.removeEventListener('click', islemeAl); // Öncekini kaldır
            btn.addEventListener('click', islemeAl);
        });
        bekleyenListesiUl.querySelectorAll('.detay-goster-btn').forEach(btn => {
            btn.removeEventListener('click', toggleDetay); // Öncekini kaldır
            btn.addEventListener('click', toggleDetay);
        });
    }

    function addAlinanSiparisListeners() {
        if (!alinanListesiUl) return;
        alinanListesiUl.querySelectorAll('.detay-goster-btn').forEach(btn => {
            btn.removeEventListener('click', toggleDetay); // Öncekini kaldır
            btn.addEventListener('click', toggleDetay);
        });
        alinanListesiUl.querySelectorAll('.odeme-yapildi-btn').forEach(btn => {
            btn.removeEventListener('click', odemeYapildi); // Öncekini kaldır
            btn.addEventListener('click', odemeYapildi);
        });
    }

    // --- ANA İŞLEV FONKSİYONLARI ---
    auth.onAuthStateChanged(async (user) => {
        console.log(">>> onAuthStateChanged tetiklendi, user:", user ? user.uid : null);
        if (user) {
            aktifCalisanAuth = user;
            aktifCalisanData = await getKullaniciData(user.uid); // getKullaniciData ortak.js'de olmalı

            if (aktifCalisanData && aktifCalisanData.role === 'Garson') {
                console.log(">>> Garson rolü doğrulandı. Arayüz gösteriliyor ve siparişler yükleniyor.");
                if (aktifCalisanAdiSpan) {
                    aktifCalisanAdiSpan.textContent = ilkHarfiBuyut(aktifCalisanData.username || user.email.split('@')[0]);
                }
                girisBasariliArayuzunuGoster();
                renderBekleyenSiparisler();
                renderAlinanSiparisler(); // Bunu da çağıralım
            } else {
                console.log(">>> Giriş reddedildi. Kullanıcı Firestore'da bulunamadı veya rolü Garson değil:", user.email);
                gosterHata("Bu hesapla garson olarak giriş yapma yetkiniz yok veya hesap bilgileriniz eksik.");
                await calisanCikisYapFirebase();
            }
        } else {
            aktifCalisanAuth = null;
            aktifCalisanData = null;
            cikisYapildiArayuzunuGoster();
        }
        if (girisYapBtn) girisYapBtn.disabled = !!(aktifCalisanAuth && aktifCalisanData && aktifCalisanData.role === 'Garson');
        if (cikisYapBtn) cikisYapBtn.disabled = !(aktifCalisanAuth && aktifCalisanData && aktifCalisanData.role === 'Garson');
    });

    async function calisanGirisYapFirebase() {
        // ... (Bu fonksiyon bir önceki mesajdaki gibi doğruydu, sadece hata mesajı temizleme eklenmişti) ...
        // ... (En üstte hataMesajiP temizleme kalsın) ...
        if (!kullaniciAdiInput || !sifreInput || !hataMesajiP) return;
        if (hataMesajiP) {
            hataMesajiP.textContent = '';
            hataMesajiP.style.display = 'none';
        }
        const email = kullaniciAdiInput.value.trim();
        const password = sifreInput.value;
        if (!email || !password) {
            gosterHata("E-posta ve şifre boş bırakılamaz.");
            return;
        }
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            console.log("Firebase'den giriş başarılı:", userCredential.user);
            kullaniciAdiInput.value = '';
            sifreInput.value = '';
        } catch (error) {
            console.error("Firebase giriş hatası:", error);
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-login-credentials') {
                gosterHata("E-posta veya şifre hatalı. Lütfen kontrol edip tekrar deneyin.");
            } else if (error.code === 'auth/invalid-email') {
                gosterHata("Lütfen geçerli bir e-posta adresi girin.");
            } else if (error.code === 'auth/too-many-requests') {
                gosterHata("Çok fazla hatalı giriş denemesi yapıldı. Lütfen daha sonra tekrar deneyin.");
            } else {
                gosterHata("Giriş sırasında bir sorun oluştu. Lütfen tekrar deneyin.");
            }
        }
    }

    async function calisanCikisYapFirebase() {
        // ... (Bu fonksiyon da doğruydu) ...
        try {
            await auth.signOut();
            console.log("Firebase'den çıkış yapıldı.");
        } catch (error) {
            console.error("Firebase çıkış hatası:", error);
            alert("Çıkış yapılırken bir hata oluştu.");
        }
    }

    function renderBekleyenSiparisler() {
        // ... (Bir önceki mesajdaki onSnapshot'lu hali doğruydu, onu kullan) ...
        // ... (Sadece addBekleyenSiparisListeners çağrısı kalacak) ...
        if (!bekleyenListesiUl || !aktifCalisanAuth) {
            if (bekleyenListesiUl) bekleyenListesiUl.innerHTML = '<li>Siparişleri görmek için giriş yapınız.</li>';
            return;
        }
        db.collection('activeOrders')
          .where('status', '==', 'Bekliyor')
          .orderBy('timestamp', 'asc')
          .onSnapshot(snapshot => {
            bekleyenListesiUl.innerHTML = '';
            if (snapshot.empty) {
                bekleyenListesiUl.innerHTML = '<li>Bekleyen sipariş yok.</li>';
                return;
            }
            let siparisNo = 1;
            snapshot.forEach(doc => {
                const siparis = { id: doc.id, ...doc.data() };
                const masaAdi = siparis.tableName || `Masa ID: ${siparis.tableId}`;
                const siparisZamani = siparis.timestamp ?
                                      siparis.timestamp.toDate().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) :
                                      'Bilinmiyor';
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${siparisNo}. Sipariş - ${masaAdi} - ${siparisZamani}</span>
                    <div class="siparis-actions">
                       <button class="detay-goster-btn btn-info" data-id="${siparis.id}">Detaylar</button>
                       <button class="isleme-al-btn btn-success" data-id="${siparis.id}">İşleme Al</button>
                    </div>
                    <div class="siparis-detay" data-id="${siparis.id}" style="display: none;"></div>
                `;
                bekleyenListesiUl.appendChild(li);
                siparisNo++;
            });
            addBekleyenSiparisListeners();
        }, error => {
            console.error("Firestore'dan bekleyen siparişler dinlenirken hata:", error);
            if (bekleyenListesiUl) bekleyenListesiUl.innerHTML = '<li>Bekleyen siparişler yüklenirken bir sorun oluştu.</li>';
        });
    }

    async function renderAlinanSiparisler() {
        if (!alinanListesiUl || !aktifCalisanAuth || !aktifCalisanData) { // aktifCalisanData da kontrol edilebilir
            if (alinanListesiUl) alinanListesiUl.innerHTML = '<li>Siparişleri görmek için giriş yapınız.</li>';
            return;
        }

        // Firestore'daki "activeOrders" koleksiyonunu DİNLE
        // Sadece "Alındı" durumundaki ve mevcut garsona ait siparişleri al
        db.collection('activeOrders')
          .where('status', '==', 'Alındı')
          .where('garsonId', '==', aktifCalisanAuth.uid) // Mevcut garsonun UID'si ile filtrele
          .orderBy('timestamp', 'asc')
          .onSnapshot(snapshot => {
            alinanListesiUl.innerHTML = ''; // Her güncellemede listeyi temizle

            if (snapshot.empty) {
                alinanListesiUl.innerHTML = '<li>Üzerinize aldığınız aktif sipariş yok.</li>';
                return;
            }

            let siparisNo = 1;
            snapshot.forEach(doc => {
                const siparis = { id: doc.id, ...doc.data() };
                const masaAdi = siparis.tableName || `Masa ID: ${siparis.tableId}`;
                const siparisZamani = siparis.timestamp ?
                                      siparis.timestamp.toDate().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) :
                                      'Bilinmiyor';
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${siparisNo}. Sipariş - ${masaAdi} - ${siparisZamani}</span>
                    <div class="siparis-actions">
                       <button class="detay-goster-btn btn-info" data-id="${siparis.id}">Detaylar</button>
                       <button class="odeme-yapildi-btn btn-warning" data-id="${siparis.id}">Ödeme Yapıldı</button>
                    </div>
                    <div class="siparis-detay" data-id="${siparis.id}" style="display: none;"></div>
                `;
                alinanListesiUl.appendChild(li);
                siparisNo++;
            });
            addAlinanSiparisListeners(); // Butonlara event listener'ları (yeniden) ekle
        }, error => {
            console.error("Firestore'dan alınan siparişler dinlenirken hata:", error);
            if (alinanListesiUl) alinanListesiUl.innerHTML = '<li>Alınan siparişler yüklenirken bir sorun oluştu.</li>';
        });
    }

    async function islemeAl(event) {
        if (!aktifCalisanAuth || !aktifCalisanData) {
            showToast("Giriş yapmanız gerekiyor", "warning")
            return;
        }
        const siparisDocId = event.target.dataset.id; // Bu Firestore döküman ID'si

        const siparisRef = db.collection('activeOrders').doc(siparisDocId);

        try {
            const garsonAdi = aktifCalisanData.username || aktifCalisanAuth.email.split('@')[0];
            await siparisRef.update({
                status: 'Alındı',
                garsonId: aktifCalisanAuth.uid, // Garsonun Firebase Auth UID'si
                garsonName: garsonAdi
            });
            console.log(`Sipariş ${siparisDocId} işleme alındı.`);
            // renderBekleyenSiparisler ve renderAlinanSiparisler onSnapshot ile otomatik güncellenecek.
        } catch (error) {
            console.error("Sipariş işleme alınırken Firestore hatası:", error);
            alert("Sipariş işleme alınırken bir hata oluştu.");
        }
    }

    async function odemeYapildi(event) {
    if (!aktifCalisanAuth) { // Giriş yapmış bir çalışan olmalı
        showToast("Giriş yapmanız gerekiyor", "warning")
        return;
    }
    const siparisDocId = event.target.dataset.id; // Ödenecek siparişin Firestore döküman ID'si (activeOrders'daki ID)

    const siparisRef = db.collection('activeOrders').doc(siparisDocId);

    try {
        const siparisSnap = await siparisRef.get(); // Önce siparişi activeOrders'dan oku

        if (!siparisSnap.exists) {
            showToast("Sipariş bulunamadı", "error")
            // Liste onSnapshot ile güncellendiği için, bu durum oluştuysa liste zaten boştur.
            // Bu yüzden burada ek bir render çağırmaya gerek yok.
            return;
        }

        const odenenSiparisTemelData = siparisSnap.data(); // Siparişin mevcut verilerini al

        // Ödenen sipariş için yeni bir obje oluşturup alanlarını güncelleyelim
        const tamamlanmisSiparisData = {
            ...odenenSiparisTemelData, // Mevcut tüm verileri kopyala (items, total, garsonId, garsonName vb.)
            originalActiveOrderId: siparisSnap.id, // Orijinal activeOrders döküman ID'sini referans olarak sakla (opsiyonel)
            status: 'Ödendi',                     // Durumu "Ödendi" yap
            paymentTimestamp: firebase.firestore.FieldValue.serverTimestamp() // Ödeme zamanını sunucu zamanı olarak ata
            // originalOrderId (bizim numerik ID'miz) zaten odenenSiparisTemelData içinde olmalı.
        };

        // 1. Tamamlanmış siparişi "completedOrders" koleksiyonuna YENİ BİR DÖKÜMAN olarak ekle
        //    Firestore bu yeni döküman için kendi benzersiz ID'sini üretecek.
        await db.collection('completedOrders').add(tamamlanmisSiparisData);
        console.log(`Sipariş (eski ID: ${siparisDocId}) completedOrders koleksiyonuna eklendi.`);

        // 2. Orijinal siparişi "activeOrders" koleksiyonundan SİL
        await siparisRef.delete();
        console.log(`Sipariş ${siparisDocId} activeOrders koleksiyonundan silindi.`);

        // 3. İlgili masanın durumunu Firestore'daki "tables" koleksiyonunda "Boş" olarak güncelle
        if (odenenSiparisTemelData.tableId) { // tableId sipariş verisinde olmalı
            const masaRef = db.collection('tables').doc(odenenSiparisTemelData.tableId);
            await masaRef.update({ status: 'Boş' });
            console.log(`Masa ${odenenSiparisTemelData.tableId} durumu Firestore'da 'Boş' olarak güncellendi.`);
        } else {
            console.warn(`Ödenen sipariş (eski ID: ${siparisDocId}) için tableId bulunamadı, masa durumu güncellenemedi.`);
        }

        alert(`Sipariş (ID: ${siparisDocId}) için ödeme alındı ve sipariş tamamlandı.`);
        // renderAlinanSiparisler (calisan.js) ve renderMasalar (app.js)
        // onSnapshot dinleyicileri sayesinde otomatik olarak güncellenecektir.

    } catch (error) {
        console.error("Ödeme yapılırken Firestore hatası:", error);
        alert("Ödeme işlemi sırasında bir hata oluştu. Lütfen konsolu kontrol edin.");
    }
}

    async function toggleDetay(event) {
    if (!aktifCalisanAuth) {
        alert("Detayları görmek için giriş yapmalısınız.");
        return;
    }
    const siparisDocId = event.target.dataset.id; // Bu Firestore döküman ID'si
    const buton = event.target;
    const liElement = buton.closest('li');
    if (!liElement) return;

    const detayDiv = liElement.querySelector(`.siparis-detay[data-id="${siparisDocId}"]`);
    if (!detayDiv) return;

    const isHidden = detayDiv.style.display === 'none';

    if (isHidden) {
        try {
            const siparisSnap = await db.collection('activeOrders').doc(siparisDocId).get();
            if (siparisSnap.exists) {
                const siparis = siparisSnap.data();
                let detayHtml = '<h4>Sipariş İçeriği:</h4><ul>';
                if (siparis.items && siparis.items.length > 0) {
                    siparis.items.forEach(item => {
                        // item.name ve item.price sipariş dökümanında zaten var (denormalizasyon sayesinde)
                        const itemTotal = (item.quantity || 0) * (item.price || 0);
                        detayHtml += `<li>${item.quantity || '?'}x ${item.name} (${(item.price || 0).toFixed(2)} TL/adet) = ${itemTotal.toFixed(2)} TL</li>`;
                    });
                } else {
                    detayHtml += '<li>Sipariş içeriği boş.</li>';
                }
                detayHtml += '</ul>';
                detayHtml += `<p style="text-align:right; font-weight:bold;">Toplam Tutar: ${(siparis.total || 0).toFixed(2)} TL</p>`;
                detayDiv.innerHTML = detayHtml;
                detayDiv.style.display = 'block';
                buton.textContent = 'Gizle';
            } else {
                detayDiv.innerHTML = '<p>Sipariş detayları bulunamadı.</p>';
                detayDiv.style.display = 'block'; // Hata mesajını göstermek için
                buton.textContent = 'Gizle'; // Buton metnini yine de değiştir
            }
        } catch (error) {
            console.error("Sipariş detayı çekilirken Firestore hatası:", error);
            detayDiv.innerHTML = '<p>Sipariş detayları yüklenemedi.</p>';
            detayDiv.style.display = 'block';
            buton.textContent = 'Gizle';
        }
    } else {
        detayDiv.style.display = 'none';
        buton.textContent = 'Detaylar';
    }
}

    // --- Event Listener'lar ---
    if (girisYapBtn) girisYapBtn.addEventListener('click', calisanGirisYapFirebase);
    if (sifreInput) {
        sifreInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') calisanGirisYapFirebase();
        });
    }
    if (cikisYapBtn) cikisYapBtn.addEventListener('click', calisanCikisYapFirebase);

}); // DOMContentLoaded Sonu