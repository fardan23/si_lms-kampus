/* kelas */
const items = (window.itemsOf = (w, c) => {
  const t = tp(c, w);
  if (w == 8 || w == 16) {
    const exam = w == 8 ? "UTS" : c.ket?.includes("*") ? "UPM" : "UAS";
    return [
      [
        "tugas",
        "task",
        `${exam} (Esai): ${t}`,
        `Ujian esai · Batas pengumpulan: ${fmtD(tw(c, w)[1])}`,
        exam,
      ],
    ];
  }
  const a = [
    ["materi", "file", `Slide Pertemuan ${w}: ${t}`, "Slide · PDF"],
    ["materi", "video", `Video Pertemuan ${w}: ${t}`, "YouTube · 18 mnt"],
  ];
  if (w % 2 == 0 && w != 8 && w != 16)
    a.push([
      "tugas",
      "task",
      `Tugas ${w / 2}: ${t}`,
      `Batas pengumpulan: ${fmtD(tw(c, w)[1])}`,
    ]);
  if (w % 4 == 0)
    a.push(["kuis", "quiz", `Kuis ${w / 4}: ${t}`, "10 soal · 20 menit"]);
  if (w % 3 == 0)
    a.push([
      "diskusi",
      "chat",
      `Forum Diskusi: ${t}`,
      "Syarat: minimal 3 komentar",
    ]);
  return a;
});
function kelas(id) {
  const c = find(id);
  if (!c) return head("Kelas tidak ditemukan");
  const sm = smOf(c),
    W = SEM[sm].week,
    f = window.kf || "all";
  const cl = { materi: "b-pr", tugas: "b-wr", kuis: "b-in", diskusi: "b-ok" },
    lb = {
      materi: "Buka",
      tugas: "Kumpulkan",
      kuis: "Mulai kuis",
      diskusi: "Ikut diskusi",
    };
  return `<div class="hero" style="background:linear-gradient(120deg,${c.color},#696cff)"><div><span class="chip">${c.kode} · ${c.sks} SKS</span> <span class="chip">👥 ${c.peserta} peserta</span> <span class="chip">${c.kelas}</span> <span class="chip">${sm}</span><h2 style="margin:.4rem 0">${nm(c)}</h2><div style="opacity:.9">${c.dosen} (${c.tel}) · ${c.hari}, ${c.jam} · ${c.ruang}</div></div></div>
<div class="tabs" role="tablist">${[
    ["all", "Semua"],
    ["materi", "Materi"],
    ["tugas", "Tugas"],
    ["kuis", "Kuis"],
    ["diskusi", "Diskusi"],
  ]
    .map(
      (t) =>
        `<button class="tab ${f == t[0] ? "on" : ""}" data-f="${t[0]}">${t[1]}</button>`,
    )
    .join("")}</div>
${Array.from({ length: 16 }, (_, i) => i + 1)
  .map((w) => {
    const all = itemsOf(w, c),
      it = all.filter((x) => f == "all" || x[0] == f);
    if (!it.length) return "";
    const on = w <= W;
    return `<div class="wk ${w == W ? "open" : ""}"><div class="h" data-wk="1"><span class="badge b-pr" style="${on ? "" : "background:var(--bd);color:var(--mu)"}">${w}</span><b style="color:var(--hd)">Pertemuan ${w}: ${tp(c, w)}</b><span class="sp"></span><span class="mu">${on ? it.length + " item" : "Belum dibuka"}</span></div><div class="b">${
      on
        ? it
            .map((x) => {
              const k = all.indexOf(x),
                key = c.id + "-" + w + "-" + k,
                ty = x[0],
                st =
                  ty == "tugas"
                    ? x[4]
                      ? done[key]
                        ? "done"
                        : "open"
                      : ts(c, w, key)
                    : ty == "kuis"
                      ? kt(c, w, key)
                      : ty == "diskusi"
                        ? done[key]
                          ? "done"
                          : "open"
                        : ty == "materi"
                          ? att(c)[w - 1] == "H"
                            ? "done"
                            : "open"
                          : "open";
              const act =
                ty == "materi"
                  ? st == "done"
                    ? '<span class="badge b-ok">Sudah dipelajari</span>'
                    : '<span class="badge b-wr">Belum dipelajari</span>'
                  : st == "done"
                    ? '<span class="badge b-ok">Selesai</span>'
                    : st == "closed"
                      ? '<span class="badge b-er">Ditutup</span>'
                      : st == "wait"
                        ? '<span class="badge b-wr">Belum dimulai</span>'
                        : `<button class="btn s">${lb[ty]}</button>`;
              return `<div class="it" data-d="${c.id}|${w}|${k}" style="cursor:pointer"><span class="ic ${cl[ty]}">${ic(x[1])}</span><div><b style="color:var(--hd)">${x[2]}</b><div class="mu">${x[3]}</div></div><span class="sp"></span>${act}</div>`;
            })
            .join("")
        : '<div class="it mu">Materi dibuka sesuai jadwal pertemuan.</div>'
    }</div></div>`;
  })
  .join("")}`;
}
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-f]");
  if (t) {
    window.kf = t.dataset.f;
    render();
  }
  const h = e.target.closest("[data-wk]");
  if (h) h.parentNode.classList.toggle("open");
  const dd = e.target.closest("[data-d]");
  if (dd) {
    const p = dd.dataset.d.split("|");
    showItem(+p[0], +p[1], +p[2]);
  }
});
const TY = {
  materi: ["Materi", "b-pr"],
  tugas: ["Tugas", "b-wr"],
  kuis: ["Kuis", "b-in"],
  diskusi: ["Diskusi", "b-ok"],
};
const QUIZ_DURATION_MS = 20 * 60 * 1000;
const QUIZ_RUN = {};
let quizClock = null;
const QUIZ_BANK = {
  KB43J346: [
    {
      question:
        "Pada model OSI, lapisan yang menangani pengalamatan logis dan routing paket adalah ...",
      options: ["Fisik", "Jaringan", "Transport", "Presentasi"],
      answer: 1,
    },
    {
      question:
        "Lapisan Internet pada model TCP/IP paling dekat dengan lapisan ... pada model OSI.",
      options: ["Aplikasi", "Transport", "Jaringan", "Data Link"],
      answer: 2,
    },
    {
      question: "Fungsi utama DNS adalah ...",
      options: [
        "Menerjemahkan nama domain menjadi alamat IP",
        "Mengenkripsi semua lalu lintas jaringan",
        "Membagikan alamat IP secara dinamis",
        "Mengirim email antarserver",
      ],
      answer: 0,
    },
    {
      question: "Layanan DHCP membantu perangkat dengan cara ...",
      options: [
        "Menyimpan halaman web",
        "Membagikan konfigurasi IP secara otomatis",
        "Menyaring virus pada setiap paket",
        "Menerjemahkan alamat IP menjadi nama domain",
      ],
      answer: 1,
    },
    {
      question: "Karakteristik yang tepat untuk TCP adalah ...",
      options: [
        "Tidak membangun koneksi dan tidak menjamin urutan data",
        "Hanya digunakan untuk jaringan lokal",
        "Berorientasi koneksi dan menyediakan pengiriman yang andal",
        "Mengubah alamat MAC menjadi alamat IP",
      ],
      answer: 2,
    },
    {
      question:
        "Mengapa UDP sering dipilih untuk komunikasi real-time seperti suara langsung?",
      options: [
        "UDP selalu menjamin setiap paket sampai berurutan",
        "UDP memiliki overhead rendah dan tidak menunggu retransmisi",
        "UDP melakukan routing antarjaringan",
        "UDP memberikan alamat IP kepada klien",
      ],
      answer: 1,
    },
    {
      question:
        "Berapa jumlah alamat host yang dapat digunakan pada subnet IPv4 /24?",
      options: ["128", "252", "254", "256"],
      answer: 2,
    },
    {
      question: "Alamat 192.168.10.5 termasuk kategori alamat ...",
      options: [
        "IPv4 privat",
        "IPv4 multicast",
        "IPv4 loopback",
        "IPv6 link-local",
      ],
      answer: 0,
    },
    {
      question: "Perangkat menggunakan default gateway ketika ingin ...",
      options: [
        "Menghubungi perangkat lain pada subnet yang sama",
        "Mengirim paket ke jaringan di luar subnet lokal",
        "Mengetahui nama domain dari alamat IP",
        "Mencari alamat MAC milik dirinya sendiri",
      ],
      answer: 1,
    },
    {
      question: "Switch Ethernet umumnya meneruskan frame berdasarkan ...",
      options: [
        "Nomor port TCP",
        "Nama domain",
        "Alamat MAC tujuan",
        "Alamat DNS",
      ],
      answer: 2,
    },
  ],
};
const QUIZ_TEMPLATES = [
  {
    prompt: (topic, course) =>
      `Apa tujuan utama mempelajari ${topic} dalam ${course}?`,
    correct: "Memahami konsep dan menerapkannya pada masalah yang relevan.",
    wrong: [
      "Menghafal istilah tanpa memahami konsepnya.",
      "Mengabaikan konteks masalah yang sedang dibahas.",
      "Menggunakan satu cara yang sama untuk semua masalah.",
    ],
  },
  {
    prompt: (topic) =>
      `Sebelum menerapkan ${topic}, langkah awal yang paling tepat adalah ...`,
    correct: "Mengidentifikasi tujuan, konteks, dan informasi yang dibutuhkan.",
    wrong: [
      "Langsung memilih jawaban tanpa membaca persoalan.",
      "Mengabaikan batasan dan kondisi yang tersedia.",
      "Menyalin metode lain tanpa memeriksa kesesuaiannya.",
    ],
  },
  {
    prompt: (topic) =>
      `Bagaimana memilih pendekatan yang tepat untuk persoalan terkait ${topic}?`,
    correct:
      "Membandingkan pendekatan berdasarkan kebutuhan dan bukti yang tersedia.",
    wrong: [
      "Memilih pendekatan secara acak.",
      "Selalu memakai pendekatan yang paling rumit.",
      "Mengabaikan hasil yang diperoleh.",
    ],
  },
  {
    prompt: (topic) =>
      `Cara terbaik untuk memeriksa hasil penerapan ${topic} adalah ...`,
    correct:
      "Membandingkan hasil dengan tujuan dan kriteria yang telah ditentukan.",
    wrong: [
      "Menganggap hasil benar tanpa pemeriksaan.",
      "Mengubah kriteria setelah melihat hasil.",
      "Mengabaikan data yang tidak mendukung dugaan awal.",
    ],
  },
  {
    prompt: (topic) =>
      `Jika hasil analisis ${topic} tidak sesuai harapan, apa tindakan yang tepat?`,
    correct: "Memeriksa kembali asumsi, data, dan langkah yang digunakan.",
    wrong: [
      "Menghapus hasil yang tidak sesuai tanpa menelusuri sebabnya.",
      "Mengubah data agar cocok dengan harapan.",
      "Mengulang langkah yang sama tanpa evaluasi.",
    ],
  },
  {
    prompt: (topic) =>
      `Informasi yang paling berguna saat mengkaji ${topic} adalah ...`,
    correct: "Informasi yang relevan dengan masalah dan dapat diverifikasi.",
    wrong: [
      "Informasi yang paling banyak, meskipun tidak berkaitan.",
      "Dugaan yang belum didukung bukti.",
      "Data lama tanpa memeriksa kesesuaiannya.",
    ],
  },
  {
    prompt: (topic) =>
      `Mengapa batasan masalah perlu diperhatikan saat membahas ${topic}?`,
    correct: "Agar analisis tetap terarah dan kesimpulan sesuai konteks.",
    wrong: [
      "Agar informasi penting tidak perlu diperiksa.",
      "Agar semua kemungkinan dianggap sama.",
      "Agar hasil dapat ditentukan sebelum analisis.",
    ],
  },
  {
    prompt: (topic) =>
      `Saat membandingkan dua solusi untuk ${topic}, sebaiknya ...`,
    correct:
      "Menilai kelebihan dan kekurangannya berdasarkan kriteria yang sama.",
    wrong: [
      "Membandingkan solusi dengan kriteria yang berbeda-beda.",
      "Memilih solusi hanya dari tampilannya.",
      "Mengabaikan kebutuhan pengguna atau tujuan masalah.",
    ],
  },
  {
    prompt: (topic) =>
      `Salah satu cara mengurangi kesalahan ketika mengerjakan ${topic} adalah ...`,
    correct: "Memeriksa kembali data, proses, dan hasil secara sistematis.",
    wrong: [
      "Melewati langkah pemeriksaan agar lebih cepat.",
      "Mengandalkan ingatan tanpa melihat informasi soal.",
      "Menganggap satu contoh berlaku untuk semua kasus.",
    ],
  },
  {
    prompt: (topic) =>
      `Kesimpulan yang baik setelah mempelajari ${topic} harus ...`,
    correct: "Didukung hasil analisis dan menjawab tujuan pembahasan.",
    wrong: [
      "Hanya mengulang dugaan sebelum analisis.",
      "Memuat informasi yang tidak berkaitan dengan masalah.",
      "Mengabaikan bukti yang telah diperiksa.",
    ],
  },
];
function quizQuestions(c, w) {
  if (QUIZ_BANK[c.kode]) return QUIZ_BANK[c.kode];
  const topics = MTOP[c.kode] || [];
  return QUIZ_TEMPLATES.map((template, i) => {
    const topic = topics[(w + i - 1) % topics.length] || tp(c, w) || c.nama;
    const options = [template.correct, ...template.wrong];
    const shift = i % options.length;
    return {
      question: template.prompt(topic, c.nama),
      options: options.slice(shift).concat(options.slice(0, shift)),
      answer: (options.length - shift) % options.length,
    };
  });
}
function quizClockText(ms) {
  const seconds = Math.ceil(ms / 1000);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
function quizDurationText(seconds) {
  const minutes = Math.floor(seconds / 60),
    remainder = seconds % 60;
  return `${minutes} menit ${remainder} detik`;
}
function tickQuizClock() {
  for (const [key, run] of Object.entries(QUIZ_RUN)) {
    const remaining = Math.max(0, run.endsAt - Date.now());
    const clock = document.querySelector(`[data-quiz-clock="${key}"]`);
    if (clock) clock.textContent = quizClockText(remaining);
    if (!remaining) submitQ(key, true);
  }
  if (!Object.keys(QUIZ_RUN).length) {
    clearInterval(quizClock);
    quizClock = null;
  }
}
function startQ(key, cid, w, k) {
  const questions = quizQuestions(find(cid), w),
    startedAt = Date.now();
  QUIZ_RUN[key] = {
    answers: Array(questions.length).fill(null),
    startedAt,
    endsAt: startedAt + QUIZ_DURATION_MS,
    cid,
    w,
    k,
  };
  if (!quizClock) quizClock = setInterval(tickQuizClock, 1000);
  reshowQ(cid, w, k);
}
function submitQ(key, expired = false) {
  const run = QUIZ_RUN[key];
  if (!run) return;
  const c = find(run.cid),
    questions = quizQuestions(c, run.w),
    answered = run.answers.filter((answer) => answer !== null).length;
  if (!expired && answered < questions.length)
    return toast(
      `Jawab semua soal terlebih dahulu (${answered}/${questions.length}).`,
    );
  const correct = questions.filter(
      (q, i) => run.answers[i] === q.answer,
    ).length,
    durationSeconds = Math.min(
      QUIZ_DURATION_MS / 1000,
      Math.floor((Date.now() - run.startedAt) / 1000),
    );
  SUB[key] = {
    skor: Math.round((correct / questions.length) * 100),
    correct,
    total: questions.length,
    answers: run.answers.slice(),
    durationSeconds,
    expired,
  };
  done[key] = 1;
  delete QUIZ_RUN[key];
  const modal = $("#modal"),
    visible = modal.classList.contains("on") && modal.dataset.quizKey == key;
  if (visible)
    reshow(
      run.cid,
      run.w,
      run.k,
      expired
        ? "Waktu habis. Kuis dikumpulkan otomatis."
        : "Kuis berhasil dikumpulkan.",
    );
  else
    toast(
      expired
        ? "Waktu kuis habis; jawaban dikumpulkan otomatis."
        : "Kuis berhasil dikumpulkan.",
    );
}
const okb = (t) => `<span class="badge b-ok">${t}</span>`,
  szf = (b) =>
    b >= 1048576
      ? (b / 1048576).toFixed(1).replace(".", ",") + " MB"
      : Math.max(1, Math.round(b / 1024)) + " KB";
const mkTh = (c, t) => ({
  post: [
    c.dosen,
    `Bagaimana penerapan ${t} pada kasus nyata? Berikan contoh dan alasan Anda.`,
    "2 hari lalu",
  ],
  cm: [
    {
      n: "Rizky Ramadhan",
      t: `Menurut saya ${t} relevan untuk sistem akademik kampus karena datanya terstruktur dan sering diakses.`,
      w: "1 hari lalu",
      r: [
        {
          n: "Nabila Putri",
          to: "Rizky Ramadhan",
          t: "Setuju, Rizky. Menurut saya pendekatan itu juga lebih mudah dipelihara.",
          w: "23 jam lalu",
        },
        {
          n: "Dimas Saputra",
          to: "Rizky Ramadhan",
          t: "Saya kurang setuju sedikit. Apakah tidak lebih rumit saat data bertambah banyak?",
          w: "22 jam lalu",
        },
        {
          n: c.dosen,
          to: "Rizky Ramadhan",
          t: "Contoh yang baik. Coba jelaskan alasan pemilihan pendekatannya.",
          w: "20 jam lalu",
        },
        {
          n: "Rizky Ramadhan",
          to: "Dimas Saputra",
          t: "Bisa jadi, Dimas. Karena itu perlu dirancang sejak awal agar mudah dikembangkan.",
          w: "18 jam lalu",
        },
      ],
    },
    {
      n: "Salsabila Rahma",
      t: `Penerapan ${t} juga perlu mempertimbangkan kebutuhan pengguna dan keterbatasan perangkat.`,
      w: "16 jam lalu",
      r: [
        {
          n: "Nabila Putri",
          to: "Salsabila Rahma",
          t: "Betul, Salsabila. Kebutuhan pengguna sebaiknya dikumpulkan lebih dulu.",
          w: "14 jam lalu",
        },
        {
          n: "Dimas Saputra",
          to: "Salsabila Rahma",
          t: "Setuju, dan perlu diuji pada perangkat yang berbeda-beda.",
          w: "12 jam lalu",
        },
      ],
    },
  ],
});
function tg(id) {
  const e = document.getElementById(id);
  e.style.display = e.style.display == "none" ? "block" : "none";
}
function showItem(cid, w, k) {
  const c = find(cid),
    it = itemsOf(w, c)[k],
    key = cid + "-" + w + "-" + k,
    ty = it[0],
    t = tp(c, w),
    isV = it[1] == "video",
    sb = SUB[key],
    run = QUIZ_RUN[key];
  const H = (a, b) =>
    `<div style="margin-top:1.1rem"><b style="color:var(--hd)">${a}</b><div style="margin-top:.35rem">${b}</div></div>`;
  const kv = (a) =>
    `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:.6rem;margin-top:1rem">${a.map((x) => `<div style="background:var(--bg);border-radius:.4rem;padding:.55rem .8rem"><div class="mu">${x[0]}</div><b style="color:var(--hd)">${x[1]}</b></div>`).join("")}</div>`;
  const kv4 = (a) =>
    `<div class="grid kv4" style="gap:.6rem;margin-top:1rem">${a.map((x) => `<div style="background:var(--bg);border-radius:.4rem;padding:.55rem .8rem"><div class="mu">${x[0]}</div><b style="color:var(--hd)">${x[1]}</b></div>`).join("")}</div>`;
  const ol = (a) =>
    `<ol style="margin:0;padding-left:1.2rem">${a.map((x) => `<li>${x}</li>`).join("")}</ol>`;
  let b = "",
    f = "";
  if (ty == "materi") {
    const dn = att(c)[w - 1] == "H";
    b =
      kv([["Dosen", c.dosen]]) +
      (isV
        ? `<div style="margin-top:1rem;aspect-ratio:16/9;border-radius:.5rem;background:#232333;display:grid;place-items:center;color:#fff">${ic("video", 48)}</div>`
        : "") +
      H(
        "Deskripsi",
        `Materi ini membahas ${t} pada pertemuan ${w}. Pelajari sebelum sesi kelas agar diskusi berjalan lebih efektif.`,
      ) +
      H(
        "Capaian pembelajaran",
        ol([
          "Memahami konsep " + t,
          "Menerapkan konsep pada contoh kasus sederhana",
          "Menyiapkan pertanyaan untuk sesi diskusi kelas",
        ]),
      ) +
      H(
        "Berkas",
        `<div class="row" style="padding:.6rem .8rem;border:1px solid var(--bd);border-radius:.4rem"><span class="ic b-pr">${ic(it[1])}</span><div style="min-width:0"><b style="color:var(--hd);overflow-wrap:anywhere">Pertemuan_${w}_${t.replace(/\s+/g, "_").replace(/[^\w]/g, "")}${isV ? ".mp4" : ".txt"}</b><div class="mu">${isV ? "MP4 · 18 mnt · 96 MB" : "TXT · materi demo"}</div></div><span class="sp"></span><button class="btn s o" ${isV ? `onclick="toast('Video belum tersedia di versi demo')"` : `onclick="downloadMaterial(${cid},${w},${k})"`}>${isV ? "Putar" : "Unduh"}</button></div>`,
      );
    f = dn
      ? '<span class="btn material-status">Sudah dipelajari</span>'
      : `<button class="btn" onclick="markMaterialStudied(${cid},${w},${k})">Tandai selesai dipelajari</button>`;
  } else if (ty == "tugas") {
    const exam = it[4],
      n = w / 2,
      fm = [
        ["ZIP", "zip"],
        ["PDF", "pdf"],
        ["DOCX", "docx"],
      ][n % 3],
      S = exam ? (done[key] ? "done" : "open") : ts(c, w, key),
      bS = TST[(n - 1 + c.id) % 4],
      [st, en] = exam ? tw(c, w) : twS(c, w, bS),
      sc = 70 + ((c.id * 7 + w * 3) % 28),
      canCancel = S == "done" && sb && NOW <= en;
    const sl = {
      done: "Sudah dikumpulkan",
      wait: "Belum dimulai",
      open: "Dapat dikumpulkan",
      closed: "Ditutup",
    }[S];
    const SF = `<div class="row" style="padding:.6rem .8rem;border:1px solid var(--bd);border-radius:.4rem;margin-top:.7rem"><span class="ic b-pr">${ic("file")}</span><div style="min-width:0"><b style="color:var(--hd);overflow-wrap:anywhere">Soal_${exam || "Tugas_" + n}.pdf</b><div class="mu">PDF · 320 KB · Diunggah dosen</div></div><span class="sp"></span><button class="btn s o" onclick="toast('Simulasi: berkas soal tersedia di sistem')">Unduh</button></div>`;
    const q3 = {
      pdf: "Tuliskan jawaban dalam satu dokumen PDF.",
      docx: "Tuliskan jawaban dalam dokumen Word (DOCX).",
      zip: "Kompres berkas program dan laporan singkat menjadi satu berkas ZIP.",
    }[fm[1]];
    const fbox = (name, size, extra) =>
      `<div class="row" style="padding:.6rem .8rem;border:1px solid var(--bd);border-radius:.4rem;margin-top:.5rem"><span class="ic b-wr">${ic("file")}</span><div style="min-width:0"><b style="color:var(--hd);overflow-wrap:anywhere">${name}</b><div class="mu">${size}</div></div><span class="sp"></span>${extra}</div>`;
    const subFiles = sb
      ? sb.files
      : [{ name: `${exam || "Tugas_" + n}_${U.nim}.${fm[1]}`, size: 1258291 }];
    const sentAt = sb
      ? sb.t
      : fmtD(
          new Date(st.getFullYear(), st.getMonth(), st.getDate() + 1, 19, 30),
        );
    const stg = STG[key] || [];
    b =
      kv([
        ["Waktu mulai", fmtD(st)],
        ["Batas pengumpulan", fmtD(en)],
        ["Status", sl],
      ]) +
      H(
        "Soal dari dosen",
        exam
          ? `<div>Jawab seluruh pertanyaan esai ujian <b>${exam}</b> untuk materi <b>${t}</b>:</div>` +
              ol([
                `Jelaskan konsep-konsep utama ${t} secara runtut dengan bahasa Anda sendiri.`,
                `Analisis sebuah kasus nyata yang berkaitan dengan ${t}, lalu uraikan langkah penyelesaian dan alasan Anda.`,
                `Sampaikan kesimpulan serta evaluasi Anda terhadap solusi yang digunakan. Susun jawaban dalam dokumen PDF atau DOCX.`,
              ]) +
              SF
          : `<div>Kerjakan soal berikut terkait <b>${t}</b>:</div>` +
              ol([
                `Jelaskan konsep utama ${t} dengan bahasa Anda sendiri.`,
                `Berikan satu contoh penerapan ${t} pada kasus nyata.`,
                q3,
              ]) +
              SF,
      ) +
      H(
        "Jawaban Anda",
        S == "done"
          ? subFiles
              .map((x) =>
                fbox(
                  x.name,
                  szf(x.size),
                  `<button class="btn s o" onclick="toast('Simulasi: berkas terkirim tersimpan di sistem')">Unduh</button>`,
                ),
              )
              .join("") +
              `${sb && sb.note ? `<div class="mu" style="margin-top:.5rem">Catatan: ${sb.note}</div>` : ""}<div class="mu" style="margin-top:.5rem">Dikirim ${sentAt}</div><div style="margin-top:.5rem">Nilai: <b style="color:var(--hd)">${sb ? "Belum dinilai" : sc}</b></div>${canCancel ? `<button class="btn s o" style="margin-top:.8rem" onclick="cancelT('${key}',${cid},${w},${k})">Batalkan pengumpulan</button><div class="mu" style="margin-top:.4rem">Anda dapat membatalkan dan mengunggah ulang selama waktu pengumpulan masih berlangsung (sampai ${fmtD(en)}).</div>` : ""}`
          : S == "wait"
            ? `<div class="alert b-wr" style="margin:0">Pengumpulan belum dibuka. Tugas dapat dikumpulkan mulai ${fmtD(st)}.</div>`
            : S == "closed"
              ? `<div class="alert b-er" style="margin:0">Waktu pengumpulan telah berakhir pada ${fmtD(en)}. Tugas tidak dapat dikumpulkan.</div><div style="margin-top:.7rem">Nilai: <b style="color:var(--hd)">0</b></div>`
              : `<input class="inp" type="file" id="sf" multiple aria-label="Berkas tugas" onchange="stageFiles('${key}',${cid},${w},${k})">${stg.length ? stg.map((f, i) => fbox(f.name, szf(f.size), `<button class="ib" title="Hapus berkas" aria-label="Hapus berkas" onclick="unstage('${key}',${i},${cid},${w},${k})">${ic("trash", 16)}</button>`)).join("") : '<div class="mu" style="margin-top:.4rem">Belum ada berkas dipilih. Anda dapat memilih lebih dari satu berkas.</div>'}<textarea class="inp" id="sn" rows="2" style="margin-top:.7rem" placeholder="Catatan untuk dosen (opsional)">${DRAFTN[key] || ""}</textarea>`,
      );
    f =
      S == "open"
        ? `<button class="btn" onclick="subT('${key}',${cid},${w},${k})">Kumpulkan tugas</button>`
        : "";
  } else if (ty == "kuis") {
    const KS = kt(c, w, key),
      [kst, ken] = ktW(c, w, KS),
      questions = quizQuestions(c, w);
    const ksl = {
      done: "Selesai",
      wait: "Belum dimulai",
      open: "Belum dikerjakan",
      closed: "Tidak dikerjakan",
    }[KS];
    b =
      kv([
        ["Jumlah soal", 10],
        ["Durasi", "20 menit"],
        ["Waktu mulai", fmtD(kst)],
        ["Batas pengerjaan", fmtD(ken)],
        ["Status", ksl],
      ]) +
      H(
        "Petunjuk",
        ol([
          `Kuis berisi ${questions.length} soal pilihan ganda.`,
          "Waktu 20 menit mulai dihitung setelah tombol Mulai kuis dipilih.",
          "Jawab semua soal sebelum mengumpulkan jawaban.",
        ]),
      ) +
      (KS == "done"
        ? H(
            "Hasil kuis",
            sb?.answers
              ? `Nilai: <b style="color:var(--hd)">${sb.skor}</b> (${sb.correct}/${sb.total} benar) · Durasi pengerjaan ${quizDurationText(sb.durationSeconds)}${sb.expired ? " · Waktu habis" : ""}`
              : `Nilai simulasi: <b style="color:var(--hd)">${76 + ((cid * 13 + w * 7) % 23)}/100</b>. Rincian jawaban kuis ini tidak tersedia.`,
          ) +
          (sb?.answers
            ? H(
                "Pembahasan",
                questions
                  .map((question, i) => {
                    const selected = sb.answers[i],
                      correct = selected === question.answer;
                    return `<div class="quiz-review"><b>${i + 1}. ${question.question}</b><div class="${correct ? "quiz-correct" : "quiz-incorrect"}">${correct ? "Benar" : "Perlu ditinjau"} · Jawaban Anda: ${selected == null ? "Belum dijawab" : question.options[selected]}</div><div class="mu">Kunci jawaban: ${question.options[question.answer]}</div></div>`;
                  })
                  .join(""),
              )
            : "")
        : KS == "wait"
          ? H(
              "Status",
              `<div class="alert b-wr" style="margin:0">Kuis belum dibuka. Dapat dikerjakan mulai ${fmtD(kst)}.</div>`,
            )
          : KS == "closed"
            ? H(
                "Status",
                `<div class="alert b-er" style="margin:0">Waktu pengerjaan telah berakhir pada ${fmtD(ken)}. Kuis tidak dapat dikerjakan.</div><div style="margin-top:.7rem">Nilai: <b style="color:var(--hd)">0</b></div>`,
              )
            : run
              ? H(
                  "Soal pilihan ganda",
                  `<div class="quiz-status"><span id="quiz-progress">0 dari ${questions.length} soal dijawab</span><span class="badge b-wr" data-quiz-clock="${key}">${quizClockText(Math.max(0, run.endsAt - Date.now()))}</span></div><div class="quiz-list">${questions
                    .map(
                      (question, i) =>
                        `<fieldset class="quiz-q"><legend>${i + 1}. ${question.question}</legend>${question.options
                          .map(
                            (option, j) =>
                              `<label class="quiz-option"><input type="radio" name="quiz-${key}-${i}" value="${j}" data-quiz-answer="${key}|${i}" ${run.answers[i] === j ? "checked" : ""}><span>${option}</span></label>`,
                          )
                          .join("")}</fieldset>`,
                    )
                    .join("")}</div>`,
                )
              : "");
    f =
      KS == "open"
        ? run
          ? `<button class="btn" onclick="submitQ('${key}')">Kumpulkan jawaban</button>`
          : `<button class="btn" onclick="startQ('${key}',${cid},${w},${k})">Mulai kuis</button>`
        : "";
  } else {
    const th = TH[key] || (TH[key] = mkTh(c, t)),
      all = th.cm.flatMap((x) => [x].concat(x.r)),
      my = all.filter((x) => x.n == U.nama).length,
      pp = new Set(all.filter((x) => !isDos(x.n)).map((x) => x.n)).size;
    const rb = (i, j, to) => {
      const sf = i + "_" + j;
      return `<div id="rf${sf}" style="display:none;margin:.6rem 0 0 2.6rem"><textarea class="inp" id="rt${sf}" rows="2" placeholder="Balas ${to.split(" ")[0]}…"></textarea><button class="btn s" style="margin-top:.4rem" onclick="subR('${key}',${cid},${w},${k},${i},'${sf}','${to}')">Kirim balasan</button></div>`;
    };
    const one = (x, i, j, sz, st) =>
      `<div class="row" style="align-items:flex-start;${st}">${av(x.n, sz, x.n == U.nama ? U.foto : null)}<div style="flex:1;min-width:0"><b style="color:var(--hd)">${who(x.n)}</b> <span class="mu">${x.w}</span>${x.to ? `<div class="mu">↪ membalas <b style="color:var(--hd)">${who(x.to)}</b></div>` : ""}<div>${x.t}</div><button class="btn s l" style="margin-top:.4rem" onclick="tg('rf${i}_${j}')">Balas</button></div></div>${rb(i, j, x.n)}`;
    const cm = (x, i) =>
      `<div style="padding:.7rem 0;border-top:1px solid var(--bd)">${one(x, i, "t", 34, "")}${x.r.map((y, j) => one(y, i, j, 28, "margin:.6rem 0 0 2.6rem;padding-left:.8rem;border-left:2px solid var(--bd)")).join("")}</div>`;
    b =
      kv4([
        ["Dibuka oleh", who(c.dosen)],
        ["Syarat partisipasi", "Minimal 3 komentar"],
        ["Komentar Anda", `${my} dari 3 ${my >= 3 ? okb("Terpenuhi") : ""}`],
        ["Mahasiswa berkomentar", pp],
      ]) +
      H(
        "Pertanyaan diskusi",
        `<div style="background:var(--prl);border-radius:.4rem;padding:.7rem .9rem"><b style="color:var(--hd)">${who(th.post[0])}</b> <span class="mu">${th.post[2]}</span><div>${th.post[1]}</div></div>`,
      ) +
      H("Komentar", th.cm.map(cm).join("")) +
      `<label for="dt">Tulis komentar</label><textarea class="inp" id="dt" rows="3" placeholder="Sampaikan pendapat Anda…"></textarea>`;
    f = `<button class="btn" onclick="subD('${key}',${cid},${w},${k})">Kirim komentar</button>`;
  }
  modal(
    `<div class="card" style="max-width:660px;width:100%;max-height:88vh;overflow:auto"><div class="row" style="align-items:flex-start"><span class="ic ${TY[ty][1]}">${ic(it[1])}</span><div style="min-width:0"><span class="badge ${TY[ty][1]}">${isV ? "Materi video" : TY[ty][0]}</span><h4 style="margin-top:.3rem">${it[2]}</h4><div class="mu">${c.nama} · Pertemuan ${w}</div></div><span class="sp"></span><button class="ib" onclick="closeM()" aria-label="Tutup">✕</button></div>${b}<div class="row" style="margin-top:1.3rem;justify-content:flex-end;flex-wrap:wrap"><button class="btn o" onclick="closeM()">Tutup</button>${f}</div></div>`,
  );
  if (ty == "kuis" && run) $("#modal").dataset.quizKey = key;
}
function downloadMaterial(cid, w, k) {
  const c = find(cid),
    it = c && itemsOf(w, c)[k];
  if (!it || it[0] != "materi" || it[1] != "file")
    return toast("Berkas materi tidak ditemukan.");
  const topic = tp(c, w),
    filename = `Pertemuan_${w}_${topic.replace(/\s+/g, "_").replace(/[^\w]/g, "")}.txt`,
    content = [
      "Materi Pembelajaran (Demo LMS UNINDRA)",
      `Mata kuliah: ${c.nama}`,
      `Pertemuan: ${w} - ${topic}`,
      `Dosen: ${c.dosen}`,
      "",
      `Materi ini membahas ${topic} pada pertemuan ${w}.`,
      "",
      "Capaian pembelajaran:",
      `- Memahami konsep ${topic}.`,
      "- Menerapkan konsep pada contoh kasus sederhana.",
      "- Menyiapkan pertanyaan untuk sesi diskusi kelas.",
    ].join("\n");
  try {
    const url = URL.createObjectURL(
        new Blob([content], { type: "text/plain;charset=utf-8" }),
      ),
      link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.error("Materi tidak dapat diunduh.", error);
    return toast("Unduhan materi gagal. Silakan coba lagi.");
  }
  if (!recordAttendance(c, w))
    return toast("Materi diunduh, tetapi presensi gagal disimpan.");
  done[`${cid}-${w}-${k}`] = 1;
  reshow(cid, w, k, `Materi diunduh. Presensi pertemuan ${w} tercatat hadir.`);
}
function markMaterialStudied(cid, w, k) {
  const c = find(cid),
    it = c && itemsOf(w, c)[k];
  if (!it || it[0] != "materi")
    return toast("Materi tidak ditemukan.");
  if (w > SEM[smOf(c)].week)
    return toast("Materi pertemuan ini belum dibuka.");
  if (!recordAttendance(c, w))
    return toast("Presensi gagal disimpan. Silakan coba lagi.");
  done[`${cid}-${w}-${k}`] = 1;
  reshow(
    cid,
    w,
    k,
    `Materi selesai dipelajari. Presensi pertemuan ${w} tercatat hadir.`,
  );
}
function reshow(cid, w, k, msg) {
  const cd = $("#modal .card"),
    sc = cd ? cd.scrollTop : 0;
  render();
  showItem(cid, w, k);
  const n = $("#modal .card");
  if (n) n.scrollTop = sc;
  toast(msg);
}
function fin(key, cid, w, k, msg) {
  done[key] = 1;
  reshow(cid, w, k, msg);
}
function reshowQ(cid, w, k) {
  const cd = $("#modal .card"),
    sc = cd ? cd.scrollTop : 0;
  render();
  showItem(cid, w, k);
  const n = $("#modal .card");
  if (n) n.scrollTop = sc;
}
function stageFiles(key, cid, w, k) {
  const inp = $("#sf"),
    note = $("#sn");
  if (note) DRAFTN[key] = note.value;
  const arr = (STG[key] = STG[key] || []);
  for (const f of inp.files) arr.push(f);
  reshowQ(cid, w, k);
}
function unstage(key, idx, cid, w, k) {
  const note = $("#sn");
  if (note) DRAFTN[key] = note.value;
  STG[key].splice(idx, 1);
  reshowQ(cid, w, k);
}
function subT(key, cid, w, k) {
  const c = find(cid);
  const exam = itemsOf(w, c)[k][4],
    status = exam ? (done[key] ? "done" : "open") : ts(c, w, key);
  if (status != "open")
    return toast("Pengumpulan tidak tersedia pada waktu ini");
  const files = STG[key] || [];
  if (!files.length) return toast("Pilih minimal satu berkas tugas");
  const big = files.find((f) => f.size > 5 * 1048576);
  if (big) return toast('Berkas "' + big.name + '" melebihi 5 MB');
  SUB[key] = {
    files: files.map((f) => ({ name: f.name, size: f.size })),
    rawFiles: files,
    note: ($("#sn").value || "").trim().replace(/</g, "&lt;"),
    t: fmtD(NOW),
  };
  delete STG[key];
  delete DRAFTN[key];
  fin(key, cid, w, k, "Tugas berhasil dikumpulkan");
}
function cancelT(key, cid, w, k) {
  const submission = SUB[key];
  if (submission?.rawFiles?.length) STG[key] = submission.rawFiles;
  if (submission?.note) DRAFTN[key] = submission.note;
  delete SUB[key];
  delete done[key];
  reshow(
    cid,
    w,
    k,
    "Pengumpulan dibatalkan. Silakan unggah ulang jawaban Anda.",
  );
}
function addC(key, cid, w, k, tgt, i, to) {
  const v = $(tgt).value.trim();
  if (!v) return toast("Tulis komentar terlebih dahulu");
  const o = { n: U.nama, t: v.replace(/</g, "&lt;"), w: "Baru saja" };
  if (i == null) TH[key].cm.push(Object.assign(o, { r: [] }));
  else {
    o.to = to;
    TH[key].cm[i].r.push(o);
  }
  if (
    TH[key].cm.flatMap((x) => [x].concat(x.r)).filter((x) => x.n == U.nama)
      .length >= 3
  )
    done[key] = 1;
  reshow(cid, w, k, "Komentar terkirim");
}
function subD(key, cid, w, k) {
  addC(key, cid, w, k, "#dt", null);
}
function subR(key, cid, w, k, i, sf, to) {
  addC(key, cid, w, k, "#rt" + sf, i, to);
}
document.addEventListener("change", (e) => {
  const answer = e.target.closest("[data-quiz-answer]");
  if (answer) {
    const [key, index] = answer.dataset.quizAnswer.split("|"),
      run = QUIZ_RUN[key];
    if (run) {
      run.answers[Number(index)] = Number(answer.value);
      const progress = $("#quiz-progress");
      if (progress) {
        const count = run.answers.filter((value) => value !== null).length;
        progress.textContent = `${count} dari ${run.answers.length} soal dijawab`;
      }
    }
  }
  if (e.target.id == "ss" || e.target.id == "ss2") {
    const v = e.target.value;
    sem = v.replace(" (aktif)", "");
    const c = $("#cls");
    if (c) c.innerHTML = sideCls();
    const x = $("#ss2");
    if (x) x.value = v;
    render();
  }
});
function pesan() {
  const v = vis();
  if (v.length && !v.includes(msgOpen)) msgOpen = v[0];
  if (!v.length)
    return (
      head(
        "Notifikasi",
        "Pesan dari dosen, bagian akademik, dan pengingat tenggat",
      ) + '<div class="card mu">Tidak ada notifikasi.</div>'
    );
  const m = MSG[msgOpen],
    r = RP[msgOpen] || [];
  return `${head("Notifikasi", "Pesan dari dosen, bagian akademik, dan pengingat tenggat")}<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr))"><div class="card" style="padding:.4rem">${v
    .map((i) => {
      const x = MSG[i],
        rd = RD["m" + i];
      return `<div class="mrow" data-m="${i}" style="border-radius:.4rem;${i == msgOpen ? "background:var(--prl)" : ""}">${av(x[0], 38)}<div style="min-width:0"><b style="color:var(--hd);font-weight:${rd ? 500 : 700}">${x[1]}</b><div class="mu">${who(x[0])} · ${x[3]}</div></div></div>`;
    })
    .join(
      "",
    )}${unr() ? '<div style="padding:.5rem"><button class="btn s l" onclick="mall()">Tandai semua dibaca</button></div>' : ""}</div>
<div class="card"><div class="row" style="align-items:flex-start">${av(m[0], 44)}<div><b style="color:var(--hd)">${m[1]}</b><div class="mu">Dari ${who(m[0])} · ${m[3]} lalu</div></div><span class="sp"></span>${RD["m" + msgOpen] ? '<span class="mu">Sudah dibaca</span>' : '<button class="btn s l" onclick="mread()">Tandai dibaca</button>'}<button class="ib" title="Hapus" aria-label="Hapus notifikasi" onclick="mdel()">${ic("trash")}</button></div><p style="margin:1.2rem 0 .8rem">${m[2]}</p><b style="color:var(--hd)">Balasan (${r.length})</b>${r.length ? r.map((x) => `<div class="row" style="align-items:flex-start;padding:.6rem 0;border-top:1px solid var(--bd);margin-top:.5rem">${av(x[0], 34, x[0] == U.nama ? U.foto : null)}<div><b style="color:var(--hd)">${who(x[0])}</b> <span class="mu">${x[2]}</span><div>${x[1]}</div></div></div>`).join("") : '<div class="mu">Belum ada balasan.</div>'}<label for="rp">Tulis balasan</label><textarea class="inp" id="rp" rows="3" placeholder="Tulis balasan…"></textarea><button class="btn" style="margin-top:.8rem" id="sd">Kirim balasan</button></div></div>`;
}
function profil() {
  return `${head("Profil", "Kelola informasi akun Anda")}<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr))"><div class="card"><div class="row" style="align-items:flex-start;flex-wrap:wrap">${av(U.nama, 96, U.foto)}<div><h4>${U.nama}</h4><span class="badge b-pr">${U.tipe}</span><div class="row" style="margin-top:.7rem"><label class="btn l s" style="margin:0;cursor:pointer">Ganti foto<input type="file" id="ph" accept="image/*" hidden></label><button class="btn o s" id="rf">Hapus</button></div><div class="mu" style="margin-top:.4rem">JPG atau PNG, maks. 2 MB</div></div></div>
<div style="margin-top:1.2rem">${[
    ["NPM", U.nim],
    ["Jenis user", U.tipe],
    ["Program studi", U.prodi + " (" + U.jenjang + ")"],
    ["Nomor telepon", U.tel],
    ["Email", U.email],
    ["Terakhir mengunjungi", U.login],
  ]
    .map(
      (r) =>
        `<div class="row" style="padding:.6rem 0;border-bottom:1px solid var(--bd)"><span class="mu" style="width:150px">${r[0]}</span><span style="color:var(--hd);overflow-wrap:anywhere">${r[1]}</span></div>`,
    )
    .join("")}</div></div>
<div class="card"><h4>Ubah kata sandi</h4><label for="o">Kata sandi lama</label><input class="inp" id="o" type="password"><label for="n">Kata sandi baru</label><input class="inp" id="n" type="password"><label for="n2">Ulangi kata sandi baru</label><input class="inp" id="n2" type="password"><div id="pe"></div><button class="btn" style="margin-top:1rem" id="sv">Simpan kata sandi</button></div></div>`;
}
function bindPage() {
  document.querySelectorAll("#page .dd>.btn").forEach(
    (b) =>
      (b.onclick = (e) => {
        e.stopPropagation();
        const d = b.parentNode,
          o = d.classList.contains("open");
        document
          .querySelectorAll(".dd")
          .forEach((x) => x.classList.remove("open"));
        if (!o) d.classList.add("open");
      }),
  );
  const s = $("#sd");
  if (s)
    s.onclick = () => {
      const v = $("#rp").value.trim();
      if (!v) return toast("Tulis balasan terlebih dahulu");
      (RP[msgOpen] = RP[msgOpen] || []).push([
        U.nama,
        v.replace(/</g, "&lt;"),
        "Baru saja",
      ]);
      render();
      toast("Balasan terkirim");
    };
  const ph = $("#ph");
  if (ph) {
    ph.onchange = (e) => {
      const f = e.target.files[0];
      if (!f) return;
      if (f.size > 2e6) return toast("Ukuran foto melebihi 2 MB");
      const r = new FileReader();
      r.onload = () => {
        U.foto = r.result;
        shell();
        render();
        toast("Foto profil diperbarui");
      };
      r.readAsDataURL(f);
    };
    $("#rf").onclick = () => {
      U.foto = null;
      shell();
      render();
    };
    $("#sv").onclick = () => {
      const o = $("#o").value,
        n = $("#n").value,
        n2 = $("#n2").value;
      const e = !o
        ? "Kata sandi lama wajib diisi."
        : n.length < 8
          ? "Kata sandi baru minimal 8 karakter."
          : n != n2
            ? "Ulangi kata sandi tidak sama."
            : "";
      $("#pe").innerHTML = e
        ? `<div class="alert b-er">${e}</div>`
        : '<div class="alert b-ok">Kata sandi berhasil diubah.</div>';
    };
  }
}
function render() {
  const h = location.hash.slice(1) || "login",
    [r, a] = h.split("/");
  if (r == "login") {
    $("#modal").classList.remove("on");
    if (U.online) {
      go("dashboard");
      return;
    }
    return login();
  }
  if (r == "lupa") return lupa();
  if (!U.online) {
    go("login");
    return;
  }
  if (!$("#main")) shell();
  document
    .querySelectorAll(".mi")
    .forEach((m) => m.classList.toggle("on", m.dataset.r == h));
  const pg =
    {
      dashboard: dashboard,
      presensi: presensi,
      pesan: pesan,
      profil: profil,
      kelas: () => kelas(a),
    }[r] || dashboard;
  if (r != "kelas") window.kf = "all";
  $("#page").innerHTML = pg();
  bindPage();
  refreshNav();
}
addEventListener("hashchange", () => {
  if (["login", "lupa"].includes(location.hash.slice(1))) {
    $("#app").innerHTML = "";
  }
  window.scrollTo(0, 0);
  render();
});
if (!location.hash) location.hash = U.online ? "dashboard" : "login";
render();
