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

    function yoneticiGosterHata(mesaj) {
        if (yoneticiGirisHataMesaji) {
            yoneticiGirisHataMesaji.textContent = mesaj;
            yoneticiGirisHataMesaji.style.display = 'block';
        }
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
            profilGuncelleMesajP.textContent = '';
            profilGuncelleMesajP.style.color = 'green';
        }
         if (yoneticiGirisHataMesaji) { // Başarılı girişte hata mesajını temizle
            yoneticiGirisHataMesaji.textContent = '';
            yoneticiGirisHataMesaji.style.display = 'none';
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
                if (raporTarihInput) raporTarihInput.valueAsDate = new Date();
                raporGoster(); // Firestore kullanıyor
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
            alert("Çıkış yapılırken bir hata oluştu.");
        }
    }

    // --- Profil Güncelleme (localStorage kullanıyor - SONRA GÜNCELLENECEK) ---
    function profilGuncelle() { /* ... mevcut kodun ... */ }

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
                <div>
                    <button class="kullanici-duzenle-btn btn-warning" data-uid="${garson.uid}">Düzenle</button>
                    <button class="kullanici-sil-btn btn-danger" data-uid="${garson.uid}">Sil</button>
                </div>
            `;
            kullaniciListesiUl.appendChild(li);
        });
        addKullaniciButtonListeners(); // Butonlara event listener ekle
    } catch (error) {
        console.error("Firestore'dan garsonlar yüklenirken hata:", error);
        if (error.message.includes("indexes")) {
             alert("Garsonları listelemek için bir Firestore indeksi gerekiyor. Lütfen konsoldaki linki takip ederek indeksi oluşturun: role (Artan), username (Artan)");
        }
        if (kullaniciListesiUl) kullaniciListesiUl.innerHTML = '<li>Garsonlar yüklenirken bir hata oluştu.</li>';
    }
}    

function addKullaniciButtonListeners() {
    if (!kullaniciListesiUl) return;
    kullaniciListesiUl.querySelectorAll('.kullanici-duzenle-btn').forEach(btn => {
        btn.removeEventListener('click', kullaniciDuzenleFormunuDoldur); // Öncekini kaldır
        btn.addEventListener('click', kullaniciDuzenleFormunuDoldur);
    });
    kullaniciListesiUl.querySelectorAll('.kullanici-sil-btn').forEach(btn => {
        btn.removeEventListener('click', kullaniciSil); // Öncekini kaldır
        btn.addEventListener('click', kullaniciSil);
    });
}   

async function kullaniciDuzenleFormunuDoldur(event) {
    if (!aktifYoneticiAuth) return;
    const garsonUID = event.target.dataset.uid; // Garsonun Firebase Auth UID'si

    try {
        const docRef = db.collection('users').doc(garsonUID);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const garson = docSnap.data();
            if (kullaniciEditIdInput) kullaniciEditIdInput.value = garsonUID; // Hidden input'a UID'yi sakla
            if (yeniKullaniciAdiInput) yeniKullaniciAdiInput.value = garson.username || '';
            if (yeniSifreInput) {
                yeniSifreInput.value = ''; // Şifre alanı düzenlemede gösterilmez/doldurulmaz
                yeniSifreInput.placeholder = 'Şifre değiştirilmeyecekse boş bırakın';
                yeniSifreInput.required = false; // Düzenlemede şifre zorunlu değil
            }
            // E-posta alanı genellikle düzenlenmez, o yüzden forma eklemedik.
            // Eğer e-postayı da göstermek istersen, formuna bir alan ekleyip burada doldurabilirsin.
            if (kullaniciKaydetBtn) kullaniciKaydetBtn.textContent = 'Güncelle';
        } else {
            alert("Düzenlenecek garson bulunamadı.");
            kullaniciFormunuTemizle();
        }
    } catch (error) {
        console.error("Firestore'dan garson düzenleme için okunurken hata:", error);
        alert("Garson bilgileri yüklenirken bir hata oluştu.");
    }
}



async function kullaniciKaydet() {
    if (!aktifYoneticiAuth) {
        alert("Bu işlemi yapmak için giriş yapmalısınız.");
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
        alert('Garson adı (kullanıcı adı) boş bırakılamaz.');
        return;
    }

    // YENİ GARSON EKLEME DURUMU
     if (!editUID) { // YENİ GARSON EKLEME
        if (!yeniGarsonEmailInput) {
            alert("HATA: Garson e-posta input'u HTML'de bulunamadı (ID: yeni-kullanici-email). Lütfen HTML'i kontrol edin.");
            return;
        }
        const emailForNewUser = yeniGarsonEmailInput.value.trim();

        if (!emailForNewUser || !password) {
            alert('Yeni garson için e-posta ve şifre boş bırakılamaz.');
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

            alert(`"${username}" adlı yeni garson başarıyla eklendi.`);
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
            alert(hataMesajiKullaniciya);
        }
    }
    // --- BU BLOK DEĞİŞTİ ---
    else { // MEVCUT GARSONU GÜNCELLEME DURUMU (Bu kısım aynı kalabilir)
        try {
            const garsonRef = db.collection('users').doc(editUID);
            const updates = { username: username };
            if (password) {
                alert("Şifre güncelleme işlemi bu arayüzden desteklenmiyor.");
            }
            await garsonRef.update(updates);
            kullanicilariYukle();
            kullaniciFormunuTemizle();
            alert(`"${username}" adlı yeni garson başarıyla eklendi.\n\nFirebase, yeni kullanıcı oluşturulduğunda oturumu o kullanıcıya geçirir. Güvenlik nedeniyle mevcut oturumunuz sonlandırıldı.\nLütfen yönetici olarak tekrar giriş yapınız.`);            

        } catch (error) {
            console.error("Garson güncellenirken Firestore hatası:", error);
            alert("Garson güncellenirken bir hata oluştu.");
        }
    }
    
}

async function kullaniciSil(event) {
    if (!aktifYoneticiAuth) return;
    const garsonUID = event.target.dataset.uid;

    let garsonUsername = `UID: ${garsonUID} olan garson`;
    try {
        const docSnap = await db.collection('users').doc(garsonUID).get();
        if (docSnap.exists()) {
            garsonUsername = docSnap.data().username || garsonUsername;
        }
    } catch (e) { /* Hata önemli değil, varsayılan adı kullan */ }

    if (!confirm(`"${garsonUsername}" adlı garsonu silmek istediğinizden emin misiniz? Bu işlem kullanıcının sisteme girişini ENGELLEMEZ, sadece yetkilerini kaldırır.`)) {
        return;
    }

    try {
        // Sadece Firestore'dan silelim (Auth'dan silmek daha riskli)
        await db.collection('users').doc(garsonUID).delete();
        alert(`"${garsonUsername}" adlı garsonun Firestore kaydı silindi.`);
        kullanicilariYukle();
        if (kullaniciEditIdInput && kullaniciEditIdInput.value === garsonUID) {
            kullaniciFormunuTemizle();
        }
    } catch (error) {
        console.error("Garson silinirken Firestore hatası:", error);
        alert("Garson silinirken bir hata oluştu.");
    }
}




    // --- Masa Yönetimi (Firestore kullanıyor) ---
    function masaFormunuTemizle() { /* ... önceki mesajdaki doğru hali ... */ }
    async function masalariYukleYonetici() { /* ... önceki mesajdaki doğru hali ... */ }
    function addMasaButtonListeners() { /* ... önceki mesajdaki doğru hali ... */ }
    async function masaDuzenleFormunuDoldur(event) { /* ... önceki mesajdaki doğru hali ... */ }
    async function masaKaydet() { /* ... önceki mesajdaki doğru hali ... */ }
    async function masaSil(event) { /* ... önceki mesajdaki doğru hali ... */ }

    // --- Menü Yönetimi (Firestore kullanıyor) ---
    function urunFormunuTemizle() { /* ... önceki mesajdaki doğru hali ... */ }
    async function menuyuYukleYonetici() { /* ... önceki mesajdaki doğru hali ... */ }
    function addMenuButtonListeners() { /* ... önceki mesajdaki doğru hali ... */ }
    async function urunDuzenleFormunuDoldur(event) { /* ... önceki mesajdaki doğru hali ... */ }
    async function urunKaydet() { /* ... önceki mesajdaki doğru hali ... */ }
    async function urunSil(event) { /* ... önceki mesajdaki doğru hali ... */ }

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
            alert("Lütfen bir tarih seçin.");
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
                alert("Rapor sorgusu için bir Firestore indeksi gerekiyor. Lütfen konsoldaki linki takip ederek indeksi oluşturun.");
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
                <span>${siparisRaporNo}. Spsrş - ${odemeZamani} - ${masaAdi} - Grs: ${garsonAdi} - Toplam: <strong>${(siparis.total || 0).toFixed(2)} TL</strong></span>
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


    function raporSiparisDetayHTML(siparis) { /* ... önceki mesajdaki doğru hali ... */ }
    function addRaporDetayButtonListeners() { /* ... önceki mesajdaki doğru hali ... */ }
    async function toggleRaporDetay(event) { /* ... önceki mesajdaki doğru hali ... */ }

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