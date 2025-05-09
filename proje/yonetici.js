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
    // const yoneticiProfilGuncellemeSection = document.getElementById('yonetici-profil-guncelleme'); // Kullanılmıyor gibi
    const guncelSifreInput = document.getElementById('guncel-sifre');
    const guncelYeniKullaniciAdiInput = document.getElementById('guncel-yeni-kullanici-adi');
    const guncelYeniSifreInput = document.getElementById('guncel-yeni-sifre');
    const profilGuncelleBtn = document.getElementById('profil-guncelle-btn');
    const profilGuncelleMesajP = document.getElementById('profil-guncelle-mesaj');

    // Kullanıcı (Garson) Yönetimi
    // const kullaniciYonetimiSection = document.getElementById('kullanici-yonetimi'); // Kullanılmıyor gibi
    const kullaniciEditIdInput = document.getElementById('kullanici-edit-id');
    const yeniKullaniciAdiInput = document.getElementById('yeni-kullanici-adi');
    const yeniSifreInput = document.getElementById('yeni-sifre');
    const kullaniciKaydetBtn = document.getElementById('kullanici-kaydet-btn');
    const kullaniciFormTemizleBtn = document.getElementById('kullanici-form-temizle-btn');
    const kullaniciListesiUl = document.getElementById('kullanici-listesi');
    const yeniGarsonEmailInput = document.getElementById('yeni-kullanici-email');

    // Masa Yönetimi
    // const masaYonetimiSection = document.getElementById('masa-yonetimi'); // Kullanılmıyor gibi
    const masaEditIdInput = document.getElementById('masa-edit-id');
    const masaAdiInput = document.getElementById('masa-adi');
    const masaAktifMiSelect = document.getElementById('masa-aktif-mi');
    const masaKaydetBtn = document.getElementById('masa-kaydet-btn');
    const masaFormTemizleBtn = document.getElementById('masa-form-temizle-btn');
    const masaListesiUl = document.getElementById('masa-listesi-yonetici');

    // Menü Yönetimi
    // const menuYonetimiSection = document.getElementById('menu-yonetimi'); // Kullanılmıyor gibi
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
    // const satisRaporlamaSection = document.getElementById('satis-raporlama'); // Kullanılmıyor gibi
    const raporTarihInput = document.getElementById('rapor-tarih'); // Bu global kalabilir, fonksiyon içinde kontrol ediliyor
    const raporGosterBtn = document.getElementById('rapor-goster-btn');
    const tumRaporGosterBtn = document.getElementById('tum-rapor-goster-btn');
    const raporSonucDiv = document.getElementById('rapor-sonuc'); // Bu global kalabilir
    const raporTarihBaslikSpan = document.getElementById('rapor-tarih-baslik'); // Bu global kalabilir
    const raporSiparisListesiUl = document.getElementById('rapor-siparis-listesi'); // Bu global kalabilir
    const raporToplamCiroSpan = document.getElementById('rapor-toplam-ciro'); // Bu global kalabilir
    const raporUrunAdetleriUl = document.getElementById('rapor-urun-adetleri'); // Bu global kalabilir

    const toggleYeniSifreBtn = document.getElementById('toggle-yeni-sifre-gorunurluk');
    if (toggleYeniSifreBtn && yeniSifreInput) {
        toggleYeniSifreBtn.addEventListener('click', () => {
        if (yeniSifreInput.type === 'password') {
            yeniSifreInput.type = 'text';
            toggleYeniSifreBtn.textContent = 'Gizle';
        } else {
            yeniSifreInput.type = 'password';
            toggleYeniSifreBtn.textContent = 'Göster';
        }
    });
}



    // --- Uygulama Durumu ---
    let aktifYoneticiAuth = null;

    // --- YARDIMCI FONKSİYONLAR ---
    function ilkHarfiBuyut(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

   window.showToast = function(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) {
        console.warn("toast-container bulunamadı!");
        return;
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
};



    function yoneticiGosterHata(mesaj) {
        showToast(mesaj, "error");
    }

    function yoneticiGirisBasariliArayuzunuGoster() {
        if (yoneticiGirisFormu) yoneticiGirisFormu.style.display = 'none';
        if (yonetimIcerik) yonetimIcerik.style.display = 'block';
        if (yoneticiBilgiDiv) yoneticiBilgiDiv.style.display = 'flex';
        if (guncelYeniKullaniciAdiInput && aktifYoneticiAuth) {
            guncelYeniKullaniciAdiInput.value = ilkHarfiBuyut(aktifYoneticiAuth.email.split('@')[0]);
        }
        if (guncelSifreInput) guncelSifreInput.value = '';
        if (guncelYeniSifreInput) guncelYeniSifreInput.value = '';
        if (profilGuncelleMesajP) {
            showToast("Giriş yapıldı!", "success");

        }
         if (yoneticiGirisHataMesaji) { // Başarılı girişte hata mesajını temizle
            yoneticiGirisHataMesaji.textContent = '';
            yoneticiGirisHataMesaji.style.display = 'none';
        }
            // Event listener'ları burada bağla (butonlar artık DOM'da mevcut)
        if (kullaniciKaydetBtn) kullaniciKaydetBtn.addEventListener('click', kullaniciKaydet);
        if (kullaniciFormTemizleBtn) kullaniciFormTemizleBtn.addEventListener('click', kullaniciFormunuTemizle);

        if (kullaniciListesiUl && kullaniciListesiUl.innerHTML.includes("giriş yapınız")) {
          kullaniciListesiUl.innerHTML = '';
        }
        if (masaListesiUl && masaListesiUl.innerHTML.includes("giriş yapınız")) {
          masaListesiUl.innerHTML = '';
        }
        if (menuListesiYoneticiDiv && menuListesiYoneticiDiv.innerHTML.includes("giriş yapınız")) {
          menuListesiYoneticiDiv.innerHTML = '';
        }
        if (raporSonucDiv && raporSonucDiv.innerHTML.includes("giriş yapınız")) {
          raporSonucDiv.innerHTML = '';
        }
    }

    function yoneticiCikisYapildiArayuzunuGoster() {
        if (yonetimIcerik) yonetimIcerik.style.display = 'none';
        if (yoneticiBilgiDiv) yoneticiBilgiDiv.style.display = 'none';
        if (yoneticiGirisFormu) yoneticiGirisFormu.style.display = 'block';
        if (yoneticiKullaniciAdiInput) yoneticiKullaniciAdiInput.value = '';
        if (yoneticiSifreInput) yoneticiSifreInput.value = '';
        // Hata mesajı burada temizlenmiyor (Seçenek 1'e göre)
        if (kullaniciListesiUl) kullaniciListesiUl.innerHTML = '<li>Garsonları görmek için giriş yapınız.</li>';
        if (menuListesiYoneticiDiv) menuListesiYoneticiDiv.innerHTML = '<p>Menüyü görmek için giriş yapınız.</p>';
        if (masaListesiUl) masaListesiUl.innerHTML = '<li>Masaları görmek için giriş yapınız.</li>';
        if (raporSonucDiv) raporSonucDiv.innerHTML = '<h3>Raporları görmek için giriş yapınız.</h3>';
    }

    // --- ANA İŞLEV FONKSİYONLARI ---
    auth.onAuthStateChanged(async (user) => {
        console.log(">>> YONETICI onAuthStateChanged - Gelen User Emaili:", user ? user.email : "Kullanıcı Yok");
        let isValidYonetici = false;
        if (user) {
            aktifYoneticiAuth = user;
            console.log(">>> YONETICI getKullaniciData çağrılıyor, UID:", user.uid);
            const yoneticiDataFromFirestore = await getKullaniciData(user.uid); // ortak.js'den

            if (yoneticiDataFromFirestore && yoneticiDataFromFirestore.role === 'Yonetici') {
                isValidYonetici = true;
                if (yoneticiAdiSpan) {
                    yoneticiAdiSpan.textContent = ilkHarfiBuyut(yoneticiDataFromFirestore.username || user.email.split('@')[0]);
                }
                yoneticiGirisBasariliArayuzunuGoster();
                kullanicilariYukle(); // localStorage kullanıyor (sonra güncellenecek)
                menuyuYukleYonetici(); // Firestore kullanıyor
                masalariYukleYonetici(); // Firestore kullanıyor
                
                if (raporTarihInput) {
                  setTimeout(() => {
                    raporTarihInput.valueAsDate = new Date();
                    setTimeout(() => {
                      raporGoster();
                    }, 100);
                  }, 100);
                }


            } else {
                console.log("Giriş reddedildi (Yönetici). Kullanıcı Firestore'da bulunamadı veya rolü Yonetici değil:", user.email);
                yoneticiGosterHata("Bu hesapla yönetici olarak giriş yapma yetkiniz yok veya hesap bilgileriniz eksik.");
                await yoneticiCikisYapFirebase();
            }
        } else {
            aktifYoneticiAuth = null;
            isValidYonetici = false;
            yoneticiCikisYapildiArayuzunuGoster();
        }
        if (yoneticiGirisYapBtn) yoneticiGirisYapBtn.disabled = isValidYonetici;
        if (yoneticiCikisYapBtn) yoneticiCikisYapBtn.disabled = !isValidYonetici;
    });

    async function yoneticiGirisYapFirebase() {
        if (!yoneticiKullaniciAdiInput || !yoneticiSifreInput || !yoneticiGirisHataMesaji) return;
        if (yoneticiGirisHataMesaji) { // Her yeni giriş denemesinde önceki hatayı temizle
            yoneticiGirisHataMesaji.textContent = '';
            yoneticiGirisHataMesaji.style.display = 'none';
        }
        const email = yoneticiKullaniciAdiInput.value.trim();
        const password = yoneticiSifreInput.value;
        if (!email || !password) {
            yoneticiGosterHata("E-posta ve şifre boş bırakılamaz.");
            return;
        }
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            console.log("Firebase'den yönetici girişi başarılı:", userCredential.user);
            yoneticiKullaniciAdiInput.value = '';
            yoneticiSifreInput.value = '';
        } catch (error) {
            console.error("Firebase yönetici giriş hatası:", error);
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-login-credentials') {
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

    async function yoneticiCikisYapFirebase() {
        try {
            await auth.signOut();
            console.log("Firebase'den yönetici çıkışı yapıldı.");
        } catch (error) {
            console.error("Firebase yönetici çıkış hatası:", error);
            showToast("Çıkış yapılırken bir hata oluştu.", "error");
    
        }
    }

    // --- Profil Güncelleme (localStorage kullanıyor - SONRA GÜNCELLENECEK) ---
    async function profilGuncelle() {
    if (!aktifYoneticiAuth) {
        showToast("Bu işlemi yapmak için giriş yapmalısınız.", "error");
        return;
    }

    const mevcutSifre = guncelSifreInput?.value;
    const yeniKullaniciAdi = guncelYeniKullaniciAdiInput?.value.trim();
    const yeniSifre = guncelYeniSifreInput?.value;

    if (!mevcutSifre || !yeniKullaniciAdi) {
        showToast("Lütfen gerekli alanları doldurunuz.", "error");
        return;
    }

    const credential = firebase.auth.EmailAuthProvider.credential(
        aktifYoneticiAuth.email,
        mevcutSifre
    );

    try {
        await aktifYoneticiAuth.reauthenticateWithCredential(credential);

        // Şifre değiştirilecekse
        if (yeniSifre) {
            await aktifYoneticiAuth.updatePassword(yeniSifre);
        }

        // Firestore'da kullanıcı adı güncelle
        const userDocRef = db.collection("users").doc(aktifYoneticiAuth.uid);
        await userDocRef.update({
            username: yeniKullaniciAdi
        });

        showToast("Profil başarıyla güncellendi. Lütfen tekrar giriş yapın.", "success");

        // Oturumu sonlandır
        setTimeout(() => {
            auth.signOut().then(() => {
        setTimeout(() => location.reload(), 1000);
    });
        }, 2000);

    } catch (error) {
        console.error("Profil güncelleme hatası:", error);
        if (error.code === "auth/wrong-password") {
            showToast("Mevcut şifre hatalı.", "error");
        } else {
            showToast("Profil güncellenemedi. Lütfen tekrar deneyin.", "error");
        }
    }
}

    // --- Kullanıcı (Garson) Yönetimi (localStorage kullanıyor - SONRA GÜNCELLENECEK) ---
    function kullaniciFormunuTemizle() { /* ... mevcut kodun ... */ }
async function kullanicilariYukle() {
    if (!kullaniciListesiUl || !aktifYoneticiAuth) {
        if (kullaniciListesiUl) kullaniciListesiUl.innerHTML = '<li>Garsonları görmek için giriş yapınız.</li>';
        return;
    }

    try {
        // Firestore'dan rolü "Garson" olan kullanıcıları çek, kullanıcı adına göre sırala
        const querySnapshot = await db.collection('users')
                                    .where('role', '==', 'Garson')
                                    .orderBy('username', 'asc')
                                    .get();

        kullaniciListesiUl.innerHTML = ''; // Listeyi temizle

        if (querySnapshot.empty) {
            kullaniciListesiUl.innerHTML = '<li>Kayıtlı garson bulunmuyor.</li>';
            return;
        }

        querySnapshot.forEach(doc => {
            const garson = { uid: doc.id, ...doc.data() }; // doc.id garsonun UID'si
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${garson.username || garson.email} (E-posta: ${garson.email})</span>
                
            `;
            kullaniciListesiUl.appendChild(li);
        });
    } catch (error) {
        console.error("Firestore'dan garsonlar yüklenirken hata:", error);
        if (error.message.includes("indexes")) {
             showToast("Garsonları listelemek için Firestore indeksi gerekiyor. Detaylar için konsolu kontrol et.", "warning");

        }
        if (kullaniciListesiUl) kullaniciListesiUl.innerHTML = '<li>Garsonlar yüklenirken bir hata oluştu.</li>';
    }
}    

  


async function kullaniciKaydet() {
    if (!aktifYoneticiAuth) {
        showToast("Bu işlemi yapmak için giriş yapmalısınız.", "error");
        return;
    }

    const editUID = kullaniciEditIdInput.value; // Düzenlenen garsonun UID'si (varsa)
    const username = yeniKullaniciAdiInput.value.trim();
    const email = ""; // Yeni garson eklerken e-posta formdan alınmalı! Şimdilik boş bırakıyorum.
                       // HTML formuna bir e-posta input'u eklemen GEREKECEK.
                       // Örneğin: <label for="yeni-kullanici-email">E-posta:</label>
                       //          <input type="email" id="yeni-kullanici-email" />
                       // Ve JS'de: const email = document.getElementById('yeni-kullanici-email').value.trim();

    const password = yeniSifreInput.value;

    if (!username) {
        showToast("Garson adı (kullanıcı adı) boş bırakılamaz.", "error");

        return;
    }

    // YENİ GARSON EKLEME DURUMU
     if (!editUID) { // YENİ GARSON EKLEME
        if (!yeniGarsonEmailInput) {
            showToast("Garson e-posta input'u bulunamadı. Lütfen HTML'i kontrol edin.", "error");

            return;
        }
        const emailForNewUser = yeniGarsonEmailInput.value.trim();

        if (!emailForNewUser || !password) {
           showToast("Yeni garson için e-posta ve şifre boş bırakılamaz.", "error");

            return;
        }

        try {
            const userCredential = await auth.createUserWithEmailAndPassword(emailForNewUser, password);
            const newGarsonUID = userCredential.user.uid;
            console.log("Yeni garson Auth'a eklendi, UID:", newGarsonUID);

            // 2. Firestore 'users' koleksiyonuna garson bilgilerini kaydet
            await db.collection('users').doc(newGarsonUID).set({
                username: username,
                email: emailForNewUser,
                role: 'Garson',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log("Yeni garson bilgileri Firestore'a eklendi.");
            
            showToast("Yeni garson başarıyla eklendi. Güvenlik nedeniyle tekrar giriş yapmanız gerekiyor.", "info");
            setTimeout(() => {
                auth.signOut().then(() => location.reload());
            }, 5000);

            kullanicilariYukle(); // Listeyi YENİLE (Bu önemli!)
            kullaniciFormunuTemizle(); // Formu temizle (Bu yeni e-posta ve şifre inputlarını da temizlemeli)

            // OTURUM DEĞİŞİKLİĞİ OLDUĞU İÇİN, YÖNETİCİNİN TEKRAR GİRİŞ YAPMASI GEREKEBİLİR.
            // BU DURUMDA auth.onAuthStateChanged YÖNETİCİYİ GİRİŞ EKRANINA YÖNLENDİRECEKTİR.
            // KULLANICIYA BU KONUDA BİLGİ VERMEK İYİ OLABİLİR.
            // ŞİMDİLİK, SADECE LİSTEYİ YENİLİYORUZ.
            // Eğer onAuthStateChanged yöneticiyi atarsa, bu beklenen bir davranış olacak bu yaklaşımla.

        } catch (error) {
            console.error("Yeni garson eklenirken hata:", error);
            let hataMesajiKullaniciya = "Yeni garson eklenirken bir hata oluştu. Lütfen tekrar deneyin.";
            if (error.code === 'auth/email-already-in-use') {
                hataMesajiKullaniciya = "Bu e-posta adresi zaten başka bir kullanıcı tarafından kullanılıyor. Lütfen farklı bir e-posta adresi deneyin.";
            } else if (error.code === 'auth/weak-password') {
                hataMesajiKullaniciya = "Şifre çok zayıf. Lütfen en az 6 karakterli bir şifre girin.";
            } else if (error.code === 'auth/invalid-email') {
                hataMesajiKullaniciya = "Lütfen geçerli bir e-posta formatı girin.";
            }
            showToast(hataMesajiKullaniciya,"eror");
        }
    }
    // --- BU BLOK DEĞİŞTİ ---
    
}



// --- Masa Yönetimi (Firestore kullanıyor) ---
// --- Masa Yönetimi (Firestore kullanıyor) ---
function masaFormunuTemizle() {
    if (masaEditIdInput) masaEditIdInput.value = '';
    if (masaAdiInput) masaAdiInput.value = '';
    if (masaAktifMiSelect) masaAktifMiSelect.value = 'true';
    if (masaKaydetBtn) masaKaydetBtn.textContent = 'Kaydet';
}

async function masalariYukleYonetici() {
    if (!masaListesiUl || !aktifYoneticiAuth) {
        if (masaListesiUl) masaListesiUl.innerHTML = '<li>Masaları görmek için giriş yapınız.</li>';
        return;
    }

    try {
        const querySnapshot = await db.collection('tables').orderBy('name').get();
        masaListesiUl.innerHTML = '';

        if (querySnapshot.empty) {
            masaListesiUl.innerHTML = '<li>Kayıtlı masa bulunmuyor.</li>';
            return;
        }

        querySnapshot.forEach(doc => {
            const masa = doc.data();
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${masa.name} (${masa.isActive ? 'Aktif' : 'Pasif'})</span>
                <div>
                    <button class="masa-duzenle-btn btn-warning" data-id="${doc.id}">Düzenle</button>
                    <button class="masa-sil-btn btn-danger" data-id="${doc.id}">Sil</button>
                </div>
            `;
            masaListesiUl.appendChild(li);
        });
        addMasaButtonListeners();
    } catch (error) {
        console.error("Masalar yüklenirken hata:", error);
        masaListesiUl.innerHTML = '<li>Masalar yüklenemedi.</li>';
    }
}

function addMasaButtonListeners() {
    if (!masaListesiUl) return;
    masaListesiUl.querySelectorAll('.masa-duzenle-btn').forEach(btn => {
        btn.removeEventListener('click', masaDuzenleFormunuDoldur);
        btn.addEventListener('click', masaDuzenleFormunuDoldur);
    });
    masaListesiUl.querySelectorAll('.masa-sil-btn').forEach(btn => {
        btn.removeEventListener('click', masaSil);
        btn.addEventListener('click', masaSil);
    });
}

async function masaDuzenleFormunuDoldur(event) {
    const id = event.target.dataset.id;
    try {
        const docSnap = await db.collection('tables').doc(id).get();
        if (docSnap.exists) {
            const masa = docSnap.data();
            if (masaEditIdInput) masaEditIdInput.value = id;
            if (masaAdiInput) masaAdiInput.value = masa.name;
            if (masaAktifMiSelect) masaAktifMiSelect.value = masa.isActive ? 'true' : 'false';
            if (masaKaydetBtn) masaKaydetBtn.textContent = 'Güncelle';
        }
    } catch (error) {
        console.error("Masa düzenlenirken hata:", error);
    }
}

async function masaKaydet() {
    if (!aktifYoneticiAuth) {
        showToast("Bu işlemi yapmak için giriş yapmalısınız.", "error");

        return;
    }

    const id = masaEditIdInput.value;
    const name = masaAdiInput.value.trim();
    const isActive = masaAktifMiSelect.value === 'true';

    if (!name) {
        showToast("Masa adı boş bırakılamaz.", "error");

        return;
    }

    try {
        if (id) {
            await db.collection('tables').doc(id).update({ name, isActive });
            showToast("Masa başarıyla güncellendi.", "success");

        } else {
            await db.collection('tables').add({ name, isActive });
            showToast("Yeni masa eklendi.", "success");

        }
        masaFormunuTemizle();
        masalariYukleYonetici();
    } catch (error) {
        console.error("Masa kaydedilirken hata:", error);
        showToast("Masa kaydedilirken bir hata oluştu.", "error");

    }
}

async function masaSil(event) {
    const id = event.target.dataset.id;
    if (!id) return;
    if (!confirm("Bu masayı silmek istediğinizden emin misiniz?")) return;
    try {
        await db.collection('tables').doc(id).delete();
        masalariYukleYonetici();
    } catch (error) {
        console.error("Masa silinirken hata:", error);
         showToast("Masa silinirken bir hata oluştu.", "error");
    }
}

// --- Menü Yönetimi (Firestore kullanıyor) ---
function urunFormunuTemizle() {
    if (urunEditIdInput) urunEditIdInput.value = '';
    if (urunAdiInput) urunAdiInput.value = '';
    if (urunKategoriInput) urunKategoriInput.value = '';
    if (urunFiyatInput) urunFiyatInput.value = '';
    if (urunAciklamaTextarea) urunAciklamaTextarea.value = '';
    if (urunFotoInput) urunFotoInput.value = '';
    if (urunKaydetBtn) urunKaydetBtn.textContent = 'Kaydet';
}

async function menuyuYukleYonetici() {
    if (!menuListesiYoneticiDiv || !aktifYoneticiAuth) {
        if (menuListesiYoneticiDiv) menuListesiYoneticiDiv.innerHTML = '<p>Menüyü görmek için giriş yapınız.</p>';
        return;
    }

    try {
        const querySnapshot = await db.collection('menuItems').orderBy('category').orderBy('name').get();
        menuListesiYoneticiDiv.innerHTML = '';

        if (querySnapshot.empty) {
            menuListesiYoneticiDiv.innerHTML = '<p>Kayıtlı ürün bulunmuyor.</p>';
            return;
        }

        const kategorilereGore = {};
        querySnapshot.forEach(doc => {
            const item = doc.data();
            const kategori = item.category || 'Diğer';
            if (!kategorilereGore[kategori]) kategorilereGore[kategori] = [];
            kategorilereGore[kategori].push({ ...item, id: doc.id });
        });

        Object.keys(kategorilereGore).forEach(kategori => {
            const baslik = document.createElement('h4');
            baslik.textContent = kategori;
            menuListesiYoneticiDiv.appendChild(baslik);

            const ul = document.createElement('ul');
            kategorilereGore[kategori].forEach(urun => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${urun.name} - ${urun.price.toFixed(2)} TL</span>
                    <div>
                        <button class="urun-duzenle-btn btn-warning" data-id="${urun.id}">Düzenle</button>
                        <button class="urun-sil-btn btn-danger" data-id="${urun.id}">Sil</button>
                    </div>
                `;
                ul.appendChild(li);
            });
            menuListesiYoneticiDiv.appendChild(ul);
        });

        addMenuButtonListeners();

    } catch (error) {
        console.error("Menü yüklenirken hata:", error);
        menuListesiYoneticiDiv.innerHTML = '<p>Menü öğeleri yüklenemedi.</p>';
    }
}

function addMenuButtonListeners() {
    menuListesiYoneticiDiv.querySelectorAll('.urun-duzenle-btn').forEach(btn => {
        btn.removeEventListener('click', urunDuzenleFormunuDoldur);
        btn.addEventListener('click', urunDuzenleFormunuDoldur);
    });
    menuListesiYoneticiDiv.querySelectorAll('.urun-sil-btn').forEach(btn => {
        btn.removeEventListener('click', urunSil);
        btn.addEventListener('click', urunSil);
    });
}

async function urunDuzenleFormunuDoldur(event) {
    const id = event.target.dataset.id;
    try {
        const docSnap = await db.collection('menuItems').doc(id).get();
        if (docSnap.exists) {
            const urun = docSnap.data();
            if (urunEditIdInput) urunEditIdInput.value = id;
            if (urunAdiInput) urunAdiInput.value = urun.name;
            if (urunKategoriInput) urunKategoriInput.value = urun.category;
            if (urunFiyatInput) urunFiyatInput.value = urun.price;
            if (urunAciklamaTextarea) urunAciklamaTextarea.value = urun.description || '';
            if (urunFotoInput) urunFotoInput.value = urun.imagePath || '';
            if (urunKaydetBtn) urunKaydetBtn.textContent = 'Güncelle';
        }
    } catch (error) {
        console.error("Ürün düzenlenirken hata:", error);
    }
}

async function urunKaydet() {
    const id = urunEditIdInput.value;
    const name = urunAdiInput.value.trim();
    const category = urunKategoriInput.value.trim();
    const price = parseFloat(urunFiyatInput.value);
    const description = urunAciklamaTextarea.value.trim();
    const imagePath = urunFotoInput.value.trim();

    if (!name || isNaN(price)) {
        showToast("Ürün adı ve geçerli fiyat girilmelidir.", "error");

        return;
    }

    const urunData = { name, category, price, description, imagePath };

    try {
        if (id) {
            await db.collection('menuItems').doc(id).update(urunData);
            showToast("Ürün güncellendi.", "success");

        } else {
            await db.collection('menuItems').add(urunData);
            showToast("Yeni ürün eklendi.", "success");

        }
        urunFormunuTemizle();
        menuyuYukleYonetici();
    } catch (error) {
        console.error("Ürün kaydedilirken hata:", error);
        showToast("Ürün kaydedilirken bir hata oluştu.", "error");

    }
}

async function urunSil(event) {
    const id = event.target.dataset.id;
    if (!id) return;
    if (!confirm("Bu ürünü silmek istediğinizden emin misiniz?")) return;
    try {
        await db.collection('menuItems').doc(id).delete();
        menuyuYukleYonetici();
    } catch (error) {
        console.error("Ürün silinirken hata:", error);
        showToast("Ürün silinirken bir hata oluştu.", "error");

    }
}

    // --- Raporlama Fonksiyonları (Firestore kullanıyor) ---
    async function raporGoster() {
        
        console.log(">>> raporGoster ÇAĞRILDI. aktifYoneticiAuth:", aktifYoneticiAuth ? aktifYoneticiAuth.uid : "YOK");

        const raporTarihInputEl = document.getElementById('rapor-tarih'); // Fonksiyon içinde DOM'a erişim
        const raporSonucDivEl = document.getElementById('rapor-sonuc');
        const raporTarihBaslikSpanEl = document.getElementById('rapor-tarih-baslik');

        if (!raporTarihInputEl || !aktifYoneticiAuth) {
            if (raporSonucDivEl) raporSonucDivEl.innerHTML = '<p>Raporları görmek için giriş yapınız veya tarih alanı bulunamadı.</p>';
            return;
        }
        const tarihString = raporTarihInputEl.value;
        
        if (!tarihString) {
            showToast("Lütfen bir tarih seçin.", "warning");

            if (raporSonucDivEl) raporSonucDivEl.innerHTML = '<p>Lütfen bir tarih seçerek raporu görüntüleyin.</p>';
            return;
        }
        const baslangicZamani = new Date(tarihString + 'T00:00:00.000');
        const bitisZamani = new Date(tarihString + 'T23:59:59.999');

        if (raporTarihBaslikSpanEl) raporTarihBaslikSpanEl.textContent = baslangicZamani.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });

        try {
            const querySnapshot = await db.collection('completedOrders')
                .where('paymentTimestamp', '>=', firebase.firestore.Timestamp.fromDate(baslangicZamani))
                .where('paymentTimestamp', '<=', firebase.firestore.Timestamp.fromDate(bitisZamani))
                .orderBy('paymentTimestamp', 'desc')
                .get();
            const raporSiparisleri = [];
            querySnapshot.forEach(doc => {
                raporSiparisleri.push({ id: doc.id, ...doc.data() });
            });
            let menuItemsList = []; // Rapor için menü çekmeye gerek yok, siparişin içinde var
            // const menuSnapshot = await db.collection('menuItems').get();
            // menuSnapshot.forEach(doc => menuItemsList.push({id: doc.data().productId, firestoreDocId: doc.id, ...doc.data()}));
            renderRapor(raporSiparisleri, menuItemsList); // menuItemsList boş gidebilir veya kaldırılabilir
        } catch (error) {
            console.error("Firestore'dan belirli tarihli rapor alınırken hata:", error);
            if (error.message.includes("indexes")) {
                showToast("Rapor sorgusu için Firestore indeksi gerekiyor. Detaylar için geliştirici konsolunu kontrol edin.", "warning");

            }
            if (raporSonucDivEl) raporSonucDivEl.innerHTML = '<p>Rapor yüklenirken bir hata oluştu.</p>';
        }
    } // raporGoster fonksiyonu burada bitiyor

    async function tumRaporlariGoster() {
        if (!aktifYoneticiAuth) {
            if (raporSonucDiv) raporSonucDiv.innerHTML = '<p>Raporları görmek için giriş yapınız.</p>';
            return;
        }
        if (raporTarihBaslikSpan) raporTarihBaslikSpan.textContent = "Tüm Zamanlar";
        try {
            const querySnapshot = await db.collection('completedOrders')
                .orderBy('paymentTimestamp', 'desc')
                .get();
            const raporSiparisleri = [];
            querySnapshot.forEach(doc => {
                raporSiparisleri.push({ id: doc.id, ...doc.data() });
            });
            let menuItemsList = []; // Rapor için menü çekmeye gerek yok
            renderRapor(raporSiparisleri, menuItemsList);
        } catch (error) {
            console.error("Firestore'dan tüm raporlar alınırken hata:", error);
            if (raporSonucDiv) raporSonucDiv.innerHTML = '<p>Rapor yüklenirken bir hata oluştu.</p>';
        }
    }

    function renderRapor(raporSiparisleri, menuItemsList) { // menuItemsList artık kullanılmıyor olabilir
        // ... (renderRapor fonksiyonunun içeriği önceki mesajdaki gibi,
        //      sadece raporSiparisListesiUl, raporUrunAdetleriUl, raporToplamCiroSpan, raporSonucDiv
        //      gibi global değişkenleri kullandığından emin ol, ya da onları da fonksiyon içinde al)
        // ... (Bir önceki mesajımdaki renderRapor fonksiyonunu buraya kopyala)
        if (!raporSiparisListesiUl || !raporUrunAdetleriUl || !raporToplamCiroSpan) return;
        raporSiparisListesiUl.innerHTML = '';
        raporUrunAdetleriUl.innerHTML = '';
        let toplamCiro = 0;
        const urunAdetleri = {};
        if (raporSiparisleri.length === 0) {
            raporSiparisListesiUl.innerHTML = '<li>Gösterilecek ödenmiş sipariş bulunamadı.</li>';
            raporToplamCiroSpan.textContent = '0.00';
            raporUrunAdetleriUl.innerHTML = '<li>Satılan ürün yok.</li>';
            if (raporSonucDiv) raporSonucDiv.style.display = 'block';
            return;
        }
        raporSiparisleri.forEach((siparis, index) => {
            toplamCiro += siparis.total || 0;
            const masaAdi = siparis.tableName || `Masa ${siparis.tableId}`;
            const garsonAdi = siparis.garsonName || 'Bilinmiyor';
            const odemeZamani = siparis.paymentTimestamp ?
                               siparis.paymentTimestamp.toDate().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) +
                               ' (' + siparis.paymentTimestamp.toDate().toLocaleDateString('tr-TR') + ')' : '-';
            const siparisRaporNo = index + 1;
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${siparisRaporNo}) ${odemeZamani} - ${masaAdi} - Grs: ${garsonAdi} - Toplam: <strong>${(siparis.total || 0).toFixed(2)} TL</strong></span>
                <button class="rapor-detay-btn btn-info" data-id="${siparis.id}">Detay</button>
                <div class="rapor-siparis-detay" data-id="${siparis.id}" style="display:none;">
                     ${raporSiparisDetayHTML(siparis)} 
                 </div>
            `;
            raporSiparisListesiUl.appendChild(li);
            if (siparis.items && Array.isArray(siparis.items)) {
                siparis.items.forEach(item => {
                    const urunAdi = item.name || `Bilinmeyen Ürün (ID: ${item.productId || item.itemId})`;
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
        if (raporSonucDiv) raporSonucDiv.style.display = 'block';
    }
 

    function addRaporDetayButtonListeners() {
      const detayButonlari = document.querySelectorAll('.rapor-detay-btn');
      detayButonlari.forEach(btn => {
        btn.removeEventListener('click', toggleRaporDetay); // varsa eski listener'ı sil
        btn.addEventListener('click', toggleRaporDetay);
      });
    }


    function raporSiparisDetayHTML(siparis) {

        if (!siparis.items || !Array.isArray(siparis.items)) {
          console.warn("Siparişte ürün listesi yok:", siparis);
          return '<p>Sipariş detayı bulunamadı.</p>';
        }


      const urunListesiHTML = siparis.items.map(item => {
        const ad = item.name || 'Ürün adı yok';
        const adet = item.quantity || 1;
        const fiyat = item.price ? `${item.price.toFixed(2)} TL` : 'Fiyat bilinmiyor';
        return `<li>${ad} - ${adet} adet - ${fiyat}</li>`;
      }).join('');

      return `<ul>${urunListesiHTML}</ul>`;
    }
    
    function toggleRaporDetay(event) {
      const buton = event.target;
      const siparisId = buton.dataset.id;
      const detayDiv = document.querySelector(`.rapor-siparis-detay[data-id="${siparisId}"]`);
      if (!detayDiv) return;

      const isHidden = window.getComputedStyle(detayDiv).display === 'none';

      detayDiv.style.display = isHidden ? 'block' : 'none';
      buton.textContent = isHidden ? 'Gizle' : 'Detay';
    }


    // --- Event Listener'lar ---
    // ... (tüm event listener'lar önceki mesajdaki gibi) ...
    if (yoneticiGirisYapBtn) yoneticiGirisYapBtn.addEventListener('click', yoneticiGirisYapFirebase);
    if (yoneticiSifreInput) yoneticiSifreInput.addEventListener('keypress', (event) => { if (event.key === 'Enter') yoneticiGirisYapFirebase(); });
    if (yoneticiCikisYapBtn) yoneticiCikisYapBtn.addEventListener('click', yoneticiCikisYapFirebase);
    if (profilGuncelleBtn) profilGuncelleBtn.addEventListener('click', profilGuncelle);
    if (kullaniciKaydetBtn) kullaniciKaydetBtn.addEventListener('click', kullaniciKaydet);
    if (kullaniciFormTemizleBtn) kullaniciFormTemizleBtn.addEventListener('click', kullaniciFormunuTemizle);
    if (masaKaydetBtn) masaKaydetBtn.addEventListener('click', masaKaydet);
    if (masaFormTemizleBtn) masaFormTemizleBtn.addEventListener('click', masaFormunuTemizle);
    if (urunKaydetBtn) urunKaydetBtn.addEventListener('click', urunKaydet);
    if (urunFormTemizleBtn) urunFormTemizleBtn.addEventListener('click', urunFormunuTemizle);
    if (raporGosterBtn) raporGosterBtn.addEventListener('click', raporGoster);
    if (tumRaporGosterBtn) tumRaporGosterBtn.addEventListener('click', tumRaporlariGoster);
    
}); // DOMContentLoaded Sonu