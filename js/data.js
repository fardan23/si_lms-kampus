const P = {
  home: "M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z",
  cal: "M4 5h16v16H4zM4 10h16M8 3v4M16 3v4",
  book: "M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6M20 4v14h-6",
  mail: "M3 5h18v14H3zM3 7l9 7 9-7",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4",
  help: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.7M12 17h.01",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  out: "M9 21H5V3h4M16 17l5-5-5-5M21 12H9",
  menu: "M3 6h18M3 12h18M3 18h18",
  file: "M6 2h9l5 5v15H6zM14 2v6h6M9 13h7M9 17h7",
  quiz: "M9 11l3 3 8-8M20 12v8H4V4h11",
  chat: "M21 12a8 8 0 0 1-11.5 7L3 21l2-5.5A8 8 0 1 1 21 12z",
  task: "M9 3h6v3H9zM6 5H4v16h16V5h-2M8 12h8M8 16h5",
  video: "M3 6h13v12H3zM16 10l5-3v10l-5-3",
  moon: "M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-5-5",
  arch: "M3 4h18v4H3zM5 8v12h14V8M10 12h4",
  mega: "M3 11v3h4l8 5V6L7 11zM19 8a5 5 0 0 1 0 8",
  check: "M5 13l4 4L19 7",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
};
const ic = (n, s) =>
  `<svg class="i" ${s ? `style="width:${s}px;height:${s}px"` : ""} viewBox="0 0 24 24"><path d="${P[n]}"/></svg>`;
const COL = [
  "#696cff",
  "#03c3ec",
  "#71dd37",
  "#ffab00",
  "#ff3e1d",
  "#8592a3",
  "#e83e8c",
];
const ini = (n) =>
  n
    .replace(/^(Dr\.?|Prof\.|Ir\.)\s*/, "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
const av = (n, s = 40, img) =>
  `<div class="av" style="width:${s}px;height:${s}px;font-size:${s * 0.38}px;background-color:${COL[[...n].reduce((a, c) => a + c.charCodeAt(0), 0) % 7]};${img ? `background-image:url(${img})` : ""}">${img ? "" : ini(n)}</div>`;
const U = {
  nim: "2210511001",
  nama: "Aditya Pratama",
  tipe: "Mahasiswa",
  email: "aditya.pratama@mhs.kampus.ac.id",
  tel: "0857-1234-5678",
  kelas: "Reguler RO",
  prodi: "Teknik Informatika",
  jenjang: "S1",
  foto: null,
  online: sessionStorage.getItem("lmsOnline") === "true",
  login: "28 Sep 2026, 07:45 WIB",
};
const D = [
  ["Didik Wiguna M.Kom", "087877113444"],
  ["Naely Farkhatin M.Kom.", "085215603600"],
  ["M. Candra Irawan M.Pd.", "085771314236"],
  ["Dr. Intan Mutia S.T., M.M.S.I.", "081398755258"],
  ["Rifki Ristiawan S.Pd., M.Si.", "085780051361"],
  ["Intan Vandini M.Pd.", "085714081323"],
  ["Nilma M.Kom.", "081281249401"],
  ["Rahmawati Yuliyani S.Si., M.Pd.", "08561299991"],
  ["Nur Alamsyah M.Pd.", "085721198786"],
  ["Adhityo Kuncoro S.S., M.Pd.", "085717610827"],
  ["Rizki Rizkyatul Basir S.Kom., M.Kom", "08561643331"],
  ["Agus Riyanto M.Kom.", "081383730942"],
  ["Dr. Lidya Natalia Sartono M.Pd.", "085245113968"],
  ["Abdurahman S.T., M.T.", "081908124438"],
  ["Ade Kurnia Solihin M.Pd., M.Kom.", "085733399058"],
  ["Nur Ali M.A.", "08128050042"],
  ["Laksita Nirmala Putri S.A.P., M.Pd.", "085774755830"],
  ["Dyah Rhetno W. S.Kom., M.M.S.I.", "08179868417"],
  ["Dr Natalia Tri Astuti M.Pd.", "082124987535"],
  ["Laksana Priyo Abadi M.Kom.", "08151603558"],
  ["Indah Lestari M.Pd.", "085697267825"],
  ["Noor Komari Pratiwi M.Pd.", "08159914272"],
];
const fmt = (t) => t.replace(/^(\d{4})(\d{4})(\d+)$/, "$1-$2-$3");
const mk = (id, kode, nama, d, hari, jam, ruang, peserta, sks, o = {}) => ({
  id,
  kode,
  nama,
  dosen: D[d][0],
  tel: fmt(D[d][1]),
  hari,
  jam,
  ruang,
  peserta,
  sks,
  rps: 16,
  kelas: "Reguler RO",
  status: "Disetujui",
  ket: o.ket,
  abs: o.abs,
  color: COL[id % 7],
});
const nm = (c) =>
  c.nama +
  (c.ket
    ? ` <span style="opacity:.6;font-size:.75em;font-weight:400">${c.ket}</span>`
    : "");
const SEM = {
  "Ganjil 2026/2027": {
    aktif: 1,
    week: 8,
    c: [
      mk(
        1,
        "KK43K326",
        "Fisika Komputasi Dasar",
        2,
        "Rabu",
        "15:50 - 17:30",
        "R.7.2-9",
        38,
        2,
        { abs: 0 },
      ),
      mk(
        2,
        "KK43K330",
        "Pemrograman Python",
        0,
        "Selasa",
        "09:30 - 12:00",
        "R.7.4-5",
        36,
        3,
        { ket: "#)", abs: 1 },
      ),
      mk(
        3,
        "KB43J346",
        "Jaringan Komputer",
        1,
        "Selasa",
        "07:00 - 09:30",
        "R.7.4-5",
        40,
        3,
        { ket: "*) ##)", abs: 3 },
      ),
      mk(
        4,
        "KK43J319",
        "Statistika Dasar",
        5,
        "Jumat",
        "13:00 - 15:30",
        "R.7.4-2",
        42,
        3,
        { abs: 2 },
      ),
      mk(
        5,
        "KK43J321",
        "Struktur Data",
        6,
        "Jumat",
        "15:30 - 17:10",
        "R.7.4-2",
        42,
        2,
        { ket: "*)", abs: 3 },
      ),
      mk(
        6,
        "KK43J322",
        "Praktikum Struktur Data",
        6,
        "Jumat",
        "17:10 - 18:00",
        "R.7.4-2",
        21,
        1,
        { ket: "#)", abs: 5 },
      ),
      mk(
        7,
        "KK43J324",
        "Sistem Informasi",
        3,
        "Kamis",
        "09:30 - 12:00",
        "R.7.4-5",
        38,
        3,
        { abs: 4 },
      ),
      mk(
        8,
        "KK43J347",
        "Matematika Diskrit",
        4,
        "Kamis",
        "07:00 - 09:30",
        "R.7.4-5",
        40,
        3,
        { abs: 0 },
      ),
    ],
  },
  "Genap 2025/2026": {
    week: 16,
    c: [
      mk(
        11,
        "BB43J251",
        "Komputer dan Masyarakat",
        11,
        "Rabu",
        "07:30 - 09:10",
        "R.7.2-7",
        40,
        2,
      ),
      mk(
        12,
        "KB43J215",
        "Sistem Digital",
        13,
        "Jumat",
        "13:00 - 15:30",
        "R.7.2-3",
        40,
        3,
        { ket: "##)", abs: 4 },
      ),
      mk(
        13,
        "KK43J212",
        "Algoritma 2",
        14,
        "Jumat",
        "15:30 - 18:00",
        "R.7.2-3",
        40,
        3,
        { ket: "*) #)", abs: 3 },
      ),
      mk(
        14,
        "KK43J213",
        "Logika Matematika",
        7,
        "Senin",
        "07:30 - 09:10",
        "R.7.2-7",
        40,
        2,
        { abs: 0 },
      ),
      mk(
        15,
        "KK43J216",
        "Bahasa Inggris Informatika",
        9,
        "Selasa",
        "10:20 - 12:00",
        "R.7.2-7",
        40,
        2,
      ),
      mk(
        16,
        "KK43J229",
        "Pemrograman 2",
        10,
        "Selasa",
        "07:00 - 09:30",
        "R.7.2-7",
        40,
        3,
        { ket: "*) #)", abs: 5 },
      ),
      mk(
        17,
        "KK43J238",
        "Kalkulus Lanjut",
        8,
        "Senin",
        "09:10 - 10:50",
        "R.7.2-7",
        40,
        2,
      ),
      mk(
        18,
        "PK43J203",
        "Kewarganegaraan",
        12,
        "Rabu",
        "09:10 - 10:50",
        "R.7.2-7",
        40,
        2,
      ),
    ],
  },
  "Ganjil 2025/2026": {
    week: 16,
    c: [
      mk(
        21,
        "KK43J108",
        "Bahasa Inggris",
        18,
        "Kamis",
        "13:40 - 15:20",
        "R.7.2-5",
        42,
        2,
      ),
      mk(
        22,
        "KK43J110",
        "Pengantar Teknologi Informasi",
        19,
        "Kamis",
        "12:00 - 13:40",
        "R.7.2-5",
        42,
        2,
      ),
      mk(
        23,
        "KK43J111",
        "Algoritma 1",
        17,
        "Selasa",
        "12:00 - 13:40",
        "R.5.5-4",
        42,
        2,
        { ket: "*)" },
      ),
      mk(
        24,
        "KK43J128",
        "Pemrograman 1",
        17,
        "Selasa",
        "13:40 - 15:20",
        "R.5.5-4",
        42,
        2,
        { ket: "#)", abs: 3 },
      ),
      mk(
        25,
        "KK43J137",
        "Kalkulus Dasar",
        20,
        "Jumat",
        "07:30 - 09:10",
        "R.7.2-7",
        42,
        2,
        { ket: "*)", abs: 4 },
      ),
      mk(
        26,
        "PK43J101",
        "Agama",
        15,
        "Senin",
        "08:40 - 10:20",
        "R.7.2-5",
        42,
        2,
        { abs: 0 },
      ),
      mk(
        27,
        "PK43J102",
        "Pancasila",
        16,
        "Senin",
        "10:20 - 12:00",
        "R.7.2-5",
        42,
        2,
        { abs: 0 },
      ),
      mk(
        28,
        "PK43J107",
        "Bahasa Indonesia",
        21,
        "Jumat",
        "09:10 - 10:50",
        "R.7.2-7",
        42,
        2,
      ),
    ],
  },
};
let sem = "Ganjil 2026/2027",
  route = "",
  done = {},
  sel = 0,
  msgOpen = 0;
const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
  cur = () =>
    SEM[sem].c
      .slice()
      .sort(
        (a, b) =>
          DAYS.indexOf(a.hari) - DAYS.indexOf(b.hari) ||
          a.jam.localeCompare(b.jam),
      ),
  all = () => Object.values(SEM).flatMap((s) => s.c),
  find = (id) => all().find((c) => c.id == id);
const att = (c) => {
  const w = SEM[Object.keys(SEM).find((k) => SEM[k].c.includes(c))].week;
  return Array.from({ length: 16 }, (_, i) =>
    i >= w
      ? "x"
      : c.abs !== undefined
        ? [3, 5, 1, 6, 2, 7, 4, 0, 9, 11, 13, 8, 10, 12, 14, 15]
            .slice(0, c.abs)
            .includes(i)
          ? "T"
          : "H"
        : (i * 7 + c.id * 3) % 17 == 0 || (i * 5 + c.id) % 13 == 0
          ? "T"
          : "H",
  );
};
const pct = (a) => {
  const n = a.filter((x) => x != "x");
  return Math.round((n.filter((x) => x == "H").length / n.length) * 100);
};
const MSG = [
  [
    "Didik Wiguna M.Kom",
    "Tugas 4: Penanganan Kesalahan",
    "Tugas 4 dapat dikumpulkan sampai 4 Okt 2026 pukul 23:59 dalam format PDF, maks. 5 MB.",
    "10 mnt",
  ],
  [
    "Bagian Akademik",
    "Jadwal UTS diumumkan",
    "UTS Ganjil dimulai 19 Oktober. Kartu ujian dapat dicetak mulai 12 Oktober.",
    "2 jam",
  ],
  [
    "Naely Farkhatin M.Kom.",
    "Materi Pertemuan 8",
    "Slide dan contoh konfigurasi Jaringan Komputer sudah diunggah. Baca sebelum kelas.",
    "Kemarin",
  ],
  [
    "Sistem LMS",
    "Kuis 2 Jaringan Komputer dibuka besok",
    "Kuis 2 dibuka besok pukul 08:00 dan ditutup pukul 23:59.",
    "3 jam",
  ],
  [
    "Perpustakaan",
    "Peminjaman jatuh tempo",
    'Buku "Database System Concepts" jatuh tempo 30 September.',
    "2 hari",
  ],
];
const RP = {
  0: [
    [
      "Rizky Ramadhan",
      "Permisi Pak, boleh dikerjakan di Google Colab atau harus di VS Code?",
      "8 mnt lalu",
    ],
    [
      "Didik Wiguna M.Kom",
      "Boleh, asalkan hasilnya diunggah dalam bentuk file .py ya.",
      "5 mnt lalu",
    ],
  ],
  1: [["Nabila Putri", "Kartu ujian dicetak lewat menu apa ya?", "1 jam lalu"]],
  2: [["Rizky Ramadhan", "Terima kasih Bu, sudah saya unduh.", "Kemarin"]],
};
const NOTIF = [
  ["task", "Tugas 4: Penanganan Kesalahan berbatas 2 hari", "b-er"],
  ["quiz", "Kuis 2 Jaringan Komputer dibuka besok", "b-wr"],
  ["mega", "Pengumuman: UTS dimulai 19 Oktober", "b-in"],
];
const $ = (s) => document.querySelector(s);
function toast(t) {
  const e = $("#toast");
  e.textContent = t;
  e.style.display = "block";
  clearTimeout(toast.t);
  toast.t = setTimeout(() => (e.style.display = "none"), 2600);
}
function go(r) {
  location.hash = r;
}
function modal(h) {
  const m = $("#modal");
  m.dataset.quizKey = "";
  m.innerHTML = h;
  m.classList.add("on");
}
function closeM() {
  $("#modal").classList.remove("on");
}
$("#modal").onclick = (e) => {
  if (e.target.id == "modal") closeM();
};
