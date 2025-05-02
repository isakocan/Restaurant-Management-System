let calisanlar = ["Ali", "Ayşe"];
let menu = [
  { ad: "Köfte", kategori: "anayemek", fiyat: 120 },
  { ad: "Kola", kategori: "icecek", fiyat: 30 }
];
let rapor = [
  { ad: "Köfte", adet: 4, toplam: 480 },
  { ad: "Kola", adet: 3, toplam: 90 }
];

function calisanEkle() {
  const ad = document.getElementById("yeniCalisan").value;
  if (ad) {
    calisanlar.push(ad);
    document.getElementById("yeniCalisan").value = "";
    guncelleCalisanListesi();
  }
}

function guncelleCalisanListesi() {
  const liste = document.getElementById("calisanListesi");
  liste.innerHTML = "";
  calisanlar.forEach((c, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${c} <button onclick="calisanSil(${i})">Sil</button>`;
    liste.appendChild(li);
  });
}

function calisanSil(i) {
  calisanlar.splice(i, 1);
  guncelleCalisanListesi();
}

function urunEkle() {
  const ad = document.getElementById("urunAd").value;
  const kategori = document.getElementById("urunKategori").value;
  const fiyat = parseFloat(document.getElementById("urunFiyat").value);
  if (ad && kategori && fiyat) {
    menu.push({ ad, kategori, fiyat });
    document.getElementById("urunAd").value = "";
    document.getElementById("urunKategori").value = "";
    document.getElementById("urunFiyat").value = "";
    guncelleMenuListesi();
  }
}

function guncelleMenuListesi() {
  const liste = document.getElementById("menuListesi");
  liste.innerHTML = "";
  menu.forEach((u, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${u.ad} (${u.kategori}) - ${u.fiyat} TL <button onclick="urunSil(${i})">Sil</button>`;
    liste.appendChild(li);
  });
}

function urunSil(i) {
  menu.splice(i, 1);
  guncelleMenuListesi();
}

function guncelleRapor() {
  const liste = document.getElementById("raporListesi");
  let toplam = 0;
  liste.innerHTML = "";
  rapor.forEach(r => {
    const li = document.createElement("li");
    li.innerText = `${r.ad}: ${r.adet} adet - ${r.toplam} TL`;
    toplam += r.toplam;
    liste.appendChild(li);
  });
  document.getElementById("toplamCiro").innerText = toplam;
}

guncelleCalisanListesi();
guncelleMenuListesi();
guncelleRapor();
