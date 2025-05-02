document.getElementById("calisan-adi").innerText = localStorage.getItem("calisan") || "Anonim";

let bekleyenSiparisler = [
  { id: 1, masa: "Masa 3", saat: "14:15", detay: ["2x Köfte", "1x Ayran"], toplam: 150 },
  { id: 2, masa: "Masa 1", saat: "14:18", detay: ["1x Baklava", "1x Kola"], toplam: 80 }
];

let aldigimSiparisler = [];

function guncelleListeler() {
  const bekleyenListesi = document.getElementById("bekleyen-listesi");
  bekleyenListesi.innerHTML = "";
  bekleyenSiparisler.forEach((s, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>#${s.id}</strong> - ${s.masa} - ${s.saat}
      <button onclick="siparisAl(${index})">Al</button>
      <button onclick="detayGoster(this, ${index}, 'bekleyen')">Detaylar</button>
    `;
    bekleyenListesi.appendChild(li);
  });

  const aldigimListesi = document.getElementById("aldigim-listesi");
  aldigimListesi.innerHTML = "";
  aldigimSiparisler.forEach((s, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>#${s.id}</strong> - ${s.masa} - ${s.saat} - <strong>${s.toplam} TL</strong>
      <button onclick="siparisKapat(${index})">Ödeme Alındı</button>
      <button onclick="detayGoster(this, ${index}, 'aldigim')">Detaylar</button>
    `;
    aldigimListesi.appendChild(li);
  });
}

function siparisAl(i) {
  const siparis = bekleyenSiparisler.splice(i, 1)[0];
  aldigimSiparisler.push(siparis);
  guncelleListeler();
}

function siparisKapat(i) {
  aldigimSiparisler.splice(i, 1);
  guncelleListeler();
}

function detayGoster(btn, i, tip) {
  const siparis = (tip === "bekleyen" ? bekleyenSiparisler : aldigimSiparisler)[i];
  let detay = document.createElement("div");
  detay.innerHTML = `<ul>${siparis.detay.map(d => `<li>${d}</li>`).join("")}</ul>`;
  btn.parentNode.appendChild(detay);
  btn.remove();
}

function cikisYap() {
  localStorage.removeItem("calisan");
  window.location.href = "giris.html";
}

guncelleListeler();
