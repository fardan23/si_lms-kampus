/* ---------- Pages ---------- */
const head = (t, s) =>
  `<div style="margin-bottom:1.2rem"><h2 style="font-size:1.4rem">${t}</h2><div class="mu">${s || ""}</div></div>`;
const semSel = (id = "ss") =>
  `<select class="inp" style="width:auto" id="${id}" aria-label="Pilih semester">${Object.keys(
    SEM,
  )
    .map(
      (k) =>
        `<option ${k == sem ? "selected" : ""}>${k}${SEM[k].aktif ? " (aktif)" : ""}</option>`,
    )
    .join("")}</select>`;
function dashboard() {
  const s = SEM[sem],
    cs = cur();
  const dl = DL.map((d, i) => d.concat("t" + i)).filter((d) => !DEL[d[4]]),
    na = NOTIF.map((n, i) => n.concat("a" + i)).filter((n) => !DEL[n[3]]);
  return `<div class="hero">${av(U.nama, 64, U.foto)}<div><h2>Halo, ${U.nama.split(" ")[0]}!</h2><div style="opacity:.9;margin:.2rem 0 .6rem">Selamat datang kembali di LMS UNINDRA.</div><span class="chip">Kelas ${U.kelas}</span> <span class="chip">${U.prodi}</span> <span class="chip">Jenjang ${U.jenjang}</span></div></div>
<div class="grid g4" style="margin:1.25rem 0"><div class="card"><div class="mu">Mata kuliah</div><h2>${cs.length}</h2></div><div class="card"><div class="mu">Total SKS</div><h2>${cs.reduce((a, c) => a + c.sks, 0)}</h2></div><div class="card"><div class="mu">Kehadiran rata-rata</div><h2>${Math.round(cs.reduce((a, c) => a + pct(att(c)), 0) / cs.length)}%</h2></div><div class="card"><div class="mu">Tugas belum selesai</div><h2>3</h2></div></div>
${s.aktif ? `<div class="row pos" style="gap:.6rem;margin:1.25rem 0 0;flex-wrap:wrap">${nblk("d4", "task", "Tenggat terdekat", "b-er", dl)}${nblk("d5", "mega", "Pengumuman", "b-in", na)}</div>` : ""}
<div class="row" style="flex-wrap:wrap;margin:1.25rem 0 1rem"><div><h4>Daftar kelas</h4><div class="mu">Semester ${sem}${s.aktif ? " · sedang berjalan" : " · arsip"}</div></div><span class="sp"></span><span class="mu">${ic("arch", 16)}</span>${semSel()}</div>
<div class="grid g3">${cs
    .map((c) => {
      const p = Math.round((SEM[sem].week / 16) * 100);
      return `<div class="card course" style="--c:${c.color}" data-r="kelas/${c.id}"><div class="row"><span class="badge b-pr">${c.kode}</span><span class="sp"></span><span class="mu">${c.sks} SKS · ${c.kelas}</span></div><h4 style="margin:.7rem 0 .8rem">${nm(c)}</h4>
<div class="row">${av(c.dosen, 42)}<div style="min-width:0"><b style="color:var(--hd);font-size:.875rem">${c.dosen}</b><div class="mu">📞 ${c.tel}</div></div></div>
<div class="row mu" style="margin:.9rem 0 .6rem;flex-wrap:wrap"><span>👥 ${c.peserta} peserta</span><span>📘 ${c.rps} pertemuan RPS</span></div><div class="bar"><span style="width:${p}%;background:${c.color}"></span></div><div class="mu" style="margin-top:.3rem">Pertemuan ${SEM[sem].week} dari 16 · ${c.hari}, ${c.jam} · ${c.ruang}</div></div>`;
    })
    .join("")}</div>
`;
}
function presensi() {
  const cs = cur(),
    as = cs.map(att),
    ps = as.map(pct);
  const cnt = (k) => as.flat().filter((x) => x == k).length;
  const ab = as.map((a) => a.filter((x) => x == "T").length),
    k0 = ab.filter((n) => n == 0).length,
    k1 = ab.filter((n) => n > 0 && n <= 3).length,
    k2 = ab.filter((n) => n > 3).length,
    H = cnt("H"),
    T = cnt("T"),
    hp = Math.round((H / (H + T)) * 100);
  return `<div class="row" style="flex-wrap:wrap;margin-bottom:1.2rem"><div><h2 style="font-size:1.4rem">Presensi</h2><div class="mu">Rekap kehadiran semester ${sem}${SEM[sem].aktif ? " · sedang berjalan" : " · arsip"}</div></div><span class="sp"></span>${semSel()}</div><div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr))"><div class="card"><h4>Grafik kehadiran keseluruhan</h4><div class="mu">Akumulasi seluruh mata kuliah</div><div class="row" style="gap:1.5rem;flex-wrap:wrap;justify-content:center;margin-top:1rem"><svg viewBox="0 0 140 140" width="160" height="160" role="img" aria-label="Kehadiran ${hp}%"><circle cx="70" cy="70" r="54" fill="none" stroke="var(--er)" stroke-width="18"/><circle cx="70" cy="70" r="54" fill="none" stroke="var(--ok)" stroke-width="18" stroke-dasharray="${((H / (H + T)) * 339.29).toFixed(1)} 339.29" transform="rotate(-90 70 70)"/><text x="70" y="77" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--hd)">${hp}%</text></svg><div>${[
    ["Hadir", H, "p-H"],
    ["Tidak hadir", T, "p-T"],
  ]
    .map(
      (r) =>
        `<div class="row" style="padding:.4rem 0"><span class="pd ${r[2]}"></span>${r[0]}<span class="sp" style="min-width:1.5rem"></span><b style="color:var(--hd)">${r[1]} pertemuan</b></div>`,
    )
    .join("")}</div></div></div>
<div class="card"><h4 style="margin-bottom:.3rem">Rekapitulasi status kehadiran</h4><div class="mu" style="margin-bottom:.6rem">Ketentuan: maksimum ketidakhadiran adalah 3 pertemuan per mata kuliah.</div>${[
    ["Hadir penuh (tanpa ketidakhadiran)", k0, "b-ok"],
    ["Maksimal 3 pertemuan tidak hadir", k1, "b-wr"],
    ["Lebih dari 3 pertemuan tidak hadir", k2, "b-er"],
  ]
    .map(
      (r) =>
        `<div class="row" style="padding:.6rem 0;border-bottom:1px solid var(--bd)"><span class="badge ${r[2]}" style="min-width:28px;text-align:center">${r[1]}</span>${r[0]}</div>`,
    )
    .join(
      "",
    )}<div class="mu" style="margin-top:.6rem">Total mata kuliah: ${cs.length}</div></div></div>
<div class="card" style="margin-top:1.25rem;padding:0"><div class="tw"><table><thead><tr><th>No</th><th>Kode MK</th><th>Mata Kuliah</th><th>SKS</th><th>Dosen</th><th>No HP Pengajar</th><th>Kelas</th><th>Hari</th><th>Waktu</th><th>Ruang</th><th>Pertemuan (1–16)</th><th>Hadir</th><th>Aksi</th></tr></thead><tbody>
${cs.map((c, i) => `<tr><td>${i + 1}</td><td><span class="badge b-pr">${c.kode}</span></td><td><a data-r="kelas/${c.id}" style="cursor:pointer">${nm(c)}</a></td><td>${c.sks}</td><td>${c.dosen}</td><td>${c.tel}</td><td>${c.kelas}</td><td>${c.hari}</td><td>${c.jam}</td><td>${c.ruang}</td><td>${as[i].map((x, j) => `<span class="pd p-${x}" title="Pertemuan ${j + 1}">${x == "x" ? "" : x}</span>`).join("")}</td><td><span class="badge ${ab[i] > 3 ? "b-er" : ab[i] > 0 ? "b-wr" : "b-ok"}">${ps[i]}%</span></td><td><button class="btn s l" data-r="kelas/${c.id}">Detail</button></td></tr>`).join("")}</tbody><tfoot><tr><td colspan="3"><b style="color:var(--hd)">Jumlah</b></td><td><b style="color:var(--hd)">${cs.reduce((a, c) => a + c.sks, 0)}</b></td><td colspan="9"></td></tr></tfoot></table></div></div>
<div class="lg mu"><div class="lgs"><span><span class="pd p-H">H</span> Hadir</span><span><span class="pd p-T">T</span> Tidak hadir</span><span><span class="pd p-x"></span> Belum berlangsung</span></div><div class="lgs"><span>Persentase kehadiran:</span><span class="badge b-ok">Hadir penuh</span><span class="badge b-wr">Maksimal 3 pertemuan tidak hadir</span><span class="badge b-er">&gt; 3 pertemuan tidak hadir</span></div></div>`;
}
const MTOP = {
  KK43K326: [
    "Besaran dan Satuan Fisika",
    "Kinematika Partikel",
    "Dinamika Newton",
    "Usaha dan Energi",
    "Momentum dan Tumbukan",
    "Gerak Rotasi",
    "Osilasi Harmonik",
    "Pengantar Simulasi Numerik",
  ],
  KK43K330: [
    "Pengenalan Python",
    "Variabel dan Tipe Data",
    "Percabangan dan Perulangan",
    "Fungsi dan Modul",
    "List, Tuple, dan Dictionary",
    "Pengolahan File",
    "Pemrograman Berorientasi Objek",
    "Penanganan Kesalahan",
  ],
  KB43J346: [
    "Konsep Dasar Jaringan Komputer",
    "Model OSI dan TCP/IP",
    "Media Transmisi",
    "Pengalamatan IP",
    "Subnetting",
    "Routing Statis",
    "Protokol Lapisan Transport",
    "Layanan DNS dan DHCP",
  ],
  KK43J319: [
    "Pengantar Statistika",
    "Penyajian Data",
    "Ukuran Pemusatan",
    "Ukuran Penyebaran",
    "Peluang Dasar",
    "Distribusi Probabilitas",
    "Distribusi Sampling",
    "Estimasi Parameter",
  ],
  KK43J321: [
    "Pengantar Struktur Data",
    "Array",
    "Linked List",
    "Stack",
    "Queue",
    "Rekursi",
    "Tree",
    "Graph",
  ],
  KK43J322: [
    "Persiapan Lingkungan Praktikum",
    "Praktik Array",
    "Praktik Linked List",
    "Praktik Stack",
    "Praktik Queue",
    "Praktik Rekursi",
    "Praktik Tree",
    "Praktik Graph",
  ],
  KK43J324: [
    "Konsep Sistem Informasi",
    "Komponen Sistem Informasi",
    "Siklus Pengembangan Sistem",
    "Analisis Kebutuhan",
    "Pemodelan Proses",
    "Pemodelan Data",
    "Perancangan Antarmuka",
    "Implementasi dan Pengujian",
  ],
  KK43J347: [
    "Logika Proposisi",
    "Himpunan",
    "Relasi dan Fungsi",
    "Induksi Matematika",
    "Kombinatorika",
    "Teori Graf",
    "Pohon",
    "Aljabar Boolean",
  ],
  BB43J251: [
    "Pengantar Komputer dan Masyarakat",
    "Sejarah Perkembangan Teknologi",
    "Dampak Sosial Teknologi Informasi",
    "Etika Profesi Informatika",
    "Privasi dan Keamanan Data",
    "Hak Kekayaan Intelektual",
    "Kejahatan Siber",
    "Tata Kelola Teknologi Informasi",
  ],
  KB43J215: [
    "Sistem Bilangan",
    "Aljabar Boolean",
    "Gerbang Logika",
    "Rangkaian Kombinasional",
    "Multiplexer dan Decoder",
    "Flip-Flop",
    "Rangkaian Sekuensial",
    "Counter dan Register",
  ],
  KK43J212: [
    "Analisis Kompleksitas",
    "Algoritma Pencarian",
    "Pengurutan Sederhana",
    "Merge Sort dan Quick Sort",
    "Divide and Conquer",
    "Algoritma Greedy",
    "Pemrograman Dinamis",
    "Backtracking",
  ],
  KK43J213: [
    "Proposisi dan Konektif Logika",
    "Tabel Kebenaran",
    "Ekuivalensi Logika",
    "Kuantor",
    "Metode Pembuktian",
    "Argumen Valid",
    "Induksi Matematika",
    "Aplikasi Logika",
  ],
  KK43J216: [
    "Technical Vocabulary",
    "Reading Technical Texts",
    "Writing Emails",
    "Describing Systems",
    "Giving Presentations",
    "Reading Documentation",
    "Writing Reports",
    "Job Interview",
  ],
  KK43J229: [
    "Review Dasar Pemrograman",
    "Pemrograman Berorientasi Objek",
    "Pewarisan",
    "Polimorfisme",
    "Penanganan Pengecualian",
    "Struktur Data Koleksi",
    "Pemrosesan Berkas",
    "Antarmuka Grafis",
  ],
  KK43J238: [
    "Fungsi Dua Variabel",
    "Turunan Parsial",
    "Diferensial Total",
    "Nilai Ekstrem",
    "Integral Lipat Dua",
    "Integral Lipat Tiga",
    "Barisan dan Deret",
    "Deret Pangkat",
  ],
  PK43J203: [
    "Konsep Kewarganegaraan",
    "Identitas Nasional",
    "Hak dan Kewajiban Warga Negara",
    "Demokrasi Indonesia",
    "Hak Asasi Manusia",
    "Negara dan Konstitusi",
    "Otonomi Daerah",
    "Ketahanan Nasional",
  ],
  KK43J108: [
    "Greetings and Introductions",
    "Simple Present Tense",
    "Daily Activities",
    "Reading Comprehension",
    "Past Tense",
    "Listening Practice",
    "Writing Paragraphs",
    "Speaking Practice",
  ],
  KK43J110: [
    "Konsep Dasar Teknologi Informasi",
    "Perangkat Keras",
    "Perangkat Lunak",
    "Sistem Operasi",
    "Jaringan dan Internet",
    "Basis Data Dasar",
    "Keamanan Informasi",
    "Tren Teknologi Terkini",
  ],
  KK43J111: [
    "Konsep Algoritma",
    "Flowchart dan Pseudocode",
    "Variabel dan Operator",
    "Percabangan",
    "Perulangan",
    "Array",
    "Fungsi dan Prosedur",
    "Pengurutan Sederhana",
  ],
  KK43J128: [
    "Pengenalan Bahasa Pemrograman",
    "Tipe Data dan Variabel",
    "Operator dan Ekspresi",
    "Struktur Percabangan",
    "Struktur Perulangan",
    "Array dan String",
    "Fungsi",
    "Pengenalan Berkas",
  ],
  KK43J137: [
    "Fungsi dan Grafik",
    "Limit Fungsi",
    "Kekontinuan",
    "Turunan",
    "Aturan Rantai",
    "Aplikasi Turunan",
    "Integral Tak Tentu",
    "Integral Tentu",
  ],
  PK43J101: [
    "Hakikat Manusia dan Agama",
    "Keimanan dan Ketakwaan",
    "Akhlak dan Etika",
    "Ilmu Pengetahuan dan Agama",
    "Toleransi Beragama",
    "Hukum dan Keadilan",
    "Peran Agama dalam Masyarakat",
    "Agama dan Teknologi",
  ],
  PK43J102: [
    "Sejarah Lahirnya Pancasila",
    "Pancasila sebagai Dasar Negara",
    "Pancasila sebagai Ideologi",
    "Pancasila sebagai Sistem Filsafat",
    "Pancasila dan Etika Bernegara",
    "Pancasila dan Demokrasi",
    "Pancasila dan Hukum",
    "Pancasila di Era Global",
  ],
  PK43J107: [
    "Ragam Bahasa",
    "Ejaan dan Tanda Baca",
    "Diksi dan Kalimat Efektif",
    "Paragraf",
    "Penulisan Ilmiah",
    "Kutipan dan Daftar Pustaka",
    "Penulisan Laporan",
    "Presentasi Ilmiah",
  ],
};
const tp = (c, w) => {
  const a = MTOP[c.kode] || [];
  return w == 16
    ? "Rangkuman dan Persiapan Ujian Akhir"
    : w <= 8
      ? a[w - 1]
      : "Penerapan dan Studi Kasus: " + a[w - 9];
};
const BASE = {
    "Ganjil 2026/2027": new Date(2026, 7, 10),
    "Genap 2025/2026": new Date(2026, 1, 16),
    "Ganjil 2025/2026": new Date(2025, 7, 11),
  },
  NOW = new Date(2026, 8, 28, 10, 0);
const MN = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ],
  p2 = (n) => String(n).padStart(2, "0");
const fmtD = (d) =>
  `${d.getDate()} ${MN[d.getMonth()]} ${d.getFullYear()}, ${p2(d.getHours())}:${p2(d.getMinutes())}`;
const smOf = (c) => Object.keys(SEM).find((q) => SEM[q].c.includes(c));
function tw(c, w) {
  const sm = smOf(c),
    b = BASE[sm],
    ws = new Date(
      b.getFullYear(),
      b.getMonth(),
      b.getDate() + (w - 1) * 7,
      8,
      0,
    ),
    S = SEM[sm];
  const st =
    S.aktif && w == S.week && c.id % 3 == 0
      ? new Date(ws.getTime() + 2 * 864e5)
      : ws;
  return [
    st,
    new Date(ws.getFullYear(), ws.getMonth(), ws.getDate() + 6, 23, 59),
  ];
}
const TST = ["done", "closed", "wait", "open"];
function ts(c, w, key) {
  if (done[key]) return "done";
  const n = w / 2;
  return TST[(n - 1 + c.id) % 4];
}
function twS(c, w, S) {
  const d = (n) =>
    new Date(NOW.getTime() + n * 864e5 + ((c.id * 7 + w * 13) % 5) * 36e5);
  if (S == "wait") return [d(2 + (w % 4)), d(9 + (w % 4))];
  if (S == "closed") return [d(-8 - (w % 4)), d(-1 - (w % 3))];
  if (S == "open") return [d(-2 - (w % 3)), d(3 + (w % 4))];
  return tw(c, w);
}
const KST1 = ["done", "closed"],
  ACTIVE_KST1 = ["closed", "done", "open"];
function kt(c, w, key) {
  if (done[key]) return "done";
  const n = w / 4;
  return n == 1
    ? smOf(c) == "Ganjil 2026/2027"
      ? ACTIVE_KST1[c.id % ACTIVE_KST1.length]
      : KST1[c.id % KST1.length]
    : "open";
}
function ktW(c, w, S) {
  const d = (n) =>
    new Date(NOW.getTime() + n * 864e5 + ((c.id * 7 + w * 13) % 5) * 36e5);
  if (S == "wait") return [d(2 + (w % 4)), d(9 + (w % 4))];
  if (S == "closed") return [d(-8 - (w % 4)), d(-1 - (w % 3))];
  if (S == "open") return [d(-2 - (w % 3)), d(3 + (w % 4))];
  return tw(c, w);
}
let RD = {},
  DEL = {},
  SUB = {},
  TH = {},
  STG = {},
  DRAFTN = {};
const DL = [
  ["Tugas 4: Penanganan Kesalahan", "Pemrograman Python", "4 Okt", "b-er"],
  [
    "Tugas 4: Pengantar Simulasi Numerik",
    "Fisika Komputasi Dasar",
    "4 Okt",
    "b-wr",
  ],
  ["Tugas 4: Graph", "Struktur Data", "4 Okt", "b-in"],
];
const isDos = (n) => D.some((d) => d[0] == n),
  who = (n) =>
    n +
    (isDos(n)
      ? ' <span class="badge b-pr" style="font-size:.65rem">Pengajar</span>'
      : "");
const sideCls = () =>
  cur()
    .slice()
    .sort(
      (a, b) =>
        ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].indexOf(a.hari) -
          ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].indexOf(b.hari) ||
        a.jam.localeCompare(b.jam),
    )
    .map(
      (c) =>
        `<div class="mi" data-r="kelas/${c.id}"><span class="dot" style="background:${c.color};margin:0;width:10px;height:10px;flex:none"></span><div><span style="white-space:normal">${nm(c)}</span><small>${c.hari}, ${c.jam}</small></div></div>`,
    )
    .join("");
