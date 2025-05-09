// GELİŞTİRME AŞAMASI İÇİN: Her yenilemede localStorage'ı temizle
// Proje bittiğinde bu satırı kaldırın veya yorum satırı yapın!
//localStorage.clear();
//----------------------------------------------------

// --- localStorage Yardımcı Fonksiyonları ---

/**
 * localStorage'dan veri okur. Veri yoksa veya JSON parse edilemezse varsayılan değeri döndürür.
 * @param {string} key Okunacak verinin anahtarı.
 * @param {any} defaultValue Veri bulunamazsa veya hatalıysa döndürülecek varsayılan değer (genellikle [] veya {}).
 * @returns {any} Okunan ve parse edilen veri veya varsayılan değer.
 */
function veriOku(key, defaultValue = []) {
    const data = localStorage.getItem(key);
    if (!data) {
        // Varsayılan değeri yazmak yerine sadece döndürelim. İlk yazma işini baslangicVerileriniYukle yapacak.
        if (defaultValue !== undefined) {
            veriYaz(key, defaultValue); // İlk okumada veri yoksa varsayılanı yaz (opsiyonel)
         }
        return defaultValue;
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error(`localStorage'dan veri okurken hata oluştu (key: ${key}):`, e);
        return defaultValue;
    }
}

/**
 * Veriyi JSON formatına çevirip localStorage'a yazar.
 * @param {string} key Yazılacak verinin anahtarı.
 * @param {any} value Yazılacak JavaScript nesnesi veya dizisi.
 */
function veriYaz(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error(`localStorage'a veri yazarken hata oluştu (key: ${key}):`, e);
        // İsteğe bağlı: Kullanıcıya depolama alanının dolu olabileceği gibi bir uyarı verilebilir.
    }
}


/**
 * Firestore'dan verilen UID'ye sahip kullanıcının verilerini (rol dahil) getirir.
 * @param {string} uid Kullanıcının Firebase Auth UID'si.
 * @returns {Promise<object|null>} Kullanıcı verisi objesi veya kullanıcı bulunamazsa null.
 */
async function getKullaniciData(uid) {
    if (!uid) return null;
    try {
        const userDocRef = db.collection('users').doc(uid);
        const docSnap = await userDocRef.get();
        if (docSnap.exists) {
            return { id: docSnap.id, ...docSnap.data() }; // id'yi de ekleyelim
        } else {
            console.log("Firestore'da kullanıcı dökümanı bulunamadı:", uid);
            return null;
        }
    } catch (error) {
        console.error("Firestore'dan kullanıcı verisi alınırken hata:", error);
        return null;
    }
}







// --- Varsayılan Başlangıç Verileri ---

const varsayilanMasalar = [
    { id: 1, name: 'Masa 1', status: 'Boş' },
    { id: 2, name: 'Masa 2', status: 'Boş' },
    { id: 3, name: 'Masa 3', status: 'Boş' }, // Bu dolu kalsın (siparişi vardı)
    { id: 4, name: 'Masa 4', status: 'Boş' },
    { id: 5, name: 'Masa 5', status: 'Boş' },
    { id: 6, name: 'Masa 6', status: 'Boş' }, // Yeni
    { id: 7, name: 'Masa 7', status: 'Boş' }, // Yeni
    { id: 8, name: 'Pencere 1', status: 'Boş' }, // Yeni - Farklı isim
    { id: 9, name: 'Pencere 2', status: 'Boş' }, // Yeni
    { id: 10, name: 'Bahçe 1', status: 'Boş' }, // ID'leri sıralı tutmak için güncelledim
    { id: 11, name: 'Bahçe 2', status: 'Boş' },
    { id: 12, name: 'Bahçe Köşe', status: 'Boş' }, // Yeni
    { id: 13, name: 'Loca 1', status: 'Boş' },  // Bu dolu kalsın (siparişi vardı)
    { id: 14, name: 'Loca 2', status: 'Boş' }, // Yeni
    { id: 15, name: 'Teras A', status: 'Boş' }, // Yeni
    { id: 16, name: 'Teras B', status: 'Boş' }, // Yeni
];

const varsayilanMenu = [
    // İçecekler
    { id: 101, name: 'Çay', category: 'İçecekler', price: 15, description: 'Taze demlenmiş.', photo: 'images/cay.jpg' },
    { id: 102, name: 'Kahve', category: 'İçecekler', price: 30, description: 'Türk kahvesi.', photo: 'images/kahve.jpg' },
    { id: 103, name: 'Su', category: 'İçecekler', price: 10, description: '0.5L Pet Şişe.', photo: 'images/su.jpg' },
    { id: 104, name: 'Kola', category: 'İçecekler', price: 35, description: 'Kutu 330ml.', photo: 'images/kola.jpg' },
    { id: 105, name: 'Ayran', category: 'İçecekler', price: 25, description: 'Ev yapımı.', photo: 'images/ayran.jpg' },
   
    // Başlangıçlar / Mezeler
    { id: 201, name: 'Mercimek Çorbası', category: 'Başlangıçlar', price: 40, description: 'Ev yapımı.', photo: 'images/mercimek.jpg' },
    { id: 501, name: 'Sigara Böreği', category: 'Başlangıçlar', price: 60, description: 'Peynirli, 4 adet.', photo: 'images/sigaraboregi.jpg'},
    { id: 505, name: 'Yaprak Sarma', category: 'Mezeler', price: 65, description: 'Zeytinyağlı, 6 adet.', photo: 'images/yapraksarma.jpg'}, // Yeni
    { id: 502, name: 'Haydari', category: 'Mezeler', price: 45, description: 'Yoğurtlu meze.', photo: 'images/haydari.jpg'},
    { id: 503, name: 'Acılı Ezme', category: 'Mezeler', price: 50, description: 'Domatesli, biberli.', photo: 'images/acili_ezme.jpg'},
    
    // Ana Yemekler
    { id: 202, name: 'Izgara Köfte', category: 'Ana Yemekler', price: 150, description: 'Pirinç pilavı ve salata ile.', photo: 'images/kofte.jpg' },
    { id: 203, name: 'Tavuk Şiş', category: 'Ana Yemekler', price: 130, description: 'Özel soslu, yanında közlenmiş biber.', photo: 'images/tavuksis.jpg' },
    { id: 601, name: 'Adana Kebap', category: 'Ana Yemekler', price: 170, description: 'Acılı, bulgur pilavı ile.', photo: 'images/adanakebap.jpg' },
    { id: 602, name: 'Tavuk Sote', category: 'Ana Yemekler', price: 140, description: 'Mantar ve sebzelerle.', photo: 'images/tavuksote.jpg' },
    { id: 604, name: 'Izgara Levrek', category: 'Ana Yemekler', price: 220, description: 'Roka ve limon ile servis.', photo: 'images/levrek.jpg' }, // Yeni

    // Salatalar
    { id: 204, name: 'Mevsim Salata', category: 'Salatalar', price: 70, description: 'Mevsim yeşillikleri.', photo: 'images/salata.jpg' },
    { id: 701, name: 'Çoban Salata', category: 'Salatalar', price: 65, description: 'Domates, salatalık, biber.', photo: 'images/cobansalata.jpg' },
    { id: 702, name: 'Gavurdağı Salatası', category: 'Salatalar', price: 75, description: 'Domates, ceviz, nar ekşili.', photo: 'images/gavurdagi.jpg' }, // Yeni
    { id: 703, name: 'Roka Salatası', category: 'Salatalar', price: 70, description: 'Parmesan ve domates ile.', photo: 'images/rokasalata.jpg' }, // Yeni

    // Tatlılar
    { id: 301, name: 'Sütlaç', category: 'Tatlılar', price: 50, description: 'Fırınlanmış.', photo: 'images/sutlac.jpg' },
    { id: 302, name: 'Künefe', category: 'Tatlılar', price: 80, description: 'Sıcak servis, peynirli.', photo: 'images/kunefe.jpg' },
    { id: 801, name: 'Baklava', category: 'Tatlılar', price: 90, description: 'Cevizli, 3 dilim.', photo: 'images/baklava.jpg' },
    { id: 802, name: 'Kazandibi', category: 'Tatlılar', price: 55, description: 'Yanık tabanlı sütlü tatlı.', photo: 'images/kazandibi.jpg' }, // Yeni
    { id: 804, name: 'Trileçe', category: 'Tatlılar', price: 70, description: 'Karamel soslu, sütlü kek.', photo: 'images/trilece.jpg' } // Yeni
];
// Eğer bir ürün için özel resim yoksa, photo: null veya photo: '' yapın.

const varsayilanKullanicilar = [
    { id: 1, username: 'Ali', password: '123', role: 'Garson' },
    { id: 2, username: 'Burak', password: '123', role: 'Garson' },
    { id: 101, username: 'admin', password: '123', role: 'Yönetici' },
];


const varsayilanSiparisler = [];

// --- Başlangıç Verilerini Yükleme Fonksiyonu ---
// Bu fonksiyon artık ilgili sayfanın JS'i tarafından çağrılacak.
async function baslangicVerileriniYukle() { // async yaptık!
    console.log("Başlangıç verileri kontrol ediliyor...");
    let changed = false;

    // Masalar (Şimdilik localStorage'da kalıyor)
    if (localStorage.getItem('masalar') === null) {
        console.log("'masalar' localStorage'da bulunamadı, varsayılanlar yükleniyor.");
        veriYaz('masalar', varsayilanMasalar); // localStorage'a yazar
        changed = true;
    }

    // --- MENÜ (Firestore'a Taşınıyor) ---
    try {
        const menuCollectionRef = db.collection('menuItems');
        const menuSnapshot = await menuCollectionRef.limit(1).get(); // Koleksiyonda en az 1 döküman var mı diye bak

        if (menuSnapshot.empty) { // Eğer menuItems koleksiyonu boşsa
            console.log("'menuItems' koleksiyonu Firestore'da boş, varsayılan menü yükleniyor...");
            // Varsayılan menü öğelerini Firestore'a ekle
            // Her bir ürün için ayrı bir döküman oluşturacağız.
            // Döküman ID'si olarak ürünün kendi ID'sini string olarak kullanalım.
            const batch = db.batch(); // Toplu yazma işlemi için batch oluştur

            varsayilanMenu.forEach(urun => {
                const urunRef = menuCollectionRef.doc(String(urun.id)); // Döküman referansı (ID'si ürün ID'si)
                // urun objesinden id'yi çıkararak kalanını dökümana yaz (çünkü id zaten döküman id'si oldu)
                const { id, ...urunData } = urun;
                batch.set(urunRef, urunData);
            });

            await batch.commit(); // Toplu yazma işlemini gerçekleştir
            console.log("Varsayılan menü Firestore'a başarıyla yüklendi.");
            changed = true;
        } else {
            console.log("'menuItems' koleksiyonu Firestore'da mevcut, varsayılanlar yüklenmeyecek.");
        }
    } catch (error) {
        console.error("Firestore menuItems kontrolü/yüklemesi sırasında hata:", error);
    }
    // --- MENÜ BİTTİ ---


    // Kullanıcılar (Bu kısım Auth ve Firestore 'users' koleksiyonu ile yönetiliyor,
    // dolayısıyla buradaki localStorage'a yazma mantığı artık geçerli değil veya farklı ele alınmalı)
    // Şimdilik bu kısmı yorumlayabiliriz veya kaldırabiliriz.
    // Rolleri Firestore'a 'users' koleksiyonuna yazdığımız için,
    // `varsayilanKullanicilar`ı Auth'a ve 'users' koleksiyonuna ekleme işlemi
    // ya manuel yapılır ya da bir kerelik bir script ile.
    /*
    if (localStorage.getItem('kullanicilar') === null) {
        console.log("'kullanicilar' localStorage'da bulunamadı, varsayılanlar yükleniyor.");
        veriYaz('kullanicilar', varsayilanKullanicilar);
        changed = true;
    }
    */

    // Siparişler (Şimdilik localStorage'da kalıyor)
    if (localStorage.getItem('siparisler') === null) {
        console.log("'siparisler' localStorage'da bulunamadı, varsayılanlar yükleniyor.");
        veriYaz('siparisler', varsayilanSiparisler);
        changed = true;
    }

    // Ödenmiş Siparişler (Şimdilik localStorage'da kalıyor)
    if (localStorage.getItem('odenmisSiparisler') === null) {
        console.log("'odenmisSiparisler' localStorage'da bulunamadı, boş liste oluşturuluyor.");
        veriYaz('odenmisSiparisler', []);
        changed = true;
    }

    if (changed) {
         console.log("Başlangıç verilerinde değişiklik yapıldı veya yüklendi.");
    } else {
        console.log("Mevcut veriler kullanılıyor veya başlangıç verilerine gerek duyulmadı.");
    }
}

// --- Genel Yardımcı Fonksiyonlar ---

/** Benzersiz bir ID oluşturur */
function yeniIdUret() {
    return Date.now();
}

/** Menüden ürün ID'sine göre ürün bulma */
function urunBul(urunId) {
    const menu = veriOku('menu');
    return menu.find(urun => urun.id === parseInt(urunId));
}

/** Kullanıcı ID'sine göre kullanıcı bulma */
function kullaniciBul(kullaniciId) {
    const kullanicilar = veriOku('kullanicilar');
    return kullanicilar.find(k => k.id === parseInt(kullaniciId));
}

/** Masa ID'sine göre masa bulma */
function masaBul(masaId) {
    const masalar = veriOku('masalar');
    return masalar.find(m => m.id === parseInt(masaId));
}


// --- Sidebar Fonksiyonları ---
function openNav() {
  const sidebar = document.getElementById("sidebar");
  if(sidebar) sidebar.classList.add("open");
}

function closeNav() {
  const sidebar = document.getElementById("sidebar");
  if(sidebar) sidebar.classList.remove("open");
}

// --- Sidebar Event Listeners (Sayfa yüklendiğinde eklensin) ---
// Sadece sidebar ile ilgili listener'lar burada kalacak.
// baslangicVerileriniYukle çağrısı buradan kaldırıldı.
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-menu');
    const closeBtn = document.getElementById('sidebar-close-btn');
    const sidebar = document.getElementById("sidebar");

    if(hamburgerBtn) {
        hamburgerBtn.addEventListener('click', openNav);
    }
    if(closeBtn) {
        closeBtn.addEventListener('click', closeNav);
    }

    // Opsiyonel: Sidebar dışına tıklayınca kapatma
    document.addEventListener('click', function(event) {
      if (sidebar && hamburgerBtn && sidebar.classList.contains('open') && !sidebar.contains(event.target) && event.target !== hamburgerBtn && !hamburgerBtn.contains(event.target) ) {
        closeNav();
      }
    });

    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});




