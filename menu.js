const urunler = {
  anayemek: [
    { ad: "Köfte", fiyat: 120 },
    { ad: "Tavuk Izgara", fiyat: 100 }
  ],
  icecek: [
    { ad: "Kola", fiyat: 30 },
    { ad: "Ayran", fiyat: 20 }
  ],
  tatli: [
    { ad: "Baklava", fiyat: 50 },
    { ad: "Sütlaç", fiyat: 40 }
  ]
};

let sepet = [];

function kategoriSec(kategori) {
  const liste = urunler[kategori];
  const urunlerDiv = document.getElementById("urunler");
  urunlerDiv.innerHTML = "";

  liste.forEach(u => {
    const kart = document.createElement("div");
    kart.className = "urun-karti";
    kart.innerHTML = `
      <h3>${u.ad}</h3>
      <p>${u.fiyat} TL</p>
      <button onclick='sepeteEkle("${u.ad}", ${u.fiyat})'>Sepete Ekle</button>
    `;
    urunlerDiv.appendChild(kart);
  });
}

function sepeteEkle(ad, fiyat) {
  sepet.push({ ad, fiyat });
  sepetiGuncelle();
}

function sepetiGuncelle() {
  const liste = document.getElementById("sepet-listesi");
  const toplamSpan = document.getElementById("toplam");
  liste.innerHTML = "";
  let toplam = 0;

  sepet.forEach((u, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${u.ad} - ${u.fiyat} TL <button onclick="sepettenCikar(${i})">Sil</button>`;
    liste.appendChild(li);
    toplam += u.fiyat;
  });

  toplamSpan.innerText = toplam;
}

function sepettenCikar(i) {
  sepet.splice(i, 1);
  sepetiGuncelle();
}

function temizleSepet() {
  sepet = [];
  sepetiGuncelle();
}

function onaylaSepet() {
  alert("Sipariş onaylandı!");
  temizleSepet();
}
