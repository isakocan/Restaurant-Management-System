// GELİŞTİRME AŞAMASI İÇİN: Her yenilemede localStorage'ı temizle
// Proje bittiğinde bu satırı kaldırın veya yorum satırı yapın!
// localStorage.clear();
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
        // if (defaultValue !== undefined) {
        //     veriYaz(key, defaultValue); // İlk okumada veri yoksa varsayılanı yaz (opsiyonel)
        // }
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

// --- Varsayılan Başlangıç Verileri ---

// ortak.js - varsayilanMasalar güncellemesi (örnek)
const varsayilanMasalar = [
    { id: 1, name: 'Masa 1', status: 'Boş' },
    { id: 2, name: 'Masa 2', status: 'Boş' },
    { id: 3, name: 'Masa 3', status: 'Dolu' }, // Bu dolu kalsın (siparişi vardı)
    { id: 4, name: 'Masa 4', status: 'Boş' },
    { id: 5, name: 'Masa 5', status: 'Boş' },
    { id: 6, name: 'Masa 6', status: 'Boş' }, // Yeni
    { id: 7, name: 'Masa 7', status: 'Boş' }, // Yeni
    { id: 8, name: 'Pencere 1', status: 'Boş' }, // Yeni - Farklı isim
    { id: 9, name: 'Pencere 2', status: 'Boş' }, // Yeni
    { id: 10, name: 'Bahçe 1', status: 'Boş' }, // ID'leri sıralı tutmak için güncelledim
    { id: 11, name: 'Bahçe 2', status: 'Boş' },
    { id: 12, name: 'Bahçe Köşe', status: 'Boş' }, // Yeni
    { id: 13, name: 'Loca 1', status: 'Dolu' },  // Bu dolu kalsın (siparişi vardı)
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
    { id: 105, name: 'Ayran', category: 'İçecekler', price: 25, description: 'Ev yapımı.', photo: 'images/ayran.jpg' }, // Yeni
    { id: 106, name: 'Taze Portakal Suyu', category: 'İçecekler', price: 50, description: 'Sıkma.', photo: 'images/portakalsuyu.jpg' }, // Yeni
    { id: 401, name: 'Limonata', category: 'İçecekler', price: 40, description: 'Ev yapımı taze.', photo: null },

    // Başlangıçlar / Mezeler (Kategoriyi birleştirebilir veya ayırabiliriz)
    { id: 201, name: 'Mercimek Çorbası', category: 'Başlangıçlar', price: 40, description: 'Ev yapımı.', photo: 'images/mercimek.jpg' },
    { id: 501, name: 'Sigara Böreği', category: 'Başlangıçlar', price: 60, description: 'Peynirli, 4 adet.', photo: 'images/sigaraboregi.jpg'}, // Yeni
    { id: 502, name: 'Haydari', category: 'Mezeler', price: 45, description: 'Yoğurtlu meze.', photo: 'images/haydari.jpg'}, // Yeni - Yeni Kategori
    { id: 503, name: 'Acılı Ezme', category: 'Mezeler', price: 50, description: 'Domatesli, biberli.', photo: 'images/acili_ezme.jpg'}, // Yeni

    // Ana Yemekler
    { id: 202, name: 'Izgara Köfte', category: 'Ana Yemekler', price: 150, description: 'Pirinç pilavı ve salata ile.', photo: 'images/kofte.jpg' },
    { id: 203, name: 'Tavuk Şiş', category: 'Ana Yemekler', price: 130, description: 'Özel soslu, yanında közlenmiş biber.', photo: 'images/tavuksis.jpg' },
    { id: 601, name: 'Adana Kebap', category: 'Ana Yemekler', price: 170, description: 'Acılı, bulgur pilavı ile.', photo: 'images/adanakebap.jpg' }, // Yeni
    { id: 602, name: 'Tavuk Sote', category: 'Ana Yemekler', price: 140, description: 'Mantar ve sebzelerle.', photo: 'images/tavuksote.jpg' }, // Yeni

    // Salatalar
    { id: 204, name: 'Mevsim Salata', category: 'Salatalar', price: 70, description: 'Mevsim yeşillikleri.', photo: 'images/salata.jpg' },
    { id: 701, name: 'Çoban Salata', category: 'Salatalar', price: 65, description: 'Domates, salatalık, biber.', photo: 'images/cobansalata.jpg' }, // Yeni

    // Tatlılar
    { id: 301, name: 'Sütlaç', category: 'Tatlılar', price: 50, description: 'Fırınlanmış.', photo: 'images/sutlac.jpg' },
    { id: 302, name: 'Künefe', category: 'Tatlılar', price: 80, description: 'Sıcak servis.', photo: 'images/kunefe.jpg' },
    { id: 801, name: 'Baklava', category: 'Tatlılar', price: 90, description: 'Cevizli, 3 dilim.', photo: 'images/baklava.jpg' }, // Yeni
];
// Eğer bir ürün için özel resim yoksa, photo: null veya photo: '' yapın.

const varsayilanKullanicilar = [
    { id: 1, username: 'ali', password: '123', role: 'Garson' },
    { id: 2, username: 'ibo', password: 'ibo', role: 'Garson' },
    { id: 101, username: 'admin', password: '123', role: 'Yönetici' },
];

// Örnek başlangıç siparişleri (Dolu masalarla eşleşen)
const varsayilanSiparisler = [
    {
        id: 1,
        tableId: 3, // Masa 3'ün siparişi
        items: [
            { itemId: 101, quantity: 2, price: 15 },
            { itemId: 201, quantity: 1, price: 40 }
        ],
        total: (2 * 15) + (1 * 40),
        status: 'Alındı', // Masa dolu olduğu için 'Alındı' veya 'Bekliyor' olabilir
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        garsonId: 1 // Garson 'ali' (ID: 1) almış olsun
    },
    {
        id: 2,
        tableId: 8, // Masa 8'in siparişi
        items: [
            { itemId: 202, quantity: 1, price: 150 },
            { itemId: 104, quantity: 2, price: 35 }
        ],
        total: (1 * 150) + (2 * 35),
        status: 'Alındı', // Masa dolu olduğu için 'Alındı' veya 'Bekliyor' olabilir
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        garsonId: 2 // Garson 'ibo' (ID: 2) almış olsun
    }
];


// --- Başlangıç Verilerini Yükleme Fonksiyonu ---
// Bu fonksiyon artık ilgili sayfanın JS'i tarafından çağrılacak.
function baslangicVerileriniYukle() {
    console.log("Başlangıç verileri kontrol ediliyor...");
    let changed = false; // Değişiklik yapılıp yapılmadığını takip et

    // Masalar
    if (localStorage.getItem('masalar') === null) {
        console.log("'masalar' localStorage'da bulunamadı, varsayılanlar yükleniyor.");
        veriYaz('masalar', varsayilanMasalar);
        changed = true;
    }

    // Menü
    if (localStorage.getItem('menu') === null) {
        console.log("'menu' localStorage'da bulunamadı, varsayılanlar yükleniyor.");
        veriYaz('menu', varsayilanMenu);
        changed = true;
    }

    // Kullanıcılar
    if (localStorage.getItem('kullanicilar') === null) {
        console.log("'kullanicilar' localStorage'da bulunamadı, varsayılanlar yükleniyor.");
        veriYaz('kullanicilar', varsayilanKullanicilar);
        changed = true;
    }

    // Siparişler
    if (localStorage.getItem('siparisler') === null) {
        console.log("'siparisler' localStorage'da bulunamadı, varsayılanlar yükleniyor.");
        veriYaz('siparisler', varsayilanSiparisler);
        changed = true;
    }

    // Ödenmiş Siparişler
    if (localStorage.getItem('odenmisSiparisler') === null) {
        console.log("'odenmisSiparisler' localStorage'da bulunamadı, boş liste oluşturuluyor.");
        veriYaz('odenmisSiparisler', []);
        changed = true;
    }

    if (changed) {
         console.log("Başlangıç verileri yüklendi.");
    } else {
        console.log("Mevcut veriler kullanılıyor.");
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
});